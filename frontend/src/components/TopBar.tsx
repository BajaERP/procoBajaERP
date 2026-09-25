import { BellIcon, HelpIcon, SearchIcon } from './icons'

export interface TopBarBreadcrumb {
  label: string
  href?: string
}

export interface TopBarProps {
  breadcrumbs?: TopBarBreadcrumb[]
  title?: string
  searchPlaceholder?: string
}

const PLACEHOLDER_USER = {
  name: 'Admin ProcoBaja',
  initials: 'AP',
}

export function TopBar({
  breadcrumbs = [],
  title,
  searchPlaceholder = 'Buscar…',
}: TopBarProps) {
  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6 gap-4 shrink-0">
      {/* Title area */}
      <div className="flex-1 min-w-0">
        {breadcrumbs.length > 0 && (
          <nav className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {crumb.href
                  ? <a href={crumb.href} className="hover:text-slate-600 transition-colors">{crumb.label}</a>
                  : <span>{crumb.label}</span>
                }
              </span>
            ))}
          </nav>
        )}
        {title && (
          <h1 className="text-sm font-semibold text-slate-800 truncate">{title}</h1>
        )}
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-60 pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          title="Notificações"
          className="relative p-2 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <BellIcon />
          <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-1 flex items-center justify-center bg-red-500 rounded-full text-[9px] font-bold text-white">
            3
          </span>
        </button>

        <button
          title="Ajuda"
          className="p-2 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <HelpIcon />
        </button>

        <button
          title={PLACEHOLDER_USER.name}
          className="w-7 h-7 rounded-full bg-navy-900 flex items-center justify-center text-white text-xs font-semibold ml-1 hover:opacity-80 transition-opacity"
        >
          {PLACEHOLDER_USER.initials}
        </button>
      </div>
    </header>
  )
}
