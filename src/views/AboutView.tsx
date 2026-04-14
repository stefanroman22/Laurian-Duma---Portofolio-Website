import { CV_DATA } from '../constants/cv'

const toHref = (url: string) => (url.startsWith('http') ? url : `https://${url}`)

const SKILLS = [
  { code: 'REACT', label: 'UI_SYSTEMS', status: 'ACTIVE' },
  { code: 'TYPESCRIPT', label: 'TYPE_SAFE', status: 'ACTIVE' },
  { code: 'NODE', label: 'BACKEND', status: 'ACTIVE' },
  { code: 'DESIGN_SYS', label: 'COMPONENT_LIB', status: 'ACTIVE' },
  { code: 'PERF', label: 'OPTIMIZATION', status: 'ACTIVE' },
  { code: 'TOOLING', label: 'DX_INFRA', status: 'ACTIVE' },
]

export function AboutView() {
  return (
    <div className="font-mono text-xs h-full flex flex-col gap-3 min-h-0">
      {/* Classification bar */}
      <div className="flex items-center gap-3 text-[10px] text-on-surface-variant tracking-widest shrink-0">
        <span className="text-tertiary">▸</span>
        <span>ID: LD-003</span>
        <span className="text-outline">|</span>
        <span>STATUS: CLAS_OBJ_1</span>
        <span className="text-outline">|</span>
        <span className="text-tertiary">CLEARANCE: LVL.4</span>
      </div>

      {/* Main two-column layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left — photo + identity */}
        <div className="w-40 shrink-0 flex flex-col gap-2">
          {/* Photo placeholder — styled as classified ID photo */}
          <div className="flex-1 min-h-[160px] bg-surface-container rounded-sm relative overflow-hidden flex items-center justify-center"
               style={{ background: 'linear-gradient(160deg, #131313 0%, #1a1919 100%)' }}>
            {/* Scanline overlay */}
            <div className="absolute inset-0 terminal-scanlines pointer-events-none" aria-hidden="true" />
            {/* ID avatar */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="font-mono text-2xl text-primary/60 font-bold">LD</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-on-surface-variant">SUBJECT_ID</p>
                <p className="text-[10px] text-tertiary">LD-003</p>
              </div>
            </div>
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-primary/40" aria-hidden="true" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-primary/40" aria-hidden="true" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-primary/40" aria-hidden="true" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-primary/40" aria-hidden="true" />
          </div>

          {/* Name / title overlay */}
          <div className="bg-surface-container rounded-sm p-2">
            <p className="text-xs text-on-surface font-medium">{CV_DATA.name}</p>
            <p className="text-[10px] text-primary mt-0.5 leading-tight">{CV_DATA.title}</p>
          </div>

          {/* Status badges */}
          <div className="flex flex-col gap-1">
            <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary text-[10px] tracking-wide rounded-sm">
              ● SENIOR_ANALYST
            </span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] tracking-wide rounded-sm">
              ◈ OPERATIVE: ACTIVE
            </span>
          </div>
        </div>

        {/* Right — summary + links */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Summary report panel */}
          <div className="glass-panel rounded-sm p-3 flex-1">
            <p className="text-[10px] text-tertiary tracking-widest mb-2">SUMMARY_REPORT</p>
            <div className="w-8 h-px bg-tertiary/40 mb-3" />
            <p className="text-on-surface-variant font-sans text-xs leading-relaxed">
              {CV_DATA.summary}
            </p>
            <div className="mt-3 pt-3 border-t border-outline/20 space-y-1">
              <div className="flex gap-2">
                <span className="text-[10px] text-on-surface-variant w-14 shrink-0">CONTACT:</span>
                <a href={`mailto:${CV_DATA.email}`} className="text-[10px] text-primary hover:text-primary-container transition-colors truncate">
                  {CV_DATA.email}
                </a>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] text-on-surface-variant w-14 shrink-0">GITHUB:</span>
                <a href={toHref(CV_DATA.github)} target="_blank" rel="noreferrer" className="text-[10px] text-on-surface-variant hover:text-on-surface transition-colors truncate">
                  {CV_DATA.github}
                </a>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] text-on-surface-variant w-14 shrink-0">LINKEDIN:</span>
                <a href={toHref(CV_DATA.linkedin)} target="_blank" rel="noreferrer" className="text-[10px] text-on-surface-variant hover:text-on-surface transition-colors truncate">
                  {CV_DATA.linkedin}
                </a>
              </div>
            </div>
          </div>

          {/* CODE_CERTIFICATIONS grid */}
          <div>
            <p className="text-[10px] text-on-surface-variant tracking-widest mb-2">CODE_CERTIFICATIONS</p>
            <div className="grid grid-cols-3 gap-1.5">
              {SKILLS.map((s) => (
                <div key={s.code} className="bg-surface-container rounded-sm p-2">
                  <p className="text-[10px] text-on-surface font-medium">{s.code}</p>
                  <p className="text-[10px] text-on-surface-variant">{s.label}</p>
                  <p className="text-[10px] text-tertiary mt-0.5">● {s.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CLEARANCE_REGISTER footer */}
      <div className="shrink-0 flex items-center gap-4 px-2 py-1.5 bg-surface-container rounded-sm text-[10px]">
        <span className="text-on-surface-variant flex items-center gap-1">
          <span aria-hidden="true">🔒</span> CLEARANCE_REGISTER
        </span>
        <span className="text-outline">|</span>
        <span className="text-on-surface-variant">MAC-CPU: <span className="text-tertiary">8%</span></span>
        <span className="text-on-surface-variant">KPA: <span className="text-tertiary">.35%</span></span>
        <span className="text-on-surface-variant">ANA-SPL: <span className="text-primary">99.1%</span></span>
        <span className="ml-auto text-on-surface-variant">[LVL.4_VERIFIED]</span>
      </div>
    </div>
  )
}
