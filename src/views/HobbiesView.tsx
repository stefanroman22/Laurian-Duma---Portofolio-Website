import { HOBBIES } from '../constants/hobbies'

export function HobbiesView() {
  return (
    <div className="font-mono space-y-4 text-xs">
      <p className="text-[10px] text-on-surface-variant tracking-widest uppercase">
        CLASSIFICATION: UNCLASSIFIED // INTERESTS_FILE
      </p>
      <div className="space-y-3">
        {HOBBIES.map((hobby) => (
          <div key={hobby.id} className="bg-surface-container rounded-sm p-3 flex gap-3 cyber-glow">
            <span className="text-xl leading-tight shrink-0" aria-hidden="true">{hobby.icon}</span>
            <div className="space-y-0.5">
              <p className="text-xs text-on-surface uppercase tracking-wide">{hobby.name}</p>
              <p className="text-xs text-on-surface-variant font-sans leading-relaxed">{hobby.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
