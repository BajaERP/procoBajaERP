interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="w-full min-w-0 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-mute">Esta área está em construção.</p>
      </header>
    </div>
  )
}
