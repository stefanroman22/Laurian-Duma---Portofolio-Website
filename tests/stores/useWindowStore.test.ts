import { beforeEach, describe, expect, it } from 'vitest'
import { useWindowStore } from '../../src/stores/useWindowStore'

const STUB_WINDOW = {
  id: 'win-1',
  title: 'Test Window',
  component: () => null,
  position: { x: 100, y: 100 },
  size: { width: 400, height: 300 },
}

describe('useWindowStore', () => {
  beforeEach(() => {
    useWindowStore.setState({ windows: {}, maxZIndex: 0 })
  })

  it('opens a window with isFocused=true and isMinimized=false', () => {
    useWindowStore.getState().openWindow(STUB_WINDOW)
    const win = useWindowStore.getState().windows['win-1']
    expect(win).toBeDefined()
    expect(win.isMinimized).toBe(false)
    expect(win.isFocused).toBe(true)
  })

  it('removes a window on close', () => {
    useWindowStore.getState().openWindow(STUB_WINDOW)
    useWindowStore.getState().closeWindow('win-1')
    expect(useWindowStore.getState().windows['win-1']).toBeUndefined()
  })

  it('sets isMinimized=true and isFocused=false on minimize', () => {
    useWindowStore.getState().openWindow(STUB_WINDOW)
    useWindowStore.getState().minimizeWindow('win-1')
    const win = useWindowStore.getState().windows['win-1']
    expect(win.isMinimized).toBe(true)
    expect(win.isFocused).toBe(false)
  })

  it('restores a minimized window with isMinimized=false and isFocused=true', () => {
    useWindowStore.getState().openWindow(STUB_WINDOW)
    useWindowStore.getState().minimizeWindow('win-1')
    useWindowStore.getState().restoreWindow('win-1')
    const win = useWindowStore.getState().windows['win-1']
    expect(win.isMinimized).toBe(false)
    expect(win.isFocused).toBe(true)
  })

  it('increments maxZIndex and sets isFocused on focusWindow', () => {
    useWindowStore.getState().openWindow({ ...STUB_WINDOW, id: 'win-a' })
    useWindowStore.getState().openWindow({ ...STUB_WINDOW, id: 'win-b' })
    useWindowStore.getState().focusWindow('win-a')
    const state = useWindowStore.getState()
    expect(state.windows['win-a'].zIndex).toBe(state.maxZIndex)
    expect(state.windows['win-a'].isFocused).toBe(true)
    expect(state.windows['win-b'].isFocused).toBe(false)
  })

  it('only one window is focused at a time after openWindow', () => {
    useWindowStore.getState().openWindow({ ...STUB_WINDOW, id: 'win-a' })
    useWindowStore.getState().openWindow({ ...STUB_WINDOW, id: 'win-b' })
    const state = useWindowStore.getState()
    expect(state.windows['win-a'].isFocused).toBe(false)
    expect(state.windows['win-b'].isFocused).toBe(true)
  })

  it('updates position', () => {
    useWindowStore.getState().openWindow(STUB_WINDOW)
    useWindowStore.getState().updatePosition('win-1', { x: 300, y: 400 })
    expect(useWindowStore.getState().windows['win-1'].position).toEqual({ x: 300, y: 400 })
  })

  it('updates size', () => {
    useWindowStore.getState().openWindow(STUB_WINDOW)
    useWindowStore.getState().updateSize('win-1', { width: 800, height: 600 })
    expect(useWindowStore.getState().windows['win-1'].size).toEqual({ width: 800, height: 600 })
  })
})
