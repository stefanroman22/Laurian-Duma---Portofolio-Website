# Ghost Shell OS Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pixel-perfect, OS-style interactive React portfolio for Laurian Duma using the Ghost Shell OS design system from `design.md`.

**Architecture:** A single-page app simulates a desktop OS — a Zustand kernel manages draggable/resizable windows and folder state, Framer Motion handles all enter/exit animations, and a terminal component parses Unix-like commands. BIOSBoot runs on first load, transitions to the Desktop, and auto-opens a terminal window.

**Tech Stack:** Vite 5, React 18, TypeScript 5, Tailwind CSS v3, Zustand 4, Framer Motion 11, Vitest 1 + @testing-library/react 14

---

## File Structure

```
src/
  main.tsx                          # Entry point
  App.tsx                           # Boot → Desktop state machine
  index.css                         # Tailwind directives + Google Fonts
  types/
    window.ts                       # WindowState, WindowStore interfaces
    folder.ts                       # FolderState, FolderStore interfaces
    content.ts                      # CV, Project, Experience, Hobby interfaces
  stores/
    useWindowStore.ts               # Zustand: open/close/minimize/focus/drag/resize
    useFolderStore.ts               # Zustand: folder icon positions and open flags
  constants/
    biosLines.ts                    # BIOS_LINES string[] for boot sequence
    cv.ts                           # CV object (name, title, email, etc.)
    experience.ts                   # EXPERIENCE ExperienceEntry[]
    projects.ts                     # PROJECTS Project[]
    hobbies.ts                      # HOBBIES Hobby[]
    windowRegistry.ts               # WINDOW_REGISTRY: windowId → { component, defaultSize }
  components/
    BIOSBoot/
      BIOSBoot.tsx                  # Full-screen boot sequence, fires onBootComplete
    Window/
      WindowTitleBar.tsx            # Traffic-light controls + title bar
      Window.tsx                    # Framer Motion draggable glassmorphism panel
      WindowManager.tsx             # Renders all open windows from store
    Terminal/
      commandParser.ts              # Pure function: string → { output, sideEffect }
      Terminal.tsx                  # REPL UI with CRT scanline, history, typed output
    Desktop/
      Folder.tsx                    # Desktop icon — double-click opens window
      Taskbar.tsx                   # Bottom bar: open windows + clock
      Desktop.tsx                   # Canvas: folders + WindowManager + Taskbar
  views/
    AboutView.tsx
    ProjectsView.tsx
    ExperienceView.tsx
    HobbiesView.tsx
    ContactView.tsx
tests/
  setup.ts                          # @testing-library/jest-dom import
  stores/
    useWindowStore.test.ts
    useFolderStore.test.ts
  components/
    BIOSBoot.test.tsx
    WindowTitleBar.test.tsx
    commandParser.test.ts
tailwind.config.ts
vite.config.ts
vitest.config.ts
```

---

## Task 1: Scaffold Vite + React + TypeScript

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`

- [ ] **Step 1: Create project**

```bash
npm create vite@latest . -- --template react-ts
```

Expected output: `Scaffolding project...  Done.`

- [ ] **Step 2: Install all dependencies**

```bash
npm install zustand framer-motion react-draggable
npm install -D tailwindcss@3 postcss autoprefixer \
  vitest @vitest/coverage-v8 jsdom \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event
npx tailwindcss init -p
```

- [ ] **Step 3: Configure `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 4: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold vite react-ts project with dependencies"
```

---

## Task 2: Tailwind Config with Ghost Shell OS Tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/index.css`

