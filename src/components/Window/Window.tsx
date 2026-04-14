import { motion, useDragControls, useMotionValue } from 'framer-motion'
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

const HANDLES = [
  { dir: 'n',  cls: 'top-0 left-3 right-3 h-1.5 cursor-n-resize' },
  { dir: 's',  cls: 'bottom-0 left-3 right-3 h-1.5 cursor-s-resize' },
  { dir: 'e',  cls: 'right-0 top-3 bottom-3 w-1.5 cursor-e-resize' },
  { dir: 'w',  cls: 'left-0 top-3 bottom-3 w-1.5 cursor-w-resize' },
  { dir: 'nw', cls: 'top-0 left-0 w-3 h-3 cursor-nw-resize' },
  { dir: 'ne', cls: 'top-0 right-0 w-3 h-3 cursor-ne-resize' },
  { dir: 'sw', cls: 'bottom-0 left-0 w-3 h-3 cursor-sw-resize' },
  { dir: 'se', cls: 'bottom-0 right-0 w-3 h-3 cursor-se-resize' },
]

export function Window({
  id, title, component: Component,
  position, size, zIndex, isMinimized, isFocused,
}: WindowProps) {
  const { closeWindow, minimizeWindow, focusWindow, updatePosition, updateSize } = useWindowStore()
  const dragControls = useDragControls()
  // Drive position through FM motion values so the transform system owns it
  // end-to-end — no CSS left/top fighting FM's translate on drag release.
  const x = useMotionValue(position.x)
  const y = useMotionValue(position.y)
  const w = useMotionValue(size.width)
  const h = useMotionValue(size.height)

  if (isMinimized) return null

  const startResize = (e: React.PointerEvent<HTMLDivElement>, dir: string) => {
    e.stopPropagation()
    e.preventDefault()
    focusWindow(id)

    const startClientX = e.clientX
    const startClientY = e.clientY
    const startW = w.get()
    const startH = h.get()
    const startPX = x.get()
    const startPY = y.get()
    const MIN_W = 280
    const MIN_H = 180

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startClientX
      const dy = ev.clientY - startClientY
      if (dir.includes('e')) w.set(Math.max(MIN_W, startW + dx))
      if (dir.includes('s')) h.set(Math.max(MIN_H, startH + dy))
      if (dir.includes('w')) {
        const nw = Math.max(MIN_W, startW - dx)
        w.set(nw)
        x.set(startPX + startW - nw)
      }
      if (dir.includes('n')) {
        const nh = Math.max(MIN_H, startH - dy)
        h.set(nh)
        y.set(startPY + startH - nh)
      }
    }

    const onUp = () => {
      updateSize(id, { width: Math.round(w.get()), height: Math.round(h.get()) })
      updatePosition(id, { x: Math.round(x.get()), y: Math.round(y.get()) })
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

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
      onDragEnd={() => {
        updatePosition(id, { x: x.get(), y: y.get() })
      }}
      onMouseDown={() => focusWindow(id)}
      style={{
        position: 'fixed',
        x,
        y,
        width: w,
        height: h,
        zIndex,
        boxShadow: isFocused
          ? '0px 20px 40px rgba(0, 17, 255, 0.12), 0 0 0 1px rgba(73,72,71,0.15)'
          : '0px 20px 40px rgba(0, 17, 255, 0.06)',
      }}
      className="glass-panel rounded-lg relative"
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
      <div className="absolute inset-0 top-9 overflow-auto bg-surface-container-low">
        <Component />
      </div>
      {HANDLES.map(({ dir, cls }) => (
        <div
          key={dir}
          className={`absolute z-[60] ${cls}`}
          onPointerDown={(e) => startResize(e, dir)}
        />
      ))}
    </motion.div>
  )
}
