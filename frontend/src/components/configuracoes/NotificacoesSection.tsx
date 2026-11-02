export function NotificacoesSection() {
  return (
    <section className="bg-canvas dark:bg-surface-card-dark rounded-lg border border-hairline dark:border-hairline-dark p-4 sm:p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Notificações</h2>
            <p className="text-sm text-mute mt-1">
              Em breve — preferência por canal (e-mail, push, in-app).
            </p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            Em construção
          </span>
        </div>
    </section>
  )
}
