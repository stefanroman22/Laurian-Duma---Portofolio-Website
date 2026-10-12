import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { HobbiesView } from '../../src/views/HobbiesView'
import { AboutView } from '../../src/views/AboutView'

const content: Record<string, unknown> = {}

vi.mock('../../src/lib/cms', async (orig) => {
  const actual = await orig<typeof import('../../src/lib/cms')>()
  return {
    ...actual,
    useCMSContent: () => ({
      loading: false,
      error: null,
      data: { project_slug: 'x', project_name: 'x', last_updated: null, content },
    }),
  }
})

const icon = { src: 'https://example.com/i.svg', mode: 'tint', color: '#69fd5d', name: 'camera' }

describe('CMS media fields', () => {
  beforeEach(() => {
    for (const k of Object.keys(content)) delete content[k]
  })

  it('renders the hobby icon_image as a tinted CmsIcon', () => {
    content.hobbies = { _type: 'repeater', _label: 'H', items: [{ name: 'A', description: '', icon: '📷', icon_image: icon }] }
    const { container } = render(<HobbiesView />)
    const el = container.querySelector<HTMLElement>('.cms-icon')
    expect(el?.style.backgroundColor).toBe('rgb(105, 253, 93)')
    expect(container.textContent).not.toContain('📷')
  })

  it('falls back to the emoji when icon_image is empty', () => {
    content.hobbies = { _type: 'repeater', _label: 'H', items: [{ name: 'A', description: '', icon: '📷', icon_image: null }] }
    const { container } = render(<HobbiesView />)
    expect(container.querySelector('.cms-icon')).toBeNull()
    expect(container.textContent).toContain('📷')
  })

  it('uses the CMS hero_image alt, with the name as fallback', () => {
    content.hero_image = { _type: 'image', _label: 'Hero', url: 'https://example.com/p.jpg', alt: 'Portrait' }
    const { container, unmount } = render(<AboutView />)
    expect(container.querySelector('img')?.getAttribute('alt')).toBe('Portrait')
    unmount()
    content.hero_image = { _type: 'image', _label: 'Hero', url: 'https://example.com/p.jpg', alt: '' }
    const second = render(<AboutView />)
    expect(second.container.querySelector('img')?.getAttribute('alt')).toBe('Laurian Duma')
  })
})