- [ ] **Step 1: Replace `tailwind.config.ts` with full token map**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0e0e0e',
        surface: '#0e0e0e',
        'surface-dim': '#0e0e0e',
        'surface-bright': '#2c2c2c',
        'surface-container-lowest': '#000000',
        'surface-container-low': '#131313',
        'surface-container': '#1a1919',
        'surface-container-high': '#201f1f',
        'surface-container-highest': '#262626',
        'surface-variant': '#262626',
        'surface-tint': '#86adff',
        'on-surface': '#ffffff',
        'on-surface-variant': '#adaaaa',
        'inverse-surface': '#fcf8f8',
        'inverse-on-surface': '#565554',
        primary: '#86adff',
        'primary-container': '#6f9fff',
        'primary-dim': '#006fef',
        'primary-fixed': '#6f9fff',
        'primary-fixed-dim': '#5491ff',
        'on-primary': '#002c67',
        'on-primary-container': '#002150',
        'inverse-primary': '#005ac5',
        secondary: '#8b94ff',
        'secondary-container': '#0011fe',
        'secondary-dim': '#5461ff',
        'secondary-fixed': '#ccceff',
        'secondary-fixed-dim': '#bbbfff',
        'on-secondary': '#000478',
        'on-secondary-container': '#d7d8ff',
        tertiary: '#69fd5d',
        'tertiary-container': '#59ee50',
        'tertiary-dim': '#49e043',
        'on-tertiary': '#005e07',
        error: '#ff6e84',
        'error-container': '#a70138',
        'error-dim': '#d73357',
        'on-error': '#490013',
        'on-error-container': '#ffb2b9',
        outline: '#777575',
        'outline-variant': '#494847',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'headline-lg': ['2rem', { lineHeight: '1.25' }],
        'headline-md': ['1.5rem', { lineHeight: '1.3' }],
        'headline-sm': ['1.25rem', { lineHeight: '1.4' }],
        'body-lg': ['1rem', { lineHeight: '1.6' }],
        'body-md': ['0.875rem', { lineHeight: '1.5' }],
        'body-sm': ['0.75rem', { lineHeight: '1.5' }],
        'label-sm': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05rem' }],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        lg: '8px',
        xl: '16px',
      },
      boxShadow: {
        window: '0px 20px 40px rgba(0, 17, 255, 0.08)',
        'glow-primary': '0 0 20px rgba(134, 173, 255, 0.15)',
        'glow-tertiary': '0 0 20px rgba(105, 253, 93, 0.15)',
      },
      backgroundImage: {
        'cta-gradient': 'linear-gradient(135deg, #86adff 0%, #0011fe 100%)',
        scanline:
          'repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 2px)',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Replace `src/index.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}

body {
  background-color: #0e0e0e;
  color: #ffffff;
  overflow: hidden;
}
```

- [ ] **Step 3: Verify Tailwind processes without error**

```bash
npx tailwindcss -i src/index.css -o /dev/null --minify
```

Expected: no errors, outputs minified CSS size.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts src/index.css
git commit -m "feat: configure tailwind with ghost shell os design tokens"
```

---

## Task 3: Vitest Test Infrastructure

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
})
```

- [ ] **Step 2: Create `tests/setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Add test script to `package.json`**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

- [ ] **Step 4: Run test suite (empty — should pass vacuously)**

```bash
npm test
```

Expected: `No test files found, exiting with code 0` or `0 tests passed`.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts tests/setup.ts package.json
git commit -m "feat: configure vitest with jsdom and testing-library"
```

---

## Task 4: Type Definitions

**Files:**
- Create: `src/types/window.ts`, `src/types/folder.ts`, `src/types/content.ts`

- [ ] **Step 1: Create `src/types/window.ts`**

```typescript
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
```

- [ ] **Step 2: Create `src/types/folder.ts`**

```typescript
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
```

- [ ] **Step 3: Create `src/types/content.ts`**

```typescript
export interface CV {
  name: string
  title: string
  summary: string
  email: string
  github: string
  linkedin: string
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  period: string
  bullets: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  url?: string
  repo?: string
}

export interface Hobby {
  id: string
  name: string
  description: string
  icon: string
}
```

- [ ] **Step 4: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/types/
git commit -m "feat: add window, folder, and content type definitions"
```

---

## Task 5: useWindowStore — RED (Failing Tests)

**Files:**
- Create: `tests/stores/useWindowStore.test.ts`

- [ ] **Step 1: Create test file**

```typescript
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
```

- [ ] **Step 2: Run tests — verify they FAIL**

```bash
npm test tests/stores/useWindowStore.test.ts
```

Expected: `FAIL — Cannot find module '../../src/stores/useWindowStore'`

---

## Task 6: useWindowStore — GREEN (Implementation)

**Files:**
- Create: `src/stores/useWindowStore.ts`

- [ ] **Step 1: Create the store**

```typescript
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
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: true, isFocused: false },
      },
    })),

  restoreWindow: (id) =>
    set((state) => {
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
    set((state) => ({
      windows: { ...state.windows, [id]: { ...state.windows[id], position } },
    })),

  updateSize: (id, size) =>
    set((state) => ({
      windows: { ...state.windows, [id]: { ...state.windows[id], size } },
    })),
}))
```

- [ ] **Step 2: Run tests — verify all PASS**

```bash
npm test tests/stores/useWindowStore.test.ts
```

Expected: `✓ 8 tests passed`

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/stores/useWindowStore.ts tests/stores/useWindowStore.test.ts
git commit -m "feat: implement useWindowStore with full TDD coverage"
```

---

## Task 7: useFolderStore — RED (Failing Tests)

**Files:**
- Create: `tests/stores/useFolderStore.test.ts`

- [ ] **Step 1: Create test file**

```typescript
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
```

- [ ] **Step 2: Run — verify FAIL**

```bash
npm test tests/stores/useFolderStore.test.ts
```

Expected: `FAIL — Cannot find module '../../src/stores/useFolderStore'`

---

## Task 8: useFolderStore — GREEN (Implementation)

**Files:**
- Create: `src/stores/useFolderStore.ts`

- [ ] **Step 1: Create the store**

```typescript
import { create } from 'zustand'
import type { FolderStoreState } from '../types/folder'

export const useFolderStore = create<FolderStoreState>((set) => ({
  folders: {},

  initFolders: (folders) =>
    set({ folders: Object.fromEntries(folders.map((f) => [f.id, f])) }),

  openFolder: (id) =>
    set((state) => ({
      folders: { ...state.folders, [id]: { ...state.folders[id], isOpen: true } },
    })),

  closeFolder: (id) =>
    set((state) => ({
      folders: { ...state.folders, [id]: { ...state.folders[id], isOpen: false } },
    })),

  updateFolderPosition: (id, position) =>
    set((state) => ({
      folders: { ...state.folders, [id]: { ...state.folders[id], position } },
    })),
}))
```

- [ ] **Step 2: Run — verify PASS**

```bash
npm test tests/stores/
```

Expected: `✓ 12 tests passed` (8 window + 4 folder)

- [ ] **Step 3: Commit**

```bash
git add src/stores/useFolderStore.ts tests/stores/useFolderStore.test.ts
git commit -m "feat: implement useFolderStore with full TDD coverage"
```

---

## Task 9: BIOSBoot — RED (Failing Tests)

