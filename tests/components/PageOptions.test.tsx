import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { AboutView } from '../../src/views/AboutView'
import { HOME_PAGE_DEFAULTS, homePageOptions, pageSurface, windowFit } from '../../src/lib/pageOptions'
import { contrastRatio } from '../../src/lib/cms-rich-text'

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

const options = (values: Record<string, unknown>) => ({
  _type: 'options',
  _label: 'Home',
  _schema: [
    { key: 'background', label: 'B', type: 'color' },
    { key: 'card_background', label: 'C', type: 'color' },
    { key: 'content_width', label: 'W', type: 'select', options: ['narrow', 'standard', 'wide', 'full'].map((v) => ({ value: v, label: v })) },
    { key: 'photo_position', label: 'P', type: 'select', options: [{ value: 'left', label: 'L' }, { value: 'right', label: 'R' }] },
    { key: 'show_skills', label: 'S', type: 'toggle' },
  ],
  values,
})

const data = (c: Record<string, unknown>) => ({ project_slug: 'x', project_name: 'x', last_updated: null, content: c as never })

describe('home page display options', () => {
  beforeEach(() => {
    for (const k of Object.keys(content)) delete content[k]
  })

  it('falls back to the designed look without an options service', () => {
    expect(homePageOptions(null)).toEqual(HOME_PAGE_DEFAULTS)
    expect(homePageOptions(data({ home_page_options: options({ content_width: 'huge', show_skills: 'no' }) }))).toEqual(HOME_PAGE_DEFAULTS)
    expect(pageSurface(HOME_PAGE_DEFAULTS)).toEqual({ className: '', style: {} })
  })

  it('reads stored values declared by the schema', () => {
    const o = homePageOptions(data({ home_page_options: options({ content_width: 'wide', photo_position: 'right', show_skills: false, background: '#FFFFFF' }) }))
    expect(o).toMatchObject({ content_width: 'wide', photo_position: 'right', show_skills: false, background: '#ffffff' })
  })

  it('keeps every card text colour at 4.5:1 on the card and its chips', () => {
    for (const card of ['#ffffff', '#1a1919', '#777777', '#69fd5d', '#0011fe', '#f5e6c8']) {
      const { className, style } = pageSurface({ background: '', card_background: card })
      expect(className).toBe('page-custom-card')
      const vars = style as Record<string, string>
      for (const text of ['--page-card-ink', '--page-card-muted', '--page-card-primary', '--page-card-tertiary']) {
        expect(contrastRatio(vars[text], card)).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(vars[text], vars['--page-card-chip'])).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it('keeps the designed white ink and accents on the designed card colour', () => {
    const vars = pageSurface({ background: '', card_background: '#1a1919' }).style as Record<string, string>
    expect(vars['--page-card-ink']).toBe('#ffffff')
    expect(vars['--page-card-primary']).toBe('#86adff')
    expect(vars['--page-card-tertiary']).toBe('#69fd5d')
  })

  it('sizes content windows by content_width', () => {
    const win = { x: 220, width: 680 }
    expect(windowFit('standard', win, 1200)).toBeNull()
    expect(windowFit('narrow', win, 1200)).toEqual({ x: 220, width: 578 })
    expect(windowFit('wide', win, 1400)).toEqual({ x: 220, width: 884 })
    expect(windowFit('wide', win, 1000)).toEqual({ x: 220, width: 768 })
    expect(windowFit('wide', win, 800)).toEqual({ x: 220, width: 680 })
    expect(windowFit('full', win, 1200)).toEqual({ x: 12, width: 1176 })
  })

  it('moves the About photo and hides the skills grid', () => {
    const first = render(<AboutView />)
    expect(first.container.textContent).toContain('CODE_CERTIFICATIONS')
    expect(first.container.querySelector('.flex-row-reverse')).toBeNull()
    first.unmount()
    content.home_page_options = options({ photo_position: 'right', show_skills: false })
    const { container } = render(<AboutView />)
    expect(container.textContent).not.toContain('CODE_CERTIFICATIONS')
    expect(container.querySelector('.flex-row-reverse')).not.toBeNull()
  })
})
