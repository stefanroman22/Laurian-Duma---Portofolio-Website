import { beforeEach, describe, expect, it } from 'vitest'
import { useFolderStore } from '../../src/stores/useFolderStore'
import type { FolderState } from '../../src/types/folder'

const STUB_FOLDERS: FolderState[] = [
  { id: 'f-about', label: 'about', icon: '👤', windowId: 'about', position: { x: 32, y: 32 }, isOpen: false },
  { id: 'f-projects', label: 'projects', icon: '💼', windowId: 'projects', position: { x: 32, y: 130 }, isOpen: false },
]

describe('useFolderStore', () => {
  beforeEach(() => {
    useFolderStore.setState({ folders: {} })
  })

  it('initialises folders from array', () => {
    useFolderStore.getState().initFolders(STUB_FOLDERS)
    expect(Object.keys(useFolderStore.getState().folders)).toHaveLength(2)
  })

  it('sets isOpen=true on openFolder', () => {
    useFolderStore.getState().initFolders(STUB_FOLDERS)
    useFolderStore.getState().openFolder('f-about')
    expect(useFolderStore.getState().folders['f-about'].isOpen).toBe(true)
  })

  it('sets isOpen=false on closeFolder', () => {
    useFolderStore.getState().initFolders(STUB_FOLDERS)
    useFolderStore.getState().openFolder('f-about')
    useFolderStore.getState().closeFolder('f-about')
    expect(useFolderStore.getState().folders['f-about'].isOpen).toBe(false)
  })

  it('updates folder position', () => {
    useFolderStore.getState().initFolders(STUB_FOLDERS)
    useFolderStore.getState().updateFolderPosition('f-about', { x: 200, y: 300 })
    expect(useFolderStore.getState().folders['f-about'].position).toEqual({ x: 200, y: 300 })
  })
})
