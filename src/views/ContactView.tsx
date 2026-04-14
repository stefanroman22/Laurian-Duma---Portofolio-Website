import { CV_DATA } from '../constants/cv'

export function ContactView() {
  return (
    <div className="space-y-6 font-sans">
      <h2 className="font-display text-headline-md text-on-surface">Contact</h2>
      <p className="text-body-md text-on-surface-variant leading-relaxed">
        Interested in working together? I'm currently open to senior engineer and tech-lead
        opportunities. Reach out via email or find me on the platforms below.
      </p>
      <div className="space-y-4 pt-2">
        <a
          href={`mailto:${CV_DATA.email}`}
          className="flex items-center gap-3 p-3 bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors group"
        >
          <span className="font-mono text-label-sm text-primary w-16 shrink-0">email</span>
          <span className="font-mono text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
            {CV_DATA.email}
          </span>
        </a>
        <a
          href={`https://${CV_DATA.github}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-3 bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors group"
        >
          <span className="font-mono text-label-sm text-primary w-16 shrink-0">github</span>
          <span className="font-mono text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
            {CV_DATA.github}
          </span>
        </a>
        <a
          href={`https://${CV_DATA.linkedin}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-3 bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors group"
        >
          <span className="font-mono text-label-sm text-primary w-16 shrink-0">linkedin</span>
          <span className="font-mono text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
            {CV_DATA.linkedin}
          </span>
        </a>
      </div>
    </div>
  )
}
