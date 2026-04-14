import { useEffect, useState } from 'react'
import { BIOS_LINES } from '../../constants/biosLines'

interface BIOSBootProps {
  onBootComplete: () => void
}

export function BIOSBoot({ onBootComplete }: BIOSBootProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    BIOS_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line])
      }, i * 60)
      timers.push(t)
    })

    const completionDelay = BIOS_LINES.length * 60 + 400
    const done = setTimeout(onBootComplete, completionDelay)
    timers.push(done)

    return () => timers.forEach(clearTimeout)
  }, [onBootComplete])

  return (
    <div className="fixed inset-0 bg-surface-container-lowest font-mono flex flex-col justify-center p-12">
      <div className="max-w-2xl space-y-0">
        {visibleLines.map((line, i) => (
          <div key={i} className="text-tertiary text-sm leading-6">
            {line || '\u00A0'}
          </div>
        ))}
        <span className="inline-block w-2 h-[1em] bg-tertiary animate-pulse" />
      </div>
    </div>
  )
}
