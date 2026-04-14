import { CV_DATA } from '../constants/cv'

export function AboutView() {
  return (
    <div className="space-y-6 font-sans text-on-surface-variant">
      <div>
        <h1 className="font-display text-display-sm text-on-surface">{CV_DATA.name}</h1>
        <p className="font-mono text-label-sm text-tertiary mt-1">{CV_DATA.title}</p>
      </div>
      <p className="text-body-md leading-relaxed">{CV_DATA.summary}</p>
      <div className="space-y-2 pt-2">
        <a
          href={`mailto:${CV_DATA.email}`}
          className="block font-mono text-label-sm text-primary hover:text-primary-container transition-colors"
        >
          {CV_DATA.email}
        </a>
        <a
          href={`https://${CV_DATA.github}`}
          target="_blank"
          rel="noreferrer"
          className="block font-mono text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
        >
          {CV_DATA.github}
        </a>
        <a
          href={`https://${CV_DATA.linkedin}`}
          target="_blank"
          rel="noreferrer"
          className="block font-mono text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
        >
          {CV_DATA.linkedin}
        </a>
      </div>
    </div>
  )
}
