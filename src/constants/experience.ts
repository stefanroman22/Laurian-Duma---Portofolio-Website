import type { ExperienceEntry } from '../types/content'

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'exp-1',
    company: 'Company Name',
    role: 'Senior Software Engineer',
    period: '2024 — Present',
    bullets: [
      'Led development of a design-system component library adopted across 5 product teams.',
      'Reduced initial bundle size by 40% via code-splitting and route-level lazy loading.',
      'Introduced Storybook-driven development — all 60+ components documented and visually tested.',
    ],
  },
  {
    id: 'exp-2',
    company: 'Previous Company',
    role: 'Frontend Engineer',
    period: '2022 — 2024',
    bullets: [
      'Rebuilt the core dashboard in React from a legacy jQuery codebase.',
      'Implemented real-time data visualisations with D3.js and WebSocket feeds.',
    ],
  },
]
