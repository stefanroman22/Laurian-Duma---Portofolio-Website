import type { Project } from '../types/content'

export const PROJECTS: Project[] = [
  {
    id: 'proj-ghost-shell',
    name: 'Ghost Shell OS',
    description:
      'This portfolio — a simulated OS desktop built with React, Zustand, and Framer Motion. Inspired by high-end cybersecurity dashboards and editorial dark-mode design.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Zustand'],
    repo: 'github.com/laurianduma/ghost-shell-os',
  },
  {
    id: 'proj-2',
    name: 'Project Alpha',
    description: 'A short description of the project and what makes it interesting.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    url: 'projectalpha.dev',
    repo: 'github.com/laurianduma/project-alpha',
  },
]
