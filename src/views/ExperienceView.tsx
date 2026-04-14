import { EXPERIENCE } from '../constants/experience'

export function ExperienceView() {
  return (
    <div className="space-y-8 font-sans">
      <h2 className="font-display text-headline-md text-on-surface">Experience</h2>
      {EXPERIENCE.map((entry) => (
        <div key={entry.id} className="space-y-3">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-headline-sm text-on-surface">{entry.role}</h3>
              <span className="font-mono text-label-sm text-on-surface-variant shrink-0">
                {entry.period}
              </span>
            </div>
            <p className="font-mono text-label-sm text-tertiary">{entry.company}</p>
          </div>
          <ul className="space-y-2">
            {entry.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-3 text-body-md text-on-surface-variant">
                <span className="text-primary select-none shrink-0">›</span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
