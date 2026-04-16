import { PROJECTS } from '../constants/projects'
import { useCMSContent } from '../lib/cms'

const toHref = (url: string) => (url.startsWith('http') ? url : `https://${url}`)

export function ProjectsView() {
  const { data: cms } = useCMSContent()

  const cmsItems = (cms?.content.projects_list as { items?: Record<string, unknown>[] } | undefined)?.items
  const projects = cmsItems
    ? cmsItems.map((item, i) => ({
        id:          `proj-${i}`,
        name:        String(item.name        ?? ''),
        description: String(item.description ?? ''),
        tags:        Array.isArray(item.tags) ? (item.tags as string[]) : [],
        url:         item.url  ? String(item.url)  : undefined,
        repo:        item.repo ? String(item.repo) : undefined,
      }))
    : PROJECTS

  return (
    <div className="font-mono space-y-4">
      <p className="text-xs text-on-surface-variant tracking-widest uppercase">
        CLASSIFICATION: RESTRICTED // PROJECT_ARCHIVE
      </p>
      {projects.map((project) => (
        <div key={project.id} className="bg-surface-container rounded-sm p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-base text-on-surface font-medium">{project.name}</p>
            {project.url && (
              <a
                href={toHref(project.url)}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} — live site`}
                className="text-xs text-primary hover:text-primary-container transition-colors shrink-0 flex items-center gap-1"
              >
                <span aria-hidden="true">↗</span> LIVE
              </a>
            )}
          </div>
          <p className="text-sm text-on-surface-variant font-sans leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-surface-container-high text-tertiary text-xs rounded-sm">
                {tag}
              </span>
            ))}
          </div>
          {project.repo && (
            <a
              href={toHref(project.repo)}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
            >
              <span aria-hidden="true">↗</span> {project.repo}
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
