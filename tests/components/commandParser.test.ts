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

  it('"clear" returns clear sideEffect', () => {
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
