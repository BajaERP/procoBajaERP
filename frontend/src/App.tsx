function App() {
  return (
    <main className="app-shell">
      <section className="app-card" aria-labelledby="app-title">
        <p className="app-eyebrow">Proco Baja ERP</p>
        <h1 id="app-title">Frontend configurado</h1>
        <p className="app-description">
          A base React + TypeScript + Vite está pronta para receber as telas do
          sistema.
        </p>
        <div className="app-status" role="status">
          Ambiente carregado com sucesso.
        </div>
      </section>
    </main>
  )
}

export default App
