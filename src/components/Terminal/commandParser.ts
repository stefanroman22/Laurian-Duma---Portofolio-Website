import { CV_DATA } from '../../constants/cv'
import { EXPERIENCE } from '../../constants/experience'
import { PROJECTS } from '../../constants/projects'
import { HOBBIES } from '../../constants/hobbies'

export type SideEffect =
  | { type: 'open'; windowId: string }
  | { type: 'clear' }

export interface ParseResult {
  output: string[]
  sideEffect?: SideEffect
  /** Updated cwd if the command moved us. Undefined = no change. */
  cwd?: string
}

// ── Virtual filesystem ────────────────────────────────────────────────────────
//
// One-level layout: root holds files + folders, folders hold files only.
// File contents are pre-rendered string arrays so `cat` just dumps them.

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

interface Dir {
  files: Record<string, string[]>
}

const buildAboutDir = (): Dir => ({
  files: {
    'profile.txt': [
      `Name:    ${CV_DATA.name}`,
      `Title:   ${CV_DATA.title}`,
      `Email:   ${CV_DATA.email}`,
      `GitHub:  ${CV_DATA.github}`,
      `LinkedIn: ${CV_DATA.linkedin}`,
    ],
    'summary.txt': wrap(CV_DATA.summary, 64),
    'clearance.txt': [
      'CLASSIFICATION : UNCLASSIFIED // PERSONNEL_FILE',
      'SUBJECT_ID     : LD-003',
      'CLEARANCE      : LVL.4',
      'STATUS         : OPERATIVE_ACTIVE',
    ],
  },
})

const buildExperienceDir = (): Dir => {
  const files: Record<string, string[]> = {}
  for (const e of EXPERIENCE) {
    const name = `${slug(e.company)}.txt`
    files[name] = [
      `Company : ${e.company}`,
      `Role    : ${e.role}`,
      `Period  : ${e.period}`,
      '',
      'Highlights:',
      ...e.bullets.map((b) => `  • ${b}`),
    ]
  }
  return { files }
}

const buildProjectsDir = (): Dir => {
  const files: Record<string, string[]> = {}
  for (const p of PROJECTS) {
    const name = `${slug(p.name)}.txt`
    const lines: string[] = [
      `Name   : ${p.name}`,
      `Tags   : ${p.tags.join(', ')}`,
    ]
    if (p.url) lines.push(`Live   : ${p.url}`)
    if (p.repo) lines.push(`Repo   : ${p.repo}`)
    lines.push('', ...wrap(p.description, 64))
    files[name] = lines
  }
  return { files }
}

const buildHobbiesDir = (): Dir => {
  const files: Record<string, string[]> = {}
  for (const h of HOBBIES) {
    const name = `${slug(h.name)}.txt`
    files[name] = [
      `${h.icon}  ${h.name}`,
      '',
      ...wrap(h.description, 64),
    ]
  }
  return { files }
}

const buildContactDir = (): Dir => ({
  files: {
    'channels.txt': [
      'CLASSIFICATION : UNCLASSIFIED // CONTACT_PROTOCOLS',
      '',
      `EMAIL    : ${CV_DATA.email}`,
      `GITHUB   : ${CV_DATA.github}`,
      `LINKEDIN : ${CV_DATA.linkedin}`,
      '',
      'Open to senior engineer and tech-lead opportunities.',
    ],
  },
})

const FS = {
  root: {
    'readme.md': [
      'Ghost Shell OS — interactive portfolio',
      'An OS-style experience for Laurian Duma.',
      '',
      'Tips:',
      '  • Type "ls" to list files and folders',
      '  • Type "cd <folder>" to navigate (e.g. "cd projects")',
      '  • Type "cat <file>" to read a file',
      '  • Type "help" for the full command reference',
    ],
    'resume.txt': [
      `${CV_DATA.name}`,
      `${CV_DATA.title}`,
      '',
      `Email   : ${CV_DATA.email}`,
      `GitHub  : ${CV_DATA.github}`,
      `LinkedIn: ${CV_DATA.linkedin}`,
    ],
  } as Record<string, string[]>,
  dirs: {
    about: buildAboutDir(),
    experience: buildExperienceDir(),
    projects: buildProjectsDir(),
    hobbies: buildHobbiesDir(),
    contact: buildContactDir(),
  } as Record<string, Dir>,
}

