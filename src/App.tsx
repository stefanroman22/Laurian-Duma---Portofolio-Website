import { useState } from 'react'
import { BIOSBoot } from './components/BIOSBoot/BIOSBoot'
import { Desktop } from './components/Desktop/Desktop'
import { useCMSContent, theme } from './lib/cms'
import { ThemeStyles } from './lib/cms-rich-text'

export default function App() {
  const [booted, setBooted] = useState(false)
  const { data: cms } = useCMSContent()

  return (
    <>
      <ThemeStyles theme={theme(cms)} />
      {!booted && <BIOSBoot onBootComplete={() => setBooted(true)} />}
      {booted && <Desktop />}
    </>
  )
}
