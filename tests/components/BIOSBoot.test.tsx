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

  it('renders "Ghost Shell OS v1.0.0" text during boot', async () => {
    vi.useFakeTimers()
    render(<BIOSBoot onBootComplete={() => {}} />)

    await act(async () => {
      vi.runAllTimers()
    })

    expect(screen.getByText('Ghost Shell OS v1.0.0')).toBeDefined()
  })

  it('renders with bg-surface-container-lowest and font-mono classes', () => {
    vi.useFakeTimers()
    const { container } = render(<BIOSBoot onBootComplete={() => {}} />)
    const root = container.firstElementChild
    expect(root?.className).toContain('bg-surface-container-lowest')
    expect(root?.className).toContain('font-mono')
    vi.useRealTimers()
  })
})
