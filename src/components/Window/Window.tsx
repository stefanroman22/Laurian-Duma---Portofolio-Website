import { motion, useDragControls } from 'framer-motion'
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
  const dragControls = useDragControls()

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
      dragListener={false}
      dragControls={dragControls}
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
        boxShadow: isFocused
          ? '0px 20px 40px rgba(0, 17, 255, 0.12), 0 0 0 1px rgba(73,72,71,0.15)'
          : '0px 20px 40px rgba(0, 17, 255, 0.06)',
      }}
      className="glass-panel rounded-lg overflow-hidden"
    >
      <div
        className="window-drag-handle cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <WindowTitleBar
          title={title}
          onClose={() => closeWindow(id)}
          onMinimize={() => minimizeWindow(id)}
        />
      </div>
      <div className="p-4 h-[calc(100%-2.25rem)] overflow-auto bg-surface-container-low">
        <Component />
      </div>
    </motion.div>
  )
}
