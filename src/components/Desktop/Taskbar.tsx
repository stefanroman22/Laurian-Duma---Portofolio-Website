import { useState, useEffect } from 'react'
import { useWindowStore } from '../../stores/useWindowStore'

export function Taskbar() {
  const { windows, restoreWindow, focusWindow } = useWindowStore()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-surface-container z-[9999] flex items-center px-4 gap-2">
      <div className="flex-1 flex items-center gap-1 overflow-hidden">
        {Object.values(windows).map((win) => (
          <button
            key={win.id}
            onClick={() => (win.isMinimized ? restoreWindow(win.id) : focusWindow(win.id))}
            className={[
              'px-3 py-1 font-mono text-label-sm rounded-sm transition-colors truncate max-w-[120px]',
              win.isFocused && !win.isMinimized
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface',
            ].join(' ')}
          >
            {win.title}
          </button>
        ))}
      </div>
      <time
        className="font-mono text-label-sm text-on-surface-variant tabular-nums shrink-0"
        dateTime={now.toISOString()}
      >
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </time>
    </div>
  )
}
