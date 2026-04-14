import { create } from 'zustand'
import type { WindowStoreState } from '../types/window'

export const useWindowStore = create<WindowStoreState>((set) => ({
  windows: {},
  maxZIndex: 0,

  openWindow: (config) =>
    set((state) => {
      const newZIndex = state.maxZIndex + 1
      const unfocused = Object.fromEntries(
        Object.entries(state.windows).map(([id, w]) => [id, { ...w, isFocused: false }])
      )
      return {
        windows: {
          ...unfocused,
          [config.id]: { ...config, zIndex: newZIndex, isMinimized: false, isFocused: true },
        },
        maxZIndex: newZIndex,
      }
    }),

  closeWindow: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.windows
      return { windows: rest }
    }),

  minimizeWindow: (id) =>
    set((state) => {
      if (!state.windows[id]) return state
      return {
        windows: {
          ...state.windows,
          [id]: { ...state.windows[id], isMinimized: true, isFocused: false },
        },
      }
    }),

  restoreWindow: (id) =>
    set((state) => {
      if (!state.windows[id]) return state
      const newZIndex = state.maxZIndex + 1
      const unfocused = Object.fromEntries(
        Object.entries(state.windows).map(([k, w]) => [k, { ...w, isFocused: false }])
      )
      return {
        windows: {
          ...unfocused,
          [id]: { ...unfocused[id], isMinimized: false, isFocused: true, zIndex: newZIndex },
        },
        maxZIndex: newZIndex,
      }
    }),

  focusWindow: (id) =>
    set((state) => {
      if (!state.windows[id]) return state
      const newZIndex = state.maxZIndex + 1
      const unfocused = Object.fromEntries(
        Object.entries(state.windows).map(([k, w]) => [k, { ...w, isFocused: false }])
      )
      return {
        windows: {
          ...unfocused,
          [id]: { ...unfocused[id], zIndex: newZIndex, isFocused: true },
        },
        maxZIndex: newZIndex,
      }
    }),

  updatePosition: (id, position) =>
    set((state) => {
      if (!state.windows[id]) return state
      return { windows: { ...state.windows, [id]: { ...state.windows[id], position } } }
    }),

  updateSize: (id, size) =>
    set((state) => {
      if (!state.windows[id]) return state
      return { windows: { ...state.windows, [id]: { ...state.windows[id], size } } }
    }),
}))
