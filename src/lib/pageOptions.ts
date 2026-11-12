/**
 * src/lib/pageOptions.ts — CMS display options (ADR-0013) for the portfolio.
 *
 * The site is one page (the desktop) whose windows are its sections, so it
 * has one options service: `home_page_options` (CMS tab "Home"). The defaults
 * below are the designed look and are used whenever the service (or one of
 * its values) is missing, so the site never depends on the CMS for layout.
 */
import type { CSSProperties } from 'react'
import type { CMSContent } from './cms'
import { contrastRatio, inkOn, readOptions, readableOn } from './cms-rich-text'

/** How wide the content windows open (the terminal keeps its own size,
 *  the About photo keeps its designed size).
 *  narrow   — 85 % of each window's designed width
 *  standard — the designed widths (the original look)
 *  wide     — 130 %, kept inside the desktop
 *  full     — the window spans the desktop */
export type ContentWidth = 'narrow' | 'standard' | 'wide' | 'full'

export const HOME_PAGE_DEFAULTS = {
  background: '',
  card_background: '',
  content_width: 'standard',
  /** left | right — side of the About window the photo column sits on */
  photo_position: 'left',
  /** The skills grid (CODE_CERTIFICATIONS) in the About window */
  show_skills: true,
}

export type HomePageOptions = typeof HOME_PAGE_DEFAULTS

export function homePageOptions(cms: CMSContent | null): HomePageOptions {
  return readOptions(cms?.content.home_page_options, HOME_PAGE_DEFAULTS)
}

/** Space kept between a resized window and the desktop edge. */
const WINDOW_GAP = 12

/**
 * Position and width a content window opens at for `width`, or null to keep
 * the designed ones. `x` is relative to the desktop canvas's left edge (the
 * window's static position), `desktopWidth` is the canvas width.
 */
export function windowFit(
  width: string,
  win: { x: number; width: number },
  desktopWidth: number,
): { x: number; width: number } | null {
  if (width === 'narrow') return { x: win.x, width: Math.round(win.width * 0.85) }
  if (width === 'wide') {
    const room = desktopWidth - win.x - WINDOW_GAP
    return { x: win.x, width: Math.max(win.width, Math.min(Math.round(win.width * 1.3), room)) }
  }
  if (width === 'full') {
    return { x: WINDOW_GAP, width: Math.max(280, desktopWidth - 2 * WINDOW_GAP) }
  }
  return null
}

/** Designed card text colours (tailwind.config.js). */
const CARD_INK = '#ffffff' // on-surface
const PRIMARY = '#86adff'
const TERTIARY = '#69fd5d'

/** `a` laid over `b` at `amount` (0–1), as #rrggbb. */
function mix(a: string, b: string, amount: number): string {
  const channel = (i: number) =>
    Math.round(parseInt(a.slice(i, i + 2), 16) * amount + parseInt(b.slice(i, i + 2), 16) * (1 - amount))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(1)}${channel(3)}${channel(5)}`
}

/** Card text colour and the chip/hover lift (the designed surface-container-high):
 *  the site's white when it stays readable on both, else a dark ink, else
 *  black or white on a card with no lift. */
function cardInk(card: string): { ink: string; chip: string } {
  for (const ink of [CARD_INK, inkOn(card), inkOn(card, '#000000')]) {
    const chip = mix(ink, card, 0.08)
    if (contrastRatio(ink, chip) >= 4.5) return { ink, chip }
  }
  return { ink: inkOn(card, '#000000'), chip: card }
}

/** `color` moved just far enough to reach 4.5:1 on every surface, else `ink`. */
function readableAccent(color: string, surfaces: string[], ink: string): string {
  const out = surfaces.reduce((c, s) => readableOn(c, s, 4.5), color)
  return surfaces.every((s) => contrastRatio(out, s) >= 4.5) ? out : ink
}

/**
 * Class + CSS variables that apply the client's colours. Put both on the
 * desktop wrapper and mark every customisable card with `page-card`. See
 * "Client-chosen colours" in index.css. The site has one dark design and no
 * light/dark switch, so the colours always apply. No text sits directly on
 * the desktop background (windows have their own surfaces), so only the
 * cards need a text colour; every card text colour reaches 4.5:1.
 */
export function pageSurface(options: {
  background: string
  card_background: string
}): { className: string; style: CSSProperties } {
  const { background, card_background: card } = options
  const classes: string[] = []
  const vars: Record<string, string> = {}
  if (background) {
    classes.push('page-custom-bg')
    vars['--page-bg'] = background
  }
  if (card) {
    const { ink, chip } = cardInk(card)
    // Lime 10 % tint behind the experience "ACTIVE" pill.
    const limeTint = mix(TERTIARY, card, 0.1)
    classes.push('page-custom-card')
    vars['--page-card-bg'] = card
    vars['--page-card-chip'] = chip
    vars['--page-card-ink'] = ink
    // on-surface-variant is white at ~64 % over the designed card.
    vars['--page-card-muted'] = readableAccent(mix(ink, card, 0.64), [card, chip], ink)
    vars['--page-card-primary'] = readableAccent(PRIMARY, [card, chip], ink)
    vars['--page-card-tertiary'] = readableAccent(TERTIARY, [card, chip, limeTint], ink)
  }
  return { className: classes.join(' '), style: vars as CSSProperties }
}
