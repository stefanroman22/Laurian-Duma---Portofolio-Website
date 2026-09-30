import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { AboutView } from '../../src/views/AboutView'

vi.mock('../../src/lib/cms', async (orig) => {
  const actual = await orig<typeof import('../../src/lib/cms')>()
  return {
    ...actual,
    useCMSContent: () => ({
      loading: false,
      error: null,
      data: {
        project_slug: 'x',
        project_name: 'x',
        last_updated: null,
        content: {
          cv: {
            _type: 'key_value',
            _label: 'CV',
            entries: [{ key: 'summary', value: '<p>I build <strong>fast</strong> sites</p>' }],
          },
        },
      },
    }),
  }
})

describe('rich text usage', () => {
  it('renders a strong inside .cms-rich on the About summary', () => {
    const { container } = render(<AboutView />)
    expect(container.querySelector('.cms-rich strong')?.textContent).toBe('fast')
  })
})