**Files:**
- Create: `src/constants/biosLines.ts`, `tests/components/BIOSBoot.test.tsx`

- [ ] **Step 1: Create `src/constants/biosLines.ts`**

```typescript
export const BIOS_LINES: string[] = [
  'Ghost Shell OS v1.0.0',
  'Copyright (c) 2026 Laurian Duma. All rights reserved.',
  '',
  'BIOS version 0.1.0-alpha',
  'Detecting hardware...',
  'CPU: Creative Engine v8 @ 3.2GHz',
  'RAM: 16384MB [OK]',
  'GPU: Obsidian Renderer [OK]',
  '',
  'Initializing kernel...',
  'Loading window manager... [OK]',
  'Loading terminal emulator... [OK]',
  'Loading filesystem... [OK]',
  '',
  'Mounting /dev/portfolio...',
  '> /about         [OK]',
  '> /projects      [OK]',
  '> /experience    [OK]',
  '> /hobbies       [OK]',
  '> /contact       [OK]',
  '',
  'All systems nominal.',
  'Booting desktop environment...',
]
```

- [ ] **Step 2: Create `tests/components/BIOSBoot.test.tsx`**

```tsx
import { render, screen, act } from '@testing-library/react'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { BIOSBoot } from '../../src/components/BIOSBoot/BIOSBoot'

describe('BIOSBoot', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('fires onBootComplete after all lines have been shown', async () => {
    vi.useFakeTimers()
    const onBootComplete = vi.fn()
    render(<BIOSBoot onBootComplete={onBootComplete} />)

    await act(async () => {
      vi.runAllTimers()
    })

    expect(onBootComplete).toHaveBeenCalledOnce()
  })

  it('renders "Ghost Shell OS" text during boot', async () => {
    vi.useFakeTimers()
    render(<BIOSBoot onBootComplete={() => {}} />)

    await act(async () => {
      vi.runAllTimers()
    })

    expect(screen.getByText('Ghost Shell OS v1.0.0')).toBeDefined()
  })

  it('renders on a black background with mono font class', () => {
    vi.useFakeTimers()
    const { container } = render(<BIOSBoot onBootComplete={() => {}} />)
    expect(container.firstElementChild?.className).toContain('bg-surface-container-lowest')
    expect(container.firstElementChild?.className).toContain('font-mono')
  })
})
```

- [ ] **Step 3: Run — verify FAIL**

```bash
npm test tests/components/BIOSBoot.test.tsx
```

Expected: `FAIL — Cannot find module '../../src/components/BIOSBoot/BIOSBoot'`

---

## Task 10: BIOSBoot — GREEN (Implementation)

**Files:**
- Create: `src/components/BIOSBoot/BIOSBoot.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { useEffect, useState } from 'react'
import { BIOS_LINES } from '../../constants/biosLines'

interface BIOSBootProps {
  onBootComplete: () => void
}

export function BIOSBoot({ onBootComplete }: BIOSBootProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    BIOS_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line])
      }, i * 60)
      timers.push(t)
    })

    const completionDelay = BIOS_LINES.length * 60 + 400
    const done = setTimeout(onBootComplete, completionDelay)
    timers.push(done)

    return () => timers.forEach(clearTimeout)
  }, [onBootComplete])

  return (
    <div className="fixed inset-0 bg-surface-container-lowest font-mono flex flex-col justify-center p-12">
      <div className="max-w-2xl space-y-0">
        {visibleLines.map((line, i) => (
          <div key={i} className="text-tertiary text-sm leading-6">
            {line || '\u00A0'}
          </div>
        ))}
        <span className="inline-block w-2 h-[1em] bg-tertiary animate-pulse" />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run tests — verify PASS**

```bash
npm test tests/components/BIOSBoot.test.tsx
```

Expected: `✓ 3 tests passed`

- [ ] **Step 3: Commit**

```bash
git add src/components/BIOSBoot/ src/constants/biosLines.ts tests/components/BIOSBoot.test.tsx
git commit -m "feat: implement BIOSBoot component with sequenced text animation"
```

---

## Task 11: WindowTitleBar — RED (Failing Tests)

**Files:**
- Create: `tests/components/WindowTitleBar.test.tsx`

- [ ] **Step 1: Create test file**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WindowTitleBar } from '../../src/components/Window/WindowTitleBar'

describe('WindowTitleBar', () => {
  it('renders the window title', () => {
    render(<WindowTitleBar title="My Window" onClose={() => {}} onMinimize={() => {}} />)
    expect(screen.getByText('My Window')).toBeDefined()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<WindowTitleBar title="Test" onClose={onClose} onMinimize={() => {}} />)
    fireEvent.click(screen.getByLabelText('Close window'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onMinimize when minimize button is clicked', () => {
    const onMinimize = vi.fn()
    render(<WindowTitleBar title="Test" onClose={() => {}} onMinimize={onMinimize} />)
    fireEvent.click(screen.getByLabelText('Minimize window'))
    expect(onMinimize).toHaveBeenCalledOnce()
  })

  it('uses surface-container-high background — no border classes', () => {
    const { container } = render(
      <WindowTitleBar title="Test" onClose={() => {}} onMinimize={() => {}} />
    )
    const html = container.innerHTML
    expect(html).toContain('surface-container-high')
    expect(html).not.toMatch(/border-\[/)
  })
})
```

- [ ] **Step 2: Run — verify FAIL**

```bash
npm test tests/components/WindowTitleBar.test.tsx
```

