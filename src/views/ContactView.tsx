import { useState } from 'react'
import { CV_DATA } from '../constants/cv'
import { useCMSContent, withFallback } from '../lib/cms'

const toHref = (url: string) => (url.startsWith('http') ? url : `https://${url}`)

// Derive forms endpoint from VITE_CMS_ENDPOINT when set by Vercel, else use
// the CMS public base. VITE_CMS_ENDPOINT looks like:
//   https://cms-backend-roman.vercel.app/content/laurian-duma-portfolio[/draft]
// We want:
//   <host>/forms/laurian-duma-portfolio/contact_form
const CMS_ENDPOINT_ENV = (import.meta.env?.VITE_CMS_ENDPOINT as string | undefined) ?? ''
const CMS_HOST = CMS_ENDPOINT_ENV
  ? CMS_ENDPOINT_ENV.replace(/\/content\/[^/]+(\/draft)?$/, '')
  : 'https://cms-backend-roman.vercel.app'
const FORMS_ENDPOINT = `${CMS_HOST}/forms/laurian-duma-portfolio/contact_form`

export function ContactView() {
  const { data: cms } = useCMSContent()
  const cvEntries = (cms?.content.cv as { entries?: Record<string, string> } | undefined)?.entries
  const email    = withFallback(cvEntries?.email,    CV_DATA.email)
  const github   = withFallback(cvEntries?.github,   CV_DATA.github)
  const linkedin = withFallback(cvEntries?.linkedin, CV_DATA.linkedin)

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="font-mono space-y-4">
      <p className="text-xs text-on-surface-variant tracking-widest uppercase">
        CLASSIFICATION: UNCLASSIFIED // CONTACT_PROTOCOLS
      </p>
      <p className="text-sm text-on-surface-variant font-sans leading-relaxed">
        Secure communication channels available. Currently open to senior engineer and tech-lead opportunities.
      </p>

      {/* Social links */}
      <div className="space-y-2">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-3 p-4 bg-surface-container rounded-sm hover:bg-surface-container-high transition-colors group cyber-glow"
        >
          <span className="text-xs text-primary w-20 shrink-0 tracking-wide">EMAIL</span>
          <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{email}</span>
        </a>
        <a
          href={toHref(github)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-4 bg-surface-container rounded-sm hover:bg-surface-container-high transition-colors group cyber-glow"
        >
          <span className="text-xs text-primary w-20 shrink-0 tracking-wide">GITHUB</span>
          <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{github}</span>
        </a>
        <a
          href={toHref(linkedin)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-4 bg-surface-container rounded-sm hover:bg-surface-container-high transition-colors group cyber-glow"
        >
          <span className="text-xs text-primary w-20 shrink-0 tracking-wide">LINKEDIN</span>
          <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{linkedin}</span>
        </a>
      </div>

      {/* Contact form */}
      <div className="bg-surface-container rounded-sm p-4 space-y-3">
        <p className="text-xs text-primary tracking-wide">SEND_MESSAGE</p>
        {status === 'sent' ? (
          <p className="text-sm text-tertiary font-sans">✓ Message transmitted successfully.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-surface text-on-surface text-sm px-3 py-2 rounded-sm border border-outline/20 focus:outline-none focus:border-primary/50 font-sans"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-surface text-on-surface text-sm px-3 py-2 rounded-sm border border-outline/20 focus:outline-none focus:border-primary/50 font-sans"
            />
            <textarea
              required
              rows={4}
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full bg-surface text-on-surface text-sm px-3 py-2 rounded-sm border border-outline/20 focus:outline-none focus:border-primary/50 font-sans resize-none"
            />
            {status === 'error' && (
              <p className="text-xs text-red-400 font-sans">Transmission failed. Try again.</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-4 py-2 bg-primary text-on-primary text-xs tracking-wide rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {status === 'sending' ? 'TRANSMITTING…' : 'TRANSMIT'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
