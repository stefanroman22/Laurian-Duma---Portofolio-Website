import { create } from 'zustand'
import type { FolderStoreState } from '../types/folder'

export const useFolderStore = create<FolderStoreState>((set) => ({
  folders: {},

  initFolders: (folders) =>
    set({ folders: Object.fromEntries(folders.map((f) => [f.id, f])) }),

  openFolder: (id) =>
    set((state) => {
      if (!state.folders[id]) return state
      return {
        folders: { ...state.folders, [id]: { ...state.folders[id], isOpen: true } },
      }
    }),

  closeFolder: (id) =>
    set((state) => {
      if (!state.folders[id]) return state
      return {
        folders: { ...state.folders, [id]: { ...state.folders[id], isOpen: false } },
      }
    }),

  updateFolderPosition: (id, position) =>
    set((state) => {
      if (!state.folders[id]) return state
      return {
        folders: { ...state.folders, [id]: { ...state.folders[id], position } },
      }
    }),
}))