Expected: `FAIL — Cannot find module '../../src/components/Window/WindowTitleBar'`

---

## Task 12: WindowTitleBar — GREEN (Implementation)

**Files:**
- Create: `src/components/Window/WindowTitleBar.tsx`

- [ ] **Step 1: Create the component**

```tsx
interface WindowTitleBarProps {
  title: string
  onClose: () => void
  onMinimize: () => void
}

export function WindowTitleBar({ title, onClose, onMinimize }: WindowTitleBarProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-high cursor-grab active:cursor-grabbing select-none">
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="w-3 h-3 rounded-full bg-error-dim hover:bg-error transition-colors flex-shrink-0"
        aria-label="Close window"
      />
      <button
        onClick={(e) => { e.stopPropagation(); onMinimize() }}
        className="w-3 h-3 rounded-full bg-outline hover:bg-on-surface-variant transition-colors flex-shrink-0"
        aria-label="Minimize window"
      />
      <div className="w-3 h-3 rounded-full bg-outline/30 flex-shrink-0" aria-hidden="true" />
      <span className="ml-2 font-sans text-body-sm text-on-surface-variant tracking-wide truncate">
        {title}
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Run tests — verify PASS**

```bash
npm test tests/components/WindowTitleBar.test.tsx
```

Expected: `✓ 4 tests passed`

- [ ] **Step 3: Commit**

```bash
git add src/components/Window/WindowTitleBar.tsx tests/components/WindowTitleBar.test.tsx
git commit -m "feat: implement WindowTitleBar with traffic-light controls"
```

---

## Task 13: Window + WindowManager

**Files:**
- Create: `src/components/Window/Window.tsx`, `src/components/Window/WindowManager.tsx`

- [ ] **Step 1: Create `src/components/Window/Window.tsx`**

```tsx
import { motion } from 'framer-motion'
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
      dragHandle=".window-drag-handle"
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
      }}
      className={[
        'bg-surface-variant backdrop-blur-[40px]',
        'rounded-lg overflow-hidden shadow-window',
        isFocused ? 'ring-1 ring-outline-variant/15' : 'ring-0',
      ].join(' ')}
    >
      <div className="window-drag-handle">
        <WindowTitleBar
          title={title}
          onClose={() => closeWindow(id)}
          onMinimize={() => minimizeWindow(id)}
        />
      </div>
      <div className="p-4 h-[calc(100%-2.5rem)] overflow-auto bg-surface-container">
        <Component />
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Create `src/components/Window/WindowManager.tsx`**

```tsx
import { AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../../stores/useWindowStore'
import { Window } from './Window'

export function WindowManager() {
  const { windows } = useWindowStore()

  return (
    <AnimatePresence>
      {Object.values(windows).map((win) => (
        <Window key={win.id} {...win} />
      ))}
    </AnimatePresence>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Window/
git commit -m "feat: implement Window with Framer Motion drag and WindowManager"
```

---

## Task 14: commandParser — RED (Failing Tests)

**Files:**
- Create: `tests/components/commandParser.test.ts`

- [ ] **Step 1: Create test file**

```typescript
import { describe, expect, it } from 'vitest'
import { parseCommand } from '../../src/components/Terminal/commandParser'

describe('parseCommand', () => {
  it('returns empty output for blank input', () => {
    expect(parseCommand('').output).toHaveLength(0)
    expect(parseCommand('   ').output).toHaveLength(0)
  })

  it('"help" returns lines containing "Available commands:"', () => {
    expect(parseCommand('help').output).toContain('Available commands:')
  })

  it('"ls" output contains "projects/" and "about/"', () => {
    const out = parseCommand('ls').output[0]
    expect(out).toContain('projects/')
    expect(out).toContain('about/')
  })

  it('"cat readme.md" returns file contents', () => {
    expect(parseCommand('cat readme.md').output[0]).toContain('Ghost Shell OS')
  })

  it('"cat" with no args returns usage string', () => {
    expect(parseCommand('cat').output[0]).toBe('Usage: cat <file>')
  })

  it('"cat unknown.txt" returns no such file error', () => {
    expect(parseCommand('cat unknown.txt').output[0]).toContain('No such file or directory')
  })

  it('"open projects" returns open sideEffect with windowId "projects"', () => {
    const result = parseCommand('open projects')
    expect(result.sideEffect).toEqual({ type: 'open', windowId: 'projects' })
  })

  it('"open fakeapp" returns application not found, no sideEffect', () => {
    const result = parseCommand('open fakeapp')
    expect(result.output[0]).toContain('application not found')
    expect(result.sideEffect).toBeUndefined()
  })

  it('"open" with no args returns usage', () => {
    expect(parseCommand('open').output[0]).toBe('Usage: open <app>')
  })

  it('"whoami" returns user identity line', () => {
    expect(parseCommand('whoami').output[0]).toContain('laurian.duma')
  })

  it('"projects" returns open sideEffect for projects window', () => {
    expect(parseCommand('projects').sideEffect).toEqual({ type: 'open', windowId: 'projects' })
  })

  it('"contact" returns open sideEffect for contact window', () => {
    expect(parseCommand('contact').sideEffect).toEqual({ type: 'open', windowId: 'contact' })
  })

  it('"clear" returns clear sideEffect and empty output', () => {
    const result = parseCommand('clear')
    expect(result.sideEffect).toEqual({ type: 'clear' })
  })

  it('unknown command returns "command not found" message', () => {
    expect(parseCommand('zork').output[0]).toContain('command not found')
  })

  it('commands are case-insensitive', () => {
    expect(parseCommand('HELP').output).toContain('Available commands:')
    expect(parseCommand('LS').output[0]).toContain('projects/')
  })
})
```

