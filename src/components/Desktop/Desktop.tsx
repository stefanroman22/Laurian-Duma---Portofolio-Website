import { useEffect, useState } from 'react'
import { useFolderStore } from '../../stores/useFolderStore'
import { useWindowStore } from '../../stores/useWindowStore'
import { registerWindow } from '../../constants/windowRegistry'
import { WindowManager } from '../Window/WindowManager'
import { Taskbar } from './Taskbar'
import { AboutView } from '../../views/AboutView'
import { ProjectsView } from '../../views/ProjectsView'
import { ExperienceView } from '../../views/ExperienceView'
import { HobbiesView } from '../../views/HobbiesView'
import { ContactView } from '../../views/ContactView'
import { Terminal } from '../Terminal/Terminal'

const FOLDER_DEFS = [
  { id: 'f-about',      label: 'about',      windowId: 'about',      component: AboutView,      size: { width: 520, height: 480 } },
  { id: 'f-projects',   label: 'projects',   windowId: 'projects',   component: ProjectsView,   size: { width: 700, height: 520 } },
  { id: 'f-experience', label: 'experience', windowId: 'experience', component: ExperienceView, size: { width: 660, height: 520 } },
  { id: 'f-hobbies',    label: 'hobbies',    windowId: 'hobbies',    component: HobbiesView,    size: { width: 520, height: 440 } },
  { id: 'f-contact',    label: 'contact',    windowId: 'contact',    component: ContactView,    size: { width: 480, height: 380 } },
]

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <time className="font-mono text-xs text-on-surface-variant tabular-nums" dateTime={now.toISOString()}>
      {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </time>
  )
}

export function Desktop() {
  const { initFolders } = useFolderStore()
  const { openWindow, windows } = useWindowStore()
  const [activeNav, setActiveNav] = useState('system')

  useEffect(() => {
    FOLDER_DEFS.forEach(({ windowId, label, component, size }) => {
      registerWindow(windowId, { component, defaultSize: size, defaultTitle: label })
    })
    registerWindow('terminal', {
      component: Terminal,
      defaultSize: { width: 640, height: 420 },
      defaultTitle: 'terminal',
    })

    initFolders(
      FOLDER_DEFS.map(({ id, label, windowId }, i) => ({
        id, label, icon: '📁', windowId, position: { x: 28, y: 32 + i * 40 }, isOpen: false,
      }))
    )

    openWindow({
      id: 'terminal',
      title: 'terminal',
      component: Terminal,
      position: { x: 220, y: 60 },
      size: { width: 640, height: 420 },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSidebarOpen = (windowId: string) => {
    const def = FOLDER_DEFS.find(d => d.windowId === windowId)
    if (def) {
      openWindow({
        id: def.windowId,
        title: def.label,
        component: def.component,
        position: { x: 220 + Math.random() * 80, y: 60 + Math.random() * 60 },
        size: def.size,
      })
    } else if (windowId === 'terminal') {
      openWindow({
        id: 'terminal',
        title: 'terminal',
        component: Terminal,
        position: { x: 220 + Math.random() * 80, y: 60 + Math.random() * 60 },
        size: { width: 640, height: 420 },
      })
    }
  }

  const navTabs = ['system', 'network', 'storage', 'encryption']
  const sidebarItems = [
    { id: 'terminal', label: '/ root' },
    { id: 'about',    label: '/ about' },
    { id: 'projects', label: '/ projects' },
    { id: 'experience', label: '/ experience' },
    { id: 'hobbies',  label: '/ hobbies' },
    { id: 'contact',  label: '/ contact' },
  ]

  return (
    <div className="fixed inset-0 os-desktop-bg overflow-hidden flex flex-col">
      {/* ── TOP NAVBAR ── */}
      <header className="flex-shrink-0 h-10 bg-surface-container-low flex items-center px-4 gap-6 z-[10000]">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-tertiary text-sm" aria-hidden="true">⚡</span>
          <span className="font-mono text-xs text-tertiary tracking-widest select-none hidden sm:inline">GHOST_SHELL_OS</span>
        </div>
        {/* Nav tabs */}
        <nav className="hidden sm:flex items-center gap-1 flex-1" aria-label="OS navigation">
          {navTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveNav(tab)}
              className={[
                'px-3 py-1 font-mono text-xs uppercase tracking-widest transition-colors',
                tab === activeNav
                  ? 'text-primary border-b border-primary'
                  : 'text-on-surface-variant hover:text-on-surface',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </nav>
        {/* Clock */}
        <Clock />
        {/* Status dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-tertiary neon-glow-tertiary" aria-label="System online" />
      </header>

      {/* ── MAIN AREA ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="flex-shrink-0 w-44 bg-surface-container-low hidden md:flex flex-col z-[9999]">
          {/* Profile card */}
          <div className="px-3 py-4 border-b border-outline/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-sm bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-xs text-primary font-medium">LD</span>
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs text-on-surface truncate">LD_ADMIN</p>
                <p className="font-mono text-[10px] text-tertiary tracking-wide truncate">[LVL.4 CLEARANCE]</p>
              </div>
            </div>
          </div>
          {/* Nav items */}
          <nav className="flex-1 py-2 overflow-y-auto" aria-label="File system navigation">
            {sidebarItems.map(item => {
              const isOpen = item.id === 'terminal'
                ? !!windows['terminal'] && !windows['terminal']?.isMinimized
                : !!windows[item.id] && !windows[item.id]?.isMinimized
              return (
                <button
                  key={item.id}
                  onClick={() => handleSidebarOpen(item.id)}
                  className={['sidebar-item w-full text-left', isOpen ? 'active' : ''].join(' ')}
                >
                  <span className="text-tertiary select-none">›</span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
          {/* Footer status */}
          <div className="px-3 py-2 border-t border-outline/10">
            <p className="font-mono text-[10px] text-on-surface-variant">STATUS: ONLINE</p>
            <p className="font-mono text-[10px] text-tertiary">SECURE_CONN: ACTIVE</p>
          </div>
        </aside>

        {/* ── DESKTOP CANVAS ── */}
        <div className="flex-1 relative overflow-hidden">
          <WindowManager />
        </div>
      </div>

      {/* ── TASKBAR ── */}
      <Taskbar />
    </div>
  )
}
