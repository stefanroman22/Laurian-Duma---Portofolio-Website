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