- [ ] **Step 2: Run — verify FAIL**

```bash
npm test tests/components/commandParser.test.ts
```

Expected: `FAIL — Cannot find module '../../src/components/Terminal/commandParser'`

---

## Task 15: commandParser — GREEN (Implementation)

**Files:**
- Create: `src/components/Terminal/commandParser.ts`

- [ ] **Step 1: Create the parser**

```typescript
export type SideEffect =
  | { type: 'open'; windowId: string }
  | { type: 'clear' }

export interface ParseResult {
  output: string[]
  sideEffect?: SideEffect
}

const HELP_TEXT = [
  'Available commands:',
  '  ls              list desktop contents',
  '  cat <file>      display file contents',
  '  open <app>      open an application window',
  '  whoami          display user profile',
  '  projects        open projects window',
  '  contact         open contact window',
  '  clear           clear terminal',
  '  help            show this message',
]

const FS: Record<string, string[]> = {
  'readme.md': [
    'Ghost Shell OS — interactive portfolio',
    'An OS-style experience for Laurian Duma.',
    'Double-click any folder icon to open a window.',
    'Type "help" for terminal commands.',
  ],
  'resume.txt': [
    'Laurian Duma',
    'Software Engineer & Creative Developer',
    'Email: hello@laurianduma.dev',
    'GitHub: github.com/laurianduma',
  ],
}

const VALID_APPS = ['about', 'projects', 'experience', 'hobbies', 'contact', 'terminal']

export function parseCommand(input: string): ParseResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: [] }

  const [cmd, ...args] = trimmed.split(/\s+/)
  const command = cmd.toLowerCase()

  switch (command) {
    case 'help':
      return { output: HELP_TEXT }

    case 'ls':
      return {
        output: ['about/  projects/  experience/  hobbies/  contact/  resume.txt  readme.md'],
      }

    case 'cat': {
      if (!args[0]) return { output: ['Usage: cat <file>'] }
      const content = FS[args[0]]
      if (!content) return { output: [`cat: ${args[0]}: No such file or directory`] }
      return { output: content }
    }

    case 'open': {
      if (!args[0]) return { output: ['Usage: open <app>'] }
      if (!VALID_APPS.includes(args[0])) {
        return { output: [`open: ${args[0]}: application not found`] }
      }
      return {
        output: [`Opening ${args[0]}...`],
        sideEffect: { type: 'open', windowId: args[0] },
      }
    }

    case 'whoami':
      return { output: ['laurian.duma — Software Engineer & Creative Developer'] }

    case 'projects':
      return {
        output: ['Opening projects...'],
        sideEffect: { type: 'open', windowId: 'projects' },
      }

    case 'contact':
      return {
        output: ['Opening contact...'],
        sideEffect: { type: 'open', windowId: 'contact' },
      }

    case 'clear':
      return { output: [], sideEffect: { type: 'clear' } }

    default:
      return { output: [`${cmd}: command not found. Type 'help' for available commands.`] }
  }
}
```

- [ ] **Step 2: Run tests — verify all PASS**

```bash
npm test tests/components/commandParser.test.ts
```

Expected: `✓ 15 tests passed`

- [ ] **Step 3: Commit**

```bash
git add src/components/Terminal/commandParser.ts tests/components/commandParser.test.ts
git commit -m "feat: implement command parser with full TDD coverage (15 tests)"
```

---

## Task 16: Terminal Component

**Files:**
- Create: `src/constants/windowRegistry.ts`, `src/components/Terminal/Terminal.tsx`

- [ ] **Step 1: Create `src/constants/windowRegistry.ts`**

```typescript
import type { ComponentType } from 'react'

export interface RegistryEntry {
  component: ComponentType
  defaultSize: { width: number; height: number }
  defaultTitle: string
}

// Populated lazily at runtime via registerWindow() to avoid circular imports.
// Desktop calls registerWindow for each view before the terminal is usable.
const registry: Record<string, RegistryEntry> = {}

export function registerWindow(id: string, entry: RegistryEntry): void {
  registry[id] = entry
}

export function getWindowEntry(id: string): RegistryEntry | undefined {
  return registry[id]
}
```

> **Note:** Using a mutable registry avoids circular import cycles between Terminal → views → Terminal. Desktop registers all views on mount before the terminal processes any commands.

- [ ] **Step 2: Create `src/components/Terminal/Terminal.tsx`**

