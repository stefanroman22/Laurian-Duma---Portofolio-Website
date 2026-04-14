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
