import { PROJECTS } from '../constants/projects'

const toHref = (url: string) => (url.startsWith('http') ? url : `https://${url}`)

export function ProjectsView() {
  return (
    <div className="font-mono space-y-4 text-xs">
      <p className="text-[10px] text-on-surface-variant tracking-widest uppercase">
        CLASSIFICATION: RESTRICTED // PROJECT_ARCHIVE
      </p>
      {PROJECTS.map((project) => (
        <div key={project.id} className="bg-surface-container rounded-sm p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-on-surface font-medium">{project.name}</p>
            {project.url && (
              <a
                href={toHref(project.url)}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} — live site`}
                className="text-[10px] text-primary hover:text-primary-container transition-colors shrink-0 flex items-center gap-1"
              >
                <span aria-hidden="true">↗</span> LIVE
              </a>
            )}
          </div>
          <p className="text-on-surface-variant font-sans leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-surface-container-high text-tertiary text-[10px] rounded-sm">
                {tag}
              </span>
            ))}
          </div>
          {project.repo && (
            <a
              href={toHref(project.repo)}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
            >
              <span aria-hidden="true">↗</span> {project.repo}
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