```tsx
import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { parseCommand } from './commandParser'
import { useWindowStore } from '../../stores/useWindowStore'
import { getWindowEntry } from '../../constants/windowRegistry'

interface OutputLine {
  id: number
  text: string
  isInput: boolean
}

export function Terminal() {
  const [lines, setLines] = useState<OutputLine[]>([
    { id: 0, text: 'Ghost Shell OS v1.0.0 — type "help" for available commands', isInput: false },
  ])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lineId = useRef(1)
  const { openWindow } = useWindowStore()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const addOutputLines = (texts: string[], isInput = false) => {
    setLines((prev) => [
      ...prev,
      ...texts.map((text) => ({ id: lineId.current++, text, isInput })),
    ])
  }

  const submit = () => {
    const cmd = input.trim()
    if (!cmd) return

    addOutputLines([`$ ${input}`], true)

    const result = parseCommand(input)

    if (result.sideEffect?.type === 'clear') {
      setLines([])
    } else {
      if (result.output.length > 0) addOutputLines(result.output)
      if (result.sideEffect?.type === 'open') {
        const entry = getWindowEntry(result.sideEffect.windowId)
        if (entry) {
          openWindow({
            id: result.sideEffect.windowId,
            title: entry.defaultTitle,
            component: entry.component,
            position: { x: 180 + Math.random() * 80, y: 80 + Math.random() * 60 },
            size: entry.defaultSize,
          })
        }
      }
    }

    if (cmd) setCmdHistory((prev) => [cmd, ...prev].slice(0, 50))
    setHistoryIdx(-1)
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(next)
      setInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIdx - 1, -1)
      setHistoryIdx(next)
      setInput(next < 0 ? '' : cmdHistory[next])
    }
  }

  return (
    <div
      className="relative h-full bg-surface-container-lowest overflow-hidden font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      {/* CRT scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-scanline z-10" aria-hidden="true" />

      <div className="relative z-20 h-full flex flex-col p-3 overflow-y-auto">
        <div className="flex-1 space-y-0">
          {lines.map((line) => (
            <div
              key={line.id}
              className={line.isInput ? 'text-on-surface' : 'text-tertiary'}
            >
              {line.text || '\u00A0'}
            </div>
          ))}
        </div>
        <div className="flex items-center mt-1 pt-1">
          <span className="text-primary mr-2 select-none">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-on-surface outline-none caret-tertiary"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Terminal/ src/constants/windowRegistry.ts
git commit -m "feat: implement Terminal REPL with command history and CRT scanline"
```

---

## Task 17: Content Constants

**Files:**
- Create: `src/constants/cv.ts`, `src/constants/experience.ts`, `src/constants/projects.ts`, `src/constants/hobbies.ts`

- [ ] **Step 1: Create `src/constants/cv.ts`**

```typescript
import type { CV } from '../types/content'

export const CV_DATA: CV = {
  name: 'Laurian Duma',
  title: 'Software Engineer & Creative Developer',
  summary:
    'I build high-performance web experiences with a focus on UI systems, creative interfaces, and developer tooling. I care deeply about craft — from type hierarchy to state machine design.',
  email: 'hello@laurianduma.dev',
  github: 'github.com/laurianduma',
  linkedin: 'linkedin.com/in/laurianduma',
}
```

- [ ] **Step 2: Create `src/constants/experience.ts`**

```typescript
import type { ExperienceEntry } from '../types/content'

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'exp-1',
    company: 'Company Name',
    role: 'Senior Software Engineer',
    period: '2024 — Present',
    bullets: [
      'Led development of a design-system component library adopted across 5 product teams.',
      'Reduced initial bundle size by 40% via code-splitting and route-level lazy loading.',
      'Introduced Storybook-driven development — all 60+ components documented and visually tested.',
    ],
  },
  {
    id: 'exp-2',
    company: 'Previous Company',
    role: 'Frontend Engineer',
    period: '2022 — 2024',
    bullets: [
      'Rebuilt the core dashboard in React from a legacy jQuery codebase.',
      'Implemented real-time data visualisations with D3.js and WebSocket feeds.',
    ],
  },
]
```

- [ ] **Step 3: Create `src/constants/projects.ts`**

```typescript
import type { Project } from '../types/content'

export const PROJECTS: Project[] = [
  {
    id: 'proj-ghost-shell',
    name: 'Ghost Shell OS',
    description:
      'This portfolio — a simulated OS desktop built with React, Zustand, and Framer Motion. Inspired by high-end cybersecurity dashboards and editorial dark-mode design.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Zustand'],
    repo: 'github.com/laurianduma/ghost-shell-os',
  },
  {
    id: 'proj-2',
    name: 'Project Alpha',
    description: 'A short description of the project and what makes it interesting.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    url: 'projectalpha.dev',
    repo: 'github.com/laurianduma/project-alpha',
  },
]
```

- [ ] **Step 4: Create `src/constants/hobbies.ts`**

```typescript
import type { Hobby } from '../types/content'

export const HOBBIES: Hobby[] = [
  {
    id: 'h-photography',
    name: 'Photography',
    description:
      'Street and architectural photography. Interested in the contrast between organic human behaviour and rigid geometric structure.',
    icon: '📷',
  },
  {
    id: 'h-music',
    name: 'Music Production',
    description: 'Electronic and ambient compositions. Exploring generative music and algorithmic composition.',
    icon: '🎛️',
  },
  {
    id: 'h-climbing',
    name: 'Bouldering',
    description: 'Indoor bouldering. The problem-solving aspect maps surprisingly well to debugging.',
    icon: '🧗',
  },
]
```

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/constants/cv.ts src/constants/experience.ts src/constants/projects.ts src/constants/hobbies.ts
git commit -m "feat: add content constants (cv, experience, projects, hobbies)"
```

---

## Task 18: View Components

**Files:**
- Create: `src/views/AboutView.tsx`, `src/views/ProjectsView.tsx`, `src/views/ExperienceView.tsx`, `src/views/HobbiesView.tsx`, `src/views/ContactView.tsx`

- [ ] **Step 1: Create `src/views/AboutView.tsx`**

```tsx
import { CV_DATA } from '../constants/cv'

