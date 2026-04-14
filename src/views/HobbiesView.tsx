import { HOBBIES } from '../constants/hobbies'

export function HobbiesView() {
  return (
    <div className="space-y-6 font-sans">
      <h2 className="font-display text-headline-md text-on-surface">Hobbies</h2>
      <div className="space-y-8">
        {HOBBIES.map((hobby) => (
          <div key={hobby.id} className="flex gap-4">
            <span className="text-2xl leading-tight shrink-0">{hobby.icon}</span>
            <div className="space-y-1">
              <h3 className="text-headline-sm text-on-surface">{hobby.name}</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {hobby.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
