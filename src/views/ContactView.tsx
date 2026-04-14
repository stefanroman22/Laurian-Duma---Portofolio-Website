import { CV_DATA } from '../constants/cv'

const toHref = (url: string) => (url.startsWith('http') ? url : `https://${url}`)

export function ContactView() {
  return (
    <div className="font-mono space-y-4 text-xs">
      <p className="text-[10px] text-on-surface-variant tracking-widest uppercase">
        CLASSIFICATION: UNCLASSIFIED // CONTACT_PROTOCOLS
      </p>
      <p className="text-on-surface-variant font-sans leading-relaxed">
        Secure communication channels available. Currently open to senior engineer and tech-lead opportunities.
      </p>
      <div className="space-y-2">
        <a
          href={`mailto:${CV_DATA.email}`}
          className="flex items-center gap-3 p-3 bg-surface-container rounded-sm hover:bg-surface-container-high transition-colors group cyber-glow"
        >
          <span className="text-[10px] text-primary w-16 shrink-0 tracking-wide">EMAIL</span>
          <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">{CV_DATA.email}</span>
        </a>
        <a
          href={toHref(CV_DATA.github)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-3 bg-surface-container rounded-sm hover:bg-surface-container-high transition-colors group cyber-glow"
        >
          <span className="text-[10px] text-primary w-16 shrink-0 tracking-wide">GITHUB</span>
          <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">{CV_DATA.github}</span>
        </a>
        <a
          href={toHref(CV_DATA.linkedin)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-3 bg-surface-container rounded-sm hover:bg-surface-container-high transition-colors group cyber-glow"
        >
          <span className="text-[10px] text-primary w-16 shrink-0 tracking-wide">LINKEDIN</span>
          <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">{CV_DATA.linkedin}</span>
        </a>
      </div>
    </div>
  )
}
