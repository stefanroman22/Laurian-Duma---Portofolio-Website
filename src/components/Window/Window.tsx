import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { WindowTitleBar } from './WindowTitleBar'
import { useWindowStore } from '../../stores/useWindowStore'

interface WindowProps {
  id: string
  title: string
  component: ComponentType
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  isMinimized: boolean
  isFocused: boolean
}

export function Window({
  id, title, component: Component,
  position, size, zIndex, isMinimized, isFocused,
}: WindowProps) {
  const { closeWindow, minimizeWindow, focusWindow, updatePosition } = useWindowStore()

  if (isMinimized) return null

  return (
    <motion.div
      key={id}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      drag
      dragMomentum={false}
      dragHandle=".window-drag-handle"
      onDragEnd={(_, info) => {
        updatePosition(id, {
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        })
      }}
      onMouseDown={() => focusWindow(id)}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
      className={[
        'bg-surface-variant backdrop-blur-[40px]',
        'rounded-lg overflow-hidden shadow-window',
        isFocused ? 'ring-1 ring-outline-variant/15' : 'ring-0',
      ].join(' ')}
    >
      <div className="window-drag-handle">
        <WindowTitleBar
          title={title}
          onClose={() => closeWindow(id)}
          onMinimize={() => minimizeWindow(id)}
        />
      </div>
      <div className="p-4 h-[calc(100%-2.5rem)] overflow-auto bg-surface-container">
        <Component />
      </div>
    </motion.div>
  )
}
