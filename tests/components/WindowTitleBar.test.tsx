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

  it('uses bg-surface-container-high background — no border classes present', () => {
    const { container } = render(
      <WindowTitleBar title="Test" onClose={() => {}} onMinimize={() => {}} />
    )
    const html = container.innerHTML
    expect(html).toContain('surface-container-high')
    expect(html).not.toMatch(/border-\[/)
  })
})
