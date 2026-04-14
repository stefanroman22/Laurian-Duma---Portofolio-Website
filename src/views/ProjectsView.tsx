import { PROJECTS } from '../constants/projects'

export function ProjectsView() {
  return (
    <div className="space-y-8 font-sans">
      <h2 className="font-display text-headline-md text-on-surface">Projects</h2>
      {PROJECTS.map((project) => (
        <div key={project.id} className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-headline-sm text-on-surface">{project.name}</h3>
            {project.url && (
              <a
                href={`https://${project.url}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-label-sm text-primary hover:text-primary-container transition-colors shrink-0"
              >
                ↗ live
              </a>
            )}
          </div>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-label-sm text-tertiary bg-surface-container-high px-2 py-0.5 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          {project.repo && (
            <a
              href={`https://${project.repo}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {project.repo}
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
