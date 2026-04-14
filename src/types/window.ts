import type { ComponentType } from 'react'

export interface WindowState {
  id: string
  title: string
  component: ComponentType
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  isMinimized: boolean
  isFocused: boolean
}

export interface WindowStoreState {
  windows: Record<string, WindowState>
  maxZIndex: number
  openWindow: (config: Omit<WindowState, 'zIndex' | 'isMinimized' | 'isFocused'>) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updatePosition: (id: string, position: { x: number; y: number }) => void
  updateSize: (id: string, size: { width: number; height: number }) => void
}
