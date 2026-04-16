import { EXPERIENCE } from '../constants/experience'
import { useCMSContent } from '../lib/cms'

export function ExperienceView() {
  const { data: cms } = useCMSContent()

  const cmsItems = (cms?.content.experience as { items?: Record<string, unknown>[] } | undefined)?.items
  const entries = cmsItems
    ? cmsItems.map((item, i) => ({
        id: `exp-${i}`,
        company: String(item.company ?? ''),
        role:    String(item.role    ?? ''),
        period:  String(item.period  ?? ''),
        bullets: Array.isArray(item.bullets) ? (item.bullets as string[]) : [],
      }))
    : EXPERIENCE

  return (
    <div className="font-mono space-y-4">
      {/* Classification header */}
      <p className="text-xs text-on-surface-variant tracking-widest uppercase">
        CLASSIFICATION: RESTRICTED // PERSONNEL_RECORDS
      </p>

      {entries.map((entry, idx) => {
        const isActive = entry.period.includes('Present')
        return (
          <div key={entry.id} className="bg-surface-container rounded-sm p-4 space-y-3">
            {/* Top row: status + period */}
            <div className="flex items-center justify-between gap-2">
              <span className={[
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs tracking-wide',
                isActive
                  ? 'text-tertiary bg-tertiary/10'
                  : 'text-on-surface-variant bg-surface-container-high',
              ].join(' ')}>
                <span aria-hidden="true">{isActive ? '●' : '■'}</span>
                {isActive ? 'ACTIVE' : 'COMPLETED'}
              </span>
              <span className="text-xs text-on-surface-variant">{entry.period}</span>
            </div>
            {/* Role */}
            <div>
              <p className="text-base text-on-surface font-medium">{entry.role}</p>
              <p className="text-xs text-primary mt-0.5">{entry.company}</p>
            </div>
            {/* Bullets */}
            <ul className="space-y-2">
              {entry.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-sm text-on-surface-variant leading-relaxed">
                  <span className="text-tertiary select-none shrink-0">›</span>
                  <span className="font-sans">{bullet}</span>
                </li>
              ))}
            </ul>
            {/* Metrics row — first entry only */}
            {idx === 0 && (
              <div className="pt-2 border-t border-outline/20 flex flex-wrap gap-3 text-xs text-on-surface-variant">
                <span className="text-tertiary">METRICS</span>
                <span>40%_bundle_reduction</span>
                <span>5_teams_served</span>
                <span>60+_components</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
