interface WindowTitleBarProps {
  title: string
  onClose: () => void
  onMinimize: () => void
}

export function WindowTitleBar({ title, onClose, onMinimize }: WindowTitleBarProps) {
  return (
    <div className="flex items-center gap-2 px-3 h-9 bg-surface-container-high cursor-grab active:cursor-grabbing select-none">
      {/* Traffic lights */}
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
      <div className="w-3 h-3 rounded-full bg-outline/20 flex-shrink-0" aria-hidden="true" />
      {/* Path-style title */}
      <span className="ml-2 font-mono text-xs text-on-surface-variant tracking-wide truncate">
        <span aria-hidden="true">~/</span><span>{title}</span><span aria-hidden="true">/</span>
      </span>
      {/* Right-side status indicator */}
      <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-tertiary opacity-60" aria-hidden="true" />
        <span className="font-mono text-[10px] text-on-surface-variant/60">SECURE</span>
      </div>
    </div>
  )
}
