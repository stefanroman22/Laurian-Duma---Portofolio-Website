import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const TARGET = 'Laurian Duma'
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+=?'

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

// Tick cadence. Each tick flips 1–3 non-space positions, with an occasional
// "clean" tick that restores the full name for ~2 s before scrambling resumes.
const TICK_MS = 140
const CLEAN_TICK_EVERY = 28   // ~ one clean pass every ~4 s
const CLEAN_HOLD_TICKS = 14   // hold the clean name for ~2 s

export function EncryptedBrand() {
  const [chars, setChars] = useState<string[]>(() => TARGET.split(''))
  // Each slot gets a unique key so React/Framer can animate *this* glyph out
  // and the next one in, instead of crossfading by index.
  const [keys, setKeys] = useState<number[]>(() => TARGET.split('').map((_, i) => i))
  const keyCounter = useState(() => ({ n: TARGET.length }))[0]

  useEffect(() => {
    let tick = 0
    let cleanHold = 0

    const id = setInterval(() => {
      tick++

      // Clean restore pulse: snap back to TARGET and hold it briefly.
      if (tick % CLEAN_TICK_EVERY === 0) {
        cleanHold = CLEAN_HOLD_TICKS
      }
      if (cleanHold > 0) {
        cleanHold--
        setChars((prev) => {
          const target = TARGET.split('')
          let changed = false
          const next = prev.map((c, i) => {
            if (c !== target[i]) { changed = true; return target[i] }
            return c
          })
          if (changed) {
            setKeys((pk) => pk.map((k, i) => (prev[i] !== target[i] ? ++keyCounter.n : k)))
          }
          return next
        })
        return
      }

      // Scramble pass: flip 1–3 random non-space positions.
      const flipCount = 1 + Math.floor(Math.random() * 3)
      const positions = new Set<number>()
      let tries = 0
      while (positions.size < flipCount && tries < 20) {
        const p = Math.floor(Math.random() * TARGET.length)
        if (TARGET[p] !== ' ') positions.add(p)
        tries++
      }

      setChars((prev) => {
        const next = prev.slice()
        for (const p of positions) {
          // 30 % chance to restore the true letter, 70 % to scramble.
          next[p] = Math.random() < 0.3 ? TARGET[p] : randomGlyph()
        }
        return next
      })
      setKeys((prev) => {
        const next = prev.slice()
        for (const p of positions) next[p] = ++keyCounter.n
        return next
      })
    }, TICK_MS)

    return () => clearInterval(id)
  }, [keyCounter])

  return (
    <span
      className="font-mono text-xs text-tertiary tracking-widest select-none hidden sm:inline-flex"
      aria-label={TARGET}
    >
      {chars.map((c, i) => (
        <span
          key={`slot-${i}`}
          className="relative inline-block"
          style={{ width: c === ' ' ? '0.5em' : '0.7em', height: '1em' }}
          aria-hidden="true"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={keys[i]}
              initial={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {c === ' ' ? '\u00A0' : c}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}
