/**
 * src/lib/cms.ts — CMS fetch helpers for the Ghost Shell OS portfolio.
 *
 * Cache strategy: ETag-based conditional fetching.
 * - First load: full fetch, ETag stored alongside data.
 * - Subsequent fetches (within same session or across navigations): sends
 *   If-None-Match header. Server returns 304 Not Modified (~10 ms) if content
 *   is unchanged, or 200 with fresh content if it changed.
 * - On page refresh: module cache is cleared; fresh fetch runs automatically.
 * - Result: changes made in the CMS are visible on the very next page refresh,
 *   and in-session views revalidate every REVALIDATE_MS milliseconds.
 */

import { useState, useEffect, useRef } from 'react'
import cmsConfig from '../../cms.config.json'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CMSEntry {
  _type: string
  _label: string
  [key: string]: unknown
}

export interface CMSContent {
  project_slug: string
  project_name: string
  last_updated: string | null
  content: Record<string, CMSEntry>
}

// ── Internal cache ────────────────────────────────────────────────────────────

interface CacheEntry {
  data: CMSContent
  etag: string | null
  fetchedAt: number
}

let _cache: CacheEntry | null = null

// How often to revalidate in the background while the page is open.
// With ETag, a "no change" revalidation is ~10 ms and costs no bandwidth.
const REVALIDATE_MS = 10_000  // 10 seconds

// Env-var-first URL resolution. VITE_CMS_ENDPOINT (set on Vercel by the CMS
// onboarding agent) holds the full URL including slug + optional /draft suffix.
// When unset, fall back to the project-local cms.config.json.
const ENV_ENDPOINT = (import.meta.env?.VITE_CMS_ENDPOINT as string | undefined) ?? ''
const PREVIEW_TOKEN = (import.meta.env?.VITE_CMS_PREVIEW_TOKEN as string | undefined) ?? ''
const CMS_URL = ENV_ENDPOINT || `${cmsConfig.endpoint}/${cmsConfig.projectSlug}`

// ── Core fetch (ETag-aware) ───────────────────────────────────────────────────

/**
 * Fetches content from the CMS.
 * Sends If-None-Match when an ETag is cached — server returns 304 if unchanged.
 * On preview deployments, sends X-CMS-Preview-Token so the CMS returns drafts.
 * Returns null on 304 (caller should keep using cached data).
 */
async function fetchCMS(): Promise<CMSContent | null> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (_cache?.etag) {
    headers['If-None-Match'] = _cache.etag
  }
  if (PREVIEW_TOKEN) {
    headers['X-CMS-Preview-Token'] = PREVIEW_TOKEN
  }

  const res = await fetch(CMS_URL, {
    cache: 'no-store',   // bypass browser HTTP cache; we manage freshness via ETag
    headers,
  })

  if (res.status === 304) {
    // Content unchanged — update fetchedAt so the revalidation timer resets
    if (_cache) _cache.fetchedAt = Date.now()
    return null
  }

  if (!res.ok) {
    throw new Error(`CMS fetch failed: ${res.status} ${res.statusText}`)
  }

  const data: CMSContent = await res.json()
  _cache = { data, etag: res.headers.get('etag'), fetchedAt: Date.now() }
  return data
}

/** One-shot fetch — always goes to the network (ignores module cache). */
export async function getCMSContentFresh(): Promise<CMSContent> {
  _cache = null
  const data = await fetchCMS()
  if (!data) throw new Error('Unexpected 304 on cold fetch')
  return data
}

// ── React hook ────────────────────────────────────────────────────────────────

interface UseCMSContentResult {
  data: CMSContent | null
  loading: boolean
  error: string | null
}

/**
 * Fetches all public content for this project.
 * - Returns cached data immediately while revalidating in the background.
 * - Revalidates every REVALIDATE_MS ms while the hook is mounted.
 * - Falls back gracefully: if the CMS is unreachable, `data` stays null
 *   and callers should fall back to hard-coded constants via withFallback().
 */
export function useCMSContent(): UseCMSContentResult {
  const [data, setData] = useState<CMSContent | null>(_cache?.data ?? null)
  const [loading, setLoading] = useState(_cache === null)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    async function revalidate() {
      try {
        const fresh = await fetchCMS()
        if (!mountedRef.current) return
        if (fresh !== null) {
          // New content arrived (200 response)
          setData(fresh)
          setError(null)
        }
        // fresh === null → 304, cached data is still current — no state update needed
      } catch (err: unknown) {
        if (!mountedRef.current) return
        setError(err instanceof Error ? err.message : 'CMS fetch failed')
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    }

    // Initial fetch
    revalidate()

    // Periodic background revalidation while page is open
    const timer = setInterval(revalidate, REVALIDATE_MS)

    return () => {
      mountedRef.current = false
      clearInterval(timer)
    }
  }, [])

  return { data, loading, error }
}

// ── Typed accessor helpers ────────────────────────────────────────────────────

/** Returns a service's content, or undefined if not yet loaded. */
export function getService<T extends CMSEntry>(
  cms: CMSContent | null,
  key: string,
): T | undefined {
  return cms?.content[key] as T | undefined
}

/**
 * Returns live CMS value or falls back to the provided default.
 * Use this to keep the site functional even when the CMS is unreachable.
 *
 * @example
 *   const name = withFallback(cms?.content.cv?.entries?.name, CV_DATA.name)
 */
export function withFallback<T>(live: T | null | undefined, fallback: T): T {
  return live ?? fallback
}
