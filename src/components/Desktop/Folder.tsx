import type { ComponentType } from 'react'
import { useWindowStore } from '../../stores/useWindowStore'
import { useFolderStore } from '../../stores/useFolderStore'

interface FolderProps {
  id: string
  label: string
  icon: string
  windowId: string
  position: { x: number; y: number }
  windowComponent: ComponentType
  defaultSize: { width: number; height: number }
}

export function Folder({
  id, label, icon, windowId, position, windowComponent, defaultSize,
}: FolderProps) {
  const { openFolder } = useFolderStore()
  const { openWindow } = useWindowStore()

  const handleDoubleClick = () => {
    openFolder(id)
    openWindow({
      id: windowId,
      title: label,
      component: windowComponent,
      position: { x: 140 + Math.random() * 120, y: 70 + Math.random() * 80 },
      size: defaultSize,
    })
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${label}`}
      onDoubleClick={handleDoubleClick}
      onKeyDown={(e) => {
        if (e.repeat) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleDoubleClick()
        }
      }}
      style={{ left: position.x, top: position.y }}
      className="absolute flex flex-col items-center gap-1 p-2 rounded cursor-pointer select-none
                 hover:bg-surface-container-high/60 transition-colors w-16 group"
    >
      <span className="text-3xl leading-none">{icon}</span>
      <span className="font-mono text-label-sm text-on-surface-variant text-center leading-tight
                       group-hover:text-on-surface transition-colors">
        {label}
      </span>
    </div>
  )
}
