export interface CV {
  name: string
  title: string
  summary: string
  email: string
  github: string
  linkedin: string
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  period: string
  bullets: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  url?: string
  repo?: string
}

export interface Hobby {
  id: string
  name: string
  description: string
  icon: string
}