const VALID_APPS = ['about', 'projects', 'experience', 'hobbies', 'contact', 'terminal']

const HELP_TEXT = [
  'Available commands:',
  '  ls              list contents of current directory',
  '  cd <dir>        change directory  ( .. , / , or ~ for root )',
  '  pwd             print current path',
  '  cat <file>      display file contents',
  '  open <app>      open an application window',
  '  whoami          display user profile',
  '  clear           clear terminal',
  '  help            show this message',
]

// ── Pure helpers ──────────────────────────────────────────────────────────────

/** Wrap a long paragraph at `cols` characters on whitespace boundaries. */
function wrap(text: string, cols: number): string[] {
  const words = text.split(/\s+/)
  const out: string[] = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > cols) {
      if (line) out.push(line)
      line = w
    } else {
      line = (line ? line + ' ' : '') + w
    }
  }
  if (line) out.push(line)
  return out
}

/** Resolve a path relative to cwd. Returns null on invalid path. */
function resolvePath(cwd: string, target: string): string | null {
  // cwd is '' (root) or a folder name like 'projects'
  if (!target || target === '~' || target === '/') return ''
  if (target === '.') return cwd
  if (target === '..') return ''
  // Absolute path: /projects
  if (target.startsWith('/') || target.startsWith('~/')) {
    const stripped = target.replace(/^~?\//, '')
    if (!stripped) return ''
    if (FS.dirs[stripped]) return stripped
    return null
  }
  // Relative: only meaningful from root
  if (cwd === '' && FS.dirs[target]) return target
  return null
}

function prettyPath(cwd: string): string {
  return cwd === '' ? '~' : `~/${cwd}`
}

function listDir(cwd: string): string[] {
  if (cwd === '') {
    const dirs = Object.keys(FS.dirs).map((d) => `${d}/`)
    const files = Object.keys(FS.root)
    return [[...dirs, ...files].join('  ')]
  }
  const d = FS.dirs[cwd]
  if (!d) return [`ls: ${cwd}: No such directory`]
  return [Object.keys(d.files).join('  ')]
}

function readFile(cwd: string, target: string): string[] | null {
  // Absolute path: /projects/ghost-shell-os.txt
  if (target.startsWith('/') || target.startsWith('~/')) {
    const stripped = target.replace(/^~?\//, '')
    const slashIdx = stripped.indexOf('/')
    if (slashIdx === -1) {
      return FS.root[stripped] ?? null
    }
    const dirName = stripped.slice(0, slashIdx)
    const fileName = stripped.slice(slashIdx + 1)
    const dir = FS.dirs[dirName]
    return dir?.files[fileName] ?? null
  }
  // folder/file from root
  if (cwd === '' && target.includes('/')) {
    const [dirName, fileName] = target.split('/')
    const dir = FS.dirs[dirName]
    return dir?.files[fileName] ?? null
  }
  // file in cwd
  if (cwd === '') return FS.root[target] ?? null
  const dir = FS.dirs[cwd]
  return dir?.files[target] ?? null
}

// ── Parser ────────────────────────────────────────────────────────────────────

export function parseCommand(input: string, cwd: string = ''): ParseResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: [] }

  const [cmd, ...args] = trimmed.split(/\s+/)
  const command = cmd.toLowerCase()

  switch (command) {
    case 'help':
      return { output: HELP_TEXT }

    case 'ls':
      return { output: listDir(args[0] ? resolvePath(cwd, args[0]) ?? cwd : cwd) }

    case 'pwd':
      return { output: [`/${cwd}`.replace(/^\/$/, '/')] }

    case 'cd': {
      const target = args[0] ?? ''
      const next = resolvePath(cwd, target)
      if (next === null) return { output: [`cd: ${target}: No such directory`] }
      return { output: [], cwd: next }
    }

    case 'cat': {
      if (!args[0]) return { output: ['Usage: cat <file>'] }
      const content = readFile(cwd, args[0])
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
      return { output: [`${CV_DATA.name.toLowerCase().replace(/\s+/g, '.')} — ${CV_DATA.title}`] }

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

export { prettyPath }
