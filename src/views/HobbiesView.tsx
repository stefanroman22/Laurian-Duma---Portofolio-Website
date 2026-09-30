import { HOBBIES } from '../constants/hobbies'
import { useCMSContent } from '../lib/cms'
import { RichText } from '../lib/cms-rich-text'

export function HobbiesView() {
  const { data: cms } = useCMSContent()

  const cmsItems = (cms?.content.hobbies as { items?: Record<string, unknown>[] } | undefined)?.items
  const hobbies = cmsItems
    ? cmsItems.map((item, i) => ({
        id:          `h-${i}`,
        name:        String(item.name        ?? ''),
        description: String(item.description ?? ''),
        icon:        String(item.icon        ?? ''),
      }))
    : HOBBIES

  return (
    <div className="font-mono space-y-4">
      <p className="text-xs text-on-surface-variant tracking-widest uppercase">
        CLASSIFICATION: UNCLASSIFIED // INTERESTS_FILE
      </p>
      <div className="space-y-3">
        {hobbies.map((hobby) => (
          <div key={hobby.id} className="bg-surface-container rounded-sm p-4 flex gap-4 cyber-glow">
            <span className="text-2xl leading-tight shrink-0" aria-hidden="true">{hobby.icon}</span>
            <div className="space-y-1">
              <p className="text-sm text-on-surface uppercase tracking-wide">{hobby.name}</p>
              <RichText as="div" format="rich" value={hobby.description} className="text-sm text-on-surface-variant font-sans leading-relaxed" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