export function AboutView() {
  return (
    <div className="space-y-6 font-sans text-on-surface-variant">
      <div>
        <h1 className="font-display text-display-sm text-on-surface">{CV_DATA.name}</h1>
        <p className="font-mono text-label-sm text-tertiary mt-1">{CV_DATA.title}</p>
      </div>
      <p className="text-body-md leading-relaxed">{CV_DATA.summary}</p>
      <div className="space-y-2 pt-2">
        <a
          href={`mailto:${CV_DATA.email}`}
          className="block font-mono text-label-sm text-primary hover:text-primary-container transition-colors"
        >
          {CV_DATA.email}
        </a>
        <a
          href={`https://${CV_DATA.github}`}
          target="_blank"
          rel="noreferrer"
          className="block font-mono text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
        >
          {CV_DATA.github}
        </a>
        <a
          href={`https://${CV_DATA.linkedin}`}
          target="_blank"
          rel="noreferrer"
          className="block font-mono text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
        >
          {CV_DATA.linkedin}
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/views/ProjectsView.tsx`**

```tsx
import { PROJECTS } from '../constants/projects'

export function ProjectsView() {
  return (
    <div className="space-y-8 font-sans">
      <h2 className="font-display text-headline-md text-on-surface">Projects</h2>
      {PROJECTS.map((project) => (
        <div key={project.id} className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-headline-sm text-on-surface">{project.name}</h3>
            {project.url && (
              <a
                href={`https://${project.url}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-label-sm text-primary hover:text-primary-container transition-colors shrink-0"
              >
                ↗ live
              </a>
            )}
          </div>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-label-sm text-tertiary bg-surface-container-high px-2 py-0.5 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          {project.repo && (
            <a
              href={`https://${project.repo}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {project.repo}
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/views/ExperienceView.tsx`**

```tsx
import { EXPERIENCE } from '../constants/experience'

export function ExperienceView() {
  return (
    <div className="space-y-8 font-sans">
      <h2 className="font-display text-headline-md text-on-surface">Experience</h2>
      {EXPERIENCE.map((entry) => (
        <div key={entry.id} className="space-y-3">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-headline-sm text-on-surface">{entry.role}</h3>
              <span className="font-mono text-label-sm text-on-surface-variant shrink-0">
                {entry.period}
              </span>
            </div>
            <p className="font-mono text-label-sm text-tertiary">{entry.company}</p>
          </div>
          <ul className="space-y-2">
            {entry.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-3 text-body-md text-on-surface-variant">
                <span className="text-primary select-none shrink-0">›</span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create `src/views/HobbiesView.tsx`**

```tsx
import { HOBBIES } from '../constants/hobbies'

export function HobbiesView() {
  return (
    <div className="space-y-6 font-sans">
      <h2 className="font-display text-headline-md text-on-surface">Hobbies</h2>
      <div className="space-y-8">
        {HOBBIES.map((hobby) => (
          <div key={hobby.id} className="flex gap-4">
            <span className="text-2xl leading-tight shrink-0">{hobby.icon}</span>
            <div className="space-y-1">
              <h3 className="text-headline-sm text-on-surface">{hobby.name}</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {hobby.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `src/views/ContactView.tsx`**

```tsx
import { CV_DATA } from '../constants/cv'

export function ContactView() {
  return (
    <div className="space-y-6 font-sans">
      <h2 className="font-display text-headline-md text-on-surface">Contact</h2>
      <p className="text-body-md text-on-surface-variant leading-relaxed">
        Interested in working together? I'm currently open to senior engineer and tech-lead
        opportunities. Reach out via email or find me on the platforms below.
      </p>
      <div className="space-y-4 pt-2">
        <a
          href={`mailto:${CV_DATA.email}`}
          className="flex items-center gap-3 p-3 bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors group"
        >
          <span className="font-mono text-label-sm text-primary w-16 shrink-0">email</span>
          <span className="font-mono text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
            {CV_DATA.email}
          </span>
        </a>
        <a
          href={`https://${CV_DATA.github}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-3 bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors group"
        >
          <span className="font-mono text-label-sm text-primary w-16 shrink-0">github</span>
          <span className="font-mono text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
            {CV_DATA.github}
          </span>
        </a>
        <a
          href={`https://${CV_DATA.linkedin}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-3 bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors group"
        >
          <span className="font-mono text-label-sm text-primary w-16 shrink-0">linkedin</span>
          <span className="font-mono text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
            {CV_DATA.linkedin}
          </span>
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/views/
git commit -m "feat: implement all five view components with ghost shell os tokens"
```

---

## Task 19: Folder + Taskbar

**Files:**
- Create: `src/components/Desktop/Folder.tsx`, `src/components/Desktop/Taskbar.tsx`

- [ ] **Step 1: Create `src/components/Desktop/Folder.tsx`**

```tsx
import type { ComponentType } from 'react'
import { useWindowStore } from '../../stores/useWindowStore'
import { useFolderStore } from '../../stores/useFolderStore'

interface FolderProps {
  id: string
  label: string
  icon: string
  windowId: string
  position: { x: number; y: number }
  windowComponent: ComponentType
  defaultSize: { width: number; height: number }
}

export function Folder({
  id, label, icon, windowId, position, windowComponent, defaultSize,
}: FolderProps) {
  const { openFolder } = useFolderStore()
  const { openWindow } = useWindowStore()

  const handleDoubleClick = () => {
    openFolder(id)
    openWindow({
      id: windowId,
      title: label,
      component: windowComponent,
      position: { x: 140 + Math.random() * 120, y: 70 + Math.random() * 80 },
      size: defaultSize,
    })
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${label}`}
      onDoubleClick={handleDoubleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleDoubleClick()}
      style={{ position: 'absolute', left: position.x, top: position.y }}
      className="flex flex-col items-center gap-1 p-2 rounded cursor-pointer select-none
                 hover:bg-surface-container-high/60 transition-colors w-16 group"
    >
      <span className="text-3xl leading-none">{icon}</span>
      <span className="font-mono text-label-sm text-on-surface-variant text-center leading-tight
                       group-hover:text-on-surface transition-colors">
        {label}
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/Desktop/Taskbar.tsx`**

```tsx
import { useState, useEffect } from 'react'
import { useWindowStore } from '../../stores/useWindowStore'

export function Taskbar() {
  const { windows, restoreWindow, focusWindow } = useWindowStore()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-surface-container z-[9999] flex items-center px-4 gap-2">
      <div className="flex-1 flex items-center gap-1 overflow-hidden">
        {Object.values(windows).map((win) => (
          <button
            key={win.id}
            onClick={() => (win.isMinimized ? restoreWindow(win.id) : focusWindow(win.id))}
            className={[
              'px-3 py-1 font-mono text-label-sm rounded-sm transition-colors truncate max-w-[120px]',
              win.isFocused && !win.isMinimized
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface',
            ].join(' ')}
          >
            {win.title}
          </button>
        ))}
      </div>
      <time
        className="font-mono text-label-sm text-on-surface-variant tabular-nums shrink-0"
        dateTime={now.toISOString()}
      >
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </time>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Desktop/Folder.tsx src/components/Desktop/Taskbar.tsx
git commit -m "feat: implement Folder (double-click) and Taskbar with live clock"
```

---

## Task 20: Desktop Assembly

**Files:**
- Create: `src/components/Desktop/Desktop.tsx`

- [ ] **Step 1: Create `src/components/Desktop/Desktop.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Desktop/Desktop.tsx
git commit -m "feat: implement Desktop with auto-open terminal and window registry"
```

---

## Task 21: App.tsx + main.tsx Integration

**Files:**
- Modify: `src/App.tsx`, `src/main.tsx`

- [ ] **Step 1: Replace `src/App.tsx`**

```tsx
import { useState } from 'react'
import { BIOSBoot } from './components/BIOSBoot/BIOSBoot'
import { Desktop } from './components/Desktop/Desktop'

export default function App() {
  const [booted, setBooted] = useState(false)

  return (
    <>
      {!booted && <BIOSBoot onBootComplete={() => setBooted(true)} />}
      {booted && <Desktop />}
    </>
  )
}
```

- [ ] **Step 2: Replace `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 3: Verify full TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/main.tsx
git commit -m "feat: wire App.tsx boot state machine — BIOSBoot transitions to Desktop"
```

---

## Task 22: Final Verification

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected output (exact counts):
```
✓ tests/stores/useWindowStore.test.ts (8 tests)
✓ tests/stores/useFolderStore.test.ts (4 tests)
✓ tests/components/BIOSBoot.test.tsx (3 tests)
✓ tests/components/WindowTitleBar.test.tsx (4 tests)
✓ tests/components/commandParser.test.ts (15 tests)

Test Files  5 passed (5)
Tests       34 passed (34)
```

- [ ] **Step 2: TypeScript strict check**

```bash
npx tsc --noEmit --strict
```

Expected: no errors.

- [ ] **Step 3: Build for production**

```bash
npm run build
```

Expected: `dist/` created, no build errors.

- [ ] **Step 4: Preview production build**

```bash
npm run preview
```

Open `http://localhost:4173` in browser. Verify:
- BIOS boot sequence plays (JetBrains Mono, black background, green text)
- Transitions to Desktop after ~2s
- Terminal window auto-opens at centre
- `help` command lists all commands
- `ls` lists filesystem
- `open about` opens an About window
- Double-clicking a folder icon opens a window
- Windows are draggable by title bar
- Close button removes window; minimize hides it; taskbar restores it
- Clock in taskbar updates every second
- No 1px solid borders anywhere — only background-color hierarchy

- [ ] **Step 5: Responsive check**

In DevTools, set viewport to 390×844 (iPhone 14 Pro). Verify:
- Windows constrain within viewport
- Taskbar remains usable
- Terminal is scrollable

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: ghost shell os portfolio — complete implementation

- BIOSBoot sequence with sequenced JetBrains Mono text
- Zustand window kernel (open/close/minimize/focus/drag/resize)
- Framer Motion 300ms glassmorphism windows
- Unix-like terminal with command history
- Five content views: About, Projects, Experience, Hobbies, Contact
- No-Line Rule enforced — all hierarchy via bg color shifts
- 34 passing tests across stores and components"
```

---

## Responsive Grid Notes

The desktop uses `position: fixed` for all windows and a left-rail icon strip at `x: 28px`. On narrow viewports (`< 640px`):

- Folder icons stay in place — left strip remains accessible
- Windows should be opened at `x: 8, y: 40` on mobile (override in `Folder.tsx` with a breakpoint check using `window.innerWidth < 640`)
- The Taskbar remains `h-10` — sufficient for touch targets

No media-query CSS is needed in Tailwind — all responsive behaviour is handled in the JS layer via `window.innerWidth` checks in click handlers.
