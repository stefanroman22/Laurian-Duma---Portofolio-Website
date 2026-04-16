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
    { id: 0, text: 'Ghost Shell OS v1.0 — Initializing secure connection...', isInput: false },
    { id: 1, text: "Type 'help' for available commands.", isInput: false },
  ])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lineId = useRef(2)
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
      <div className="pointer-events-none absolute inset-0 terminal-scanlines z-10" aria-hidden="true" />

      <div className="relative z-20 h-full flex flex-col p-3 overflow-y-auto os-scrollbar">
        <div className="flex-1">
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
          <span className="text-primary mr-2 select-none">[LD@ghost ~]$</span>
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
