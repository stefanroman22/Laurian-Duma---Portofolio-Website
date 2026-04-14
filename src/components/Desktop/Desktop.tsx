import { useEffect } from 'react'
import { useFolderStore } from '../../stores/useFolderStore'
import { useWindowStore } from '../../stores/useWindowStore'
import { registerWindow } from '../../constants/windowRegistry'
import { WindowManager } from '../Window/WindowManager'
import { Taskbar } from './Taskbar'
import { Folder } from './Folder'
import { AboutView } from '../../views/AboutView'
import { ProjectsView } from '../../views/ProjectsView'
import { ExperienceView } from '../../views/ExperienceView'
import { HobbiesView } from '../../views/HobbiesView'
import { ContactView } from '../../views/ContactView'
import { Terminal } from '../Terminal/Terminal'

const FOLDER_DEFS = [
  { id: 'f-about',      label: 'about',      icon: '👤', windowId: 'about',      component: AboutView,      size: { width: 520, height: 440 }, y: 32  },
  { id: 'f-projects',   label: 'projects',   icon: '💼', windowId: 'projects',   component: ProjectsView,   size: { width: 700, height: 520 }, y: 136 },
  { id: 'f-experience', label: 'experience', icon: '📋', windowId: 'experience', component: ExperienceView, size: { width: 640, height: 500 }, y: 240 },
  { id: 'f-hobbies',    label: 'hobbies',    icon: '🎮', windowId: 'hobbies',    component: HobbiesView,    size: { width: 520, height: 420 }, y: 344 },
  { id: 'f-contact',    label: 'contact',    icon: '✉️', windowId: 'contact',    component: ContactView,    size: { width: 480, height: 380 }, y: 448 },
]

export function Desktop() {
  const { initFolders } = useFolderStore()
  const { openWindow } = useWindowStore()

  useEffect(() => {
    // Register all windows so Terminal's "open" command can look them up
    FOLDER_DEFS.forEach(({ windowId, label, component, size }) => {
      registerWindow(windowId, { component, defaultSize: size, defaultTitle: label })
    })
    registerWindow('terminal', {
      component: Terminal,
      defaultSize: { width: 640, height: 400 },
      defaultTitle: 'terminal',
    })

    // Initialise folder store
    initFolders(
      FOLDER_DEFS.map(({ id, label, icon, windowId, y }) => ({
        id, label, icon, windowId, position: { x: 28, y }, isOpen: false,
      }))
    )

    // Auto-open terminal on desktop load
    openWindow({
      id: 'terminal',
      title: 'terminal',
      component: Terminal,
      position: { x: 160, y: 80 },
      size: { width: 640, height: 400 },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Desktop icon strip */}
      <div className="relative w-full h-[calc(100vh-2.5rem)]">
        {FOLDER_DEFS.map((def) => (
          <Folder
            key={def.id}
            id={def.id}
            label={def.label}
            icon={def.icon}
            windowId={def.windowId}
            position={{ x: 28, y: def.y }}
            windowComponent={def.component}
            defaultSize={def.size}
          />
        ))}
        <WindowManager />
      </div>
      <Taskbar />
    </div>
  )
}
