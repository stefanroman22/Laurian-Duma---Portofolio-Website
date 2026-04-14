import type { ComponentType } from 'react'

export interface RegistryEntry {
  component: ComponentType
  defaultSize: { width: number; height: number }
  defaultTitle: string
}

const registry: Record<string, RegistryEntry> = {}

export function registerWindow(id: string, entry: RegistryEntry): void {
  registry[id] = entry
}

export function getWindowEntry(id: string): RegistryEntry | undefined {
  return registry[id]
}
