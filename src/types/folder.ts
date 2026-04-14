export interface FolderState {
  id: string
  label: string
  icon: string
  windowId: string
  position: { x: number; y: number }
  isOpen: boolean
}

export interface FolderStoreState {
  folders: Record<string, FolderState>
  initFolders: (folders: FolderState[]) => void
  openFolder: (id: string) => void
  closeFolder: (id: string) => void
  updateFolderPosition: (id: string, position: { x: number; y: number }) => void
}
