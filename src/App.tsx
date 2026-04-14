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
