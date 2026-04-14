import { CV_DATA } from '../constants/cv'

const toHref = (url: string) => (url.startsWith('http') ? url : `https://${url}`)

export function AboutView() {
  return (
    <div className="font-mono space-y-5 text-xs">
      {/* Classification header */}
      <p className="text-[10px] text-on-surface-variant tracking-widest uppercase">
        CLASSIFICATION: RESTRICTED // PERSONNEL_CV
      </p>

      {/* Identity card */}
      <div className="bg-surface-container rounded-sm p-4 space-y-3">
        <p className="text-[10px] text-tertiary tracking-widest">IDENTITY</p>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-sm bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="font-mono text-sm text-primary font-medium">LD</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm text-on-surface font-medium">LD_ADMIN</p>
            <p className="text-[10px] text-tertiary tracking-wide">[LVL.4 CLEARANCE]</p>
          </div>
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="flex gap-2">
            <span className="text-on-surface-variant w-16 shrink-0">NAME:</span>
            <span className="text-on-surface">{CV_DATA.name}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-on-surface-variant w-16 shrink-0">ROLE:</span>
            <span className="text-on-surface">{CV_DATA.title}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-on-surface-variant w-16 shrink-0">CONTACT:</span>
            <a href={`mailto:${CV_DATA.email}`} className="text-primary hover:text-primary-container transition-colors">
              {CV_DATA.email}
            </a>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <p className="text-[10px] text-on-surface-variant tracking-widest flex items-center gap-2">
          SUMMARY <span className="flex-1 h-px bg-outline/30" />
        </p>
        <p className="text-on-surface-variant leading-relaxed text-xs font-sans">{CV_DATA.summary}</p>
      </div>

      {/* Links */}
      <div className="space-y-2">
        <p className="text-[10px] text-on-surface-variant tracking-widest flex items-center gap-2">
          LINKS <span className="flex-1 h-px bg-outline/30" />
        </p>
        <a
          href={toHref(CV_DATA.github)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-primary hover:text-primary-container transition-colors"
        >
          <span aria-hidden="true">↗</span>
          {CV_DATA.github}
        </a>
        <a
          href={toHref(CV_DATA.linkedin)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-primary hover:text-primary-container transition-colors"
        >
          <span aria-hidden="true">↗</span>
          {CV_DATA.linkedin}
        </a>
      </div>
    </div>
  )
}
