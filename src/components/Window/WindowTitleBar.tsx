interface WindowTitleBarProps {
  title: string
  onClose: () => void
  onMinimize: () => void
}

export function WindowTitleBar({ title, onClose, onMinimize }: WindowTitleBarProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-high cursor-grab active:cursor-grabbing select-none">
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="w-3 h-3 rounded-full bg-error-dim hover:bg-error transition-colors flex-shrink-0"
        aria-label="Close window"
      />
      <button
        onClick={(e) => { e.stopPropagation(); onMinimize() }}
        className="w-3 h-3 rounded-full bg-outline hover:bg-on-surface-variant transition-colors flex-shrink-0"
        aria-label="Minimize window"
      />
      <div className="w-3 h-3 rounded-full bg-outline/30 flex-shrink-0" aria-hidden="true" />
      <span className="ml-2 font-sans text-body-sm text-on-surface-variant tracking-wide truncate">
        {title}
      </span>
    </div>
  )
}
