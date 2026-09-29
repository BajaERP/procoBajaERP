import { useMemo, useState, type KeyboardEvent } from 'react'
import { CheckIcon, CloseIcon } from '../components/icons'

// Tipos compartilhados pelo módulo de gestão
type MembroStatus = 'Ativo' | 'Atenção' | 'Crítico'

interface Membro {
  id: string
  nome: string
  subarea: 'Chassis' | 'Motor' | 'Dinâmica' | 'TI'
  presencas: number
  totalReunioes: number
  horasRegistradas: number
  horasMeta: number
  status: MembroStatus
  observacoes: string[]
}

interface Reuniao {
  titulo: string
  data: string
  hora: string
  tipo: 'Obrigatória' | 'Opcional'
  presentes: string[]
}

const MEMBROS_INICIAIS: Membro[] = [
  {
    id: 'M001',
    nome: 'Ana Souza',
    subarea: 'Chassis',
    presencas: 9,
    totalReunioes: 10,
    horasRegistradas: 42,
    horasMeta: 40,
    status: 'Ativo',
    observacoes: ['Excelente participação nas reuniões.'],
  },
  {
    id: 'M002',
    nome: 'Bruno Lima',
    subarea: 'Motor',
    presencas: 7,
    totalReunioes: 10,
    horasRegistradas: 28,
    horasMeta: 40,
    status: 'Atenção',
    observacoes: ['Presença abaixo do esperado em setembro.'],
  },
  {
    id: 'M003',
    nome: 'Carla Mendes',
    subarea: 'Dinâmica',
    presencas: 10,
    totalReunioes: 10,
    horasRegistradas: 55,
    horasMeta: 40,
    status: 'Ativo',
    observacoes: [],
  },
  {
    id: 'M004',
    nome: 'Diego Costa',
    subarea: 'TI',
    presencas: 8,
    totalReunioes: 10,
    horasRegistradas: 35,
    horasMeta: 40,
    status: 'Ativo',
    observacoes: [],
  },
  {
    id: 'M005',
    nome: 'Felipe Rocha',
    subarea: 'Chassis',
    presencas: 4,
    totalReunioes: 10,
    horasRegistradas: 12,
    horasMeta: 40,
    status: 'Crítico',
    observacoes: ['Múltiplas faltas sem justificativa.', 'Contato realizado em 18/09/2026.'],
  },
  {
    id: 'M006',
    nome: 'Gabriela Nunes',
    subarea: 'Motor',
    presencas: 9,
    totalReunioes: 10,
    horasRegistradas: 38,
    horasMeta: 40,
    status: 'Ativo',
    observacoes: [],
  },
]

const REUNIOES: Reuniao[] = [
  {
    titulo: 'Reunião Semanal Geral',
    data: '2026-09-23',
    hora: '19h00',
    tipo: 'Obrigatória',
    presentes: ['M001', 'M002', 'M003', 'M004', 'M006'],
  },
  {
    titulo: 'Review Sprint 4',
    data: '2026-09-20',
    hora: '18h30',
    tipo: 'Obrigatória',
    presentes: ['M001', 'M003', 'M004', 'M005', 'M006'],
  },
  {
    titulo: 'Workshop Chassis',
    data: '2026-09-18',
    hora: '18h00',
    tipo: 'Opcional',
    presentes: ['M001', 'M003'],
  },
]

const SUBAREAS = ['Chassis', 'Motor', 'Dinâmica', 'TI'] as const
type Subarea = (typeof SUBAREAS)[number]

type Aba = 'membros' | 'presencas' | 'reunioes' | 'subsistemas'

const ABAS: Array<{ id: Aba; label: string }> = [
  { id: 'membros', label: 'Membros' },
  { id: 'presencas', label: 'Presenças' },
  { id: 'reunioes', label: 'Reuniões' },
  { id: 'subsistemas', label: 'Subsistemas' },
]

// Status chips — semantic only (Ativo=emerald, Atenção=amber, Crítico=red).
// These are not the brand accent; they communicate member health.
const STATUS_CHIP: Record<MembroStatus, string> = {
  Ativo: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  Atenção: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  Crítico: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
}

function corPresenca(pct: number): string {
  if (pct >= 80) return 'bg-emerald-500'
  if (pct >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

function percentualPresenca(membro: Pick<Membro, 'presencas' | 'totalReunioes'>): number {
  if (membro.totalReunioes <= 0) return 0
  return (membro.presencas / membro.totalReunioes) * 100
}

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(ano, mes - 1, dia)))
}

function iniciais(nome: string): string {
  return nome
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function GestaoPage() {
  const [membros, setMembros] = useState<Membro[]>(MEMBROS_INICIAIS)
  const [membroSelecionado, setMembroSelecionado] = useState<string | null>(null)
  const [novaObs, setNovaObs] = useState('')
  const [aba, setAba] = useState<Aba>('membros')

  const membro = membros.find((m) => m.id === membroSelecionado) ?? null

  function adicionarObservacao(id: string) {
    const texto = novaObs.trim()
    if (!texto) return
    setMembros((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, observacoes: [...m.observacoes, texto] } : m,
      ),
    )
    setNovaObs('')
  }

  const kpis = useMemo(() => {
    const total = membros.length
    const criticos = membros.filter((m) => m.status === 'Crítico').length
    const atencao = membros.filter((m) => m.status === 'Atenção').length
    const mediaPresenca =
      total === 0
        ? 0
        : Math.round(
            membros.reduce((acc, m) => acc + percentualPresenca(m), 0) / total,
          )
    return { total, criticos, atencao, mediaPresenca }
  }, [membros])

  const statsPorSubarea = useMemo(() => {
    return SUBAREAS.map((sub) => {
      const lista = membros.filter((m) => m.subarea === sub)
      const avg =
        lista.length === 0
          ? 0
          : Math.round(
              lista.reduce((acc, m) => acc + percentualPresenca(m), 0) / lista.length,
            )
      return {
        subarea: sub,
        membros: lista.length,
        presenca: avg,
        criticos: lista.filter((m) => m.status === 'Crítico').length,
      }
    })
  }, [membros])

  return (
    <div className="min-w-0 space-y-6 p-4 sm:p-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-ink">Gestão de Equipe e Subsistemas</h1>
        <p className="text-sm text-mute">
          Visão geral da equipe, presenças, reuniões e saúde dos subsistemas do veículo.
        </p>
      </header>

      {/* KPIs */}
      <section aria-label="Indicadores da equipe" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Kpi label="Total de membros" value={kpis.total} tone="ink" />
        <Kpi label="Média de Presença" value={`${kpis.mediaPresenca}%`} tone="red" />
        <Kpi label="Em Atenção" value={kpis.atencao} tone="amber" />
        <Kpi label="Situação Crítica" value={kpis.criticos} tone="red" />
      </section>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Seções de gestão"
        aria-orientation="horizontal"
        className="flex min-w-0 gap-1 border-b border-hairline overflow-x-auto overflow-y-hidden"
      >
        {ABAS.map((a) => (
          <button
            key={a.id}
            id={`aba-gestao-${a.id}`}
            type="button"
            role="tab"
            aria-selected={aba === a.id}
            aria-controls={`painel-gestao-${a.id}`}
            tabIndex={aba === a.id ? 0 : -1}
            onClick={() => setAba(a.id)}
            onKeyDown={(event) => navegarAbasPorTeclado(event, a.id, setAba)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              aba === a.id
                ? 'border-red text-red dark:text-red-300'
                : 'border-transparent text-mute hover:text-ink'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <section
        id="painel-gestao-membros"
        role="tabpanel"
        aria-labelledby="aba-gestao-membros"
        tabIndex={aba === 'membros' ? 0 : -1}
        hidden={aba !== 'membros'}
      >
        <MembrosTab
          membros={membros}
          selecionado={membroSelecionado}
          onSelecionar={setMembroSelecionado}
          membro={membro}
          novaObs={novaObs}
          setNovaObs={setNovaObs}
          onAdicionarObservacao={adicionarObservacao}
        />
      </section>

      <section
        id="painel-gestao-presencas"
        role="tabpanel"
        aria-labelledby="aba-gestao-presencas"
        tabIndex={aba === 'presencas' ? 0 : -1}
        hidden={aba !== 'presencas'}
      >
        <PresencasTab membros={membros} />
      </section>

      <section
        id="painel-gestao-reunioes"
        role="tabpanel"
        aria-labelledby="aba-gestao-reunioes"
        tabIndex={aba === 'reunioes' ? 0 : -1}
        hidden={aba !== 'reunioes'}
      >
        <ReunioesTab reunioes={REUNIOES} membros={membros} />
      </section>

      <section
        id="painel-gestao-subsistemas"
        role="tabpanel"
        aria-labelledby="aba-gestao-subsistemas"
        tabIndex={aba === 'subsistemas' ? 0 : -1}
        hidden={aba !== 'subsistemas'}
      >
        <SubsistemasTab stats={statsPorSubarea} />
      </section>
    </div>
  )
}

function navegarAbasPorTeclado(
  event: KeyboardEvent<HTMLButtonElement>,
  atual: Aba,
  selecionar: (aba: Aba) => void,
) {
  const indice = ABAS.findIndex((aba) => aba.id === atual)
  let proximoIndice: number | null = null

  if (event.key === 'ArrowRight') proximoIndice = (indice + 1) % ABAS.length
  if (event.key === 'ArrowLeft') proximoIndice = (indice - 1 + ABAS.length) % ABAS.length
  if (event.key === 'Home') proximoIndice = 0
  if (event.key === 'End') proximoIndice = ABAS.length - 1
  if (proximoIndice === null) return

  event.preventDefault()
  const proximaAba = ABAS[proximoIndice].id
  selecionar(proximaAba)
  document.getElementById(`aba-gestao-${proximaAba}`)?.focus()
}

// ============== Subcomponentes locais ==============

function Kpi({
  label,
  value,
  tone,
}: {
  label: string
  value: number | string
  tone: 'ink' | 'red' | 'amber'
}) {
  const toneClasses: Record<typeof tone, string> = {
    ink: 'text-ink',
    red: 'text-red dark:text-red-300',
    amber: 'text-amber-600 dark:text-amber-300',
  }
  return (
    <div className="min-w-0 bg-canvas dark:bg-surface-card-dark rounded-lg border border-hairline dark:border-hairline-dark p-4 sm:p-5">
      <p className="text-xs font-medium text-mute uppercase tracking-wide break-words">
        {label}
      </p>
      <p className={`text-2xl font-semibold mt-2 font-mono ${toneClasses[tone]}`}>
        {value}
      </p>
    </div>
  )
}

function MembrosTab({
  membros,
  selecionado,
  onSelecionar,
  membro,
  novaObs,
  setNovaObs,
  onAdicionarObservacao,
}: {
  membros: Membro[]
  selecionado: string | null
  onSelecionar: (id: string | null) => void
  membro: Membro | null
  novaObs: string
  setNovaObs: (v: string) => void
  onAdicionarObservacao: (id: string) => void
}) {
  return (
    <div className="grid min-w-0 grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="min-w-0 lg:col-span-2 bg-canvas dark:bg-surface-card-dark rounded-lg border border-hairline dark:border-hairline-dark overflow-hidden">
        <div className="max-w-full overflow-x-auto overscroll-x-contain" role="region" aria-label="Tabela de membros; deslize horizontalmente para ver todas as colunas" tabIndex={0}>
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-[11px] text-mute font-semibold uppercase tracking-wide border-b border-hairline-soft">
                <th scope="col" className="px-5 py-3 text-left">Membro</th>
                <th scope="col" className="px-5 py-3 text-left">Subsistema</th>
                <th scope="col" className="px-5 py-3 text-center">Presença</th>
                <th scope="col" className="px-5 py-3 text-center">Horas</th>
                <th scope="col" className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {membros.map((m) => {
                const pct = Math.round(percentualPresenca(m))
                const ativo = selecionado === m.id
                return (
                  <tr
                    key={m.id}
                    onClick={() => onSelecionar(ativo ? null : m.id)}
                    className={`border-b border-hairline-soft hover:bg-surface-soft cursor-pointer ${
                      ativo ? 'bg-red/5' : ''
                    }`}
                  >
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        aria-pressed={ativo}
                        aria-label={`Selecionar ${m.nome}`}
                        className="flex w-full items-center gap-2.5 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red"
                      >
                        <div className="w-7 h-7 rounded-full bg-secondary-bg flex items-center justify-center text-[11px] font-semibold text-ink shrink-0">
                          {iniciais(m.nome)}
                        </div>
                        <span className="font-medium text-ink text-xs">
                          {m.nome}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-3 text-xs text-mute">
                      {m.subarea}
                    </td>
                    <td className="px-5 py-3 text-center text-xs font-mono text-body">
                      {pct}%
                    </td>
                    <td className="px-5 py-3 text-center text-xs font-mono text-body">
                      {m.horasRegistradas}h
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${STATUS_CHIP[m.status]}`}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="min-w-0 bg-canvas dark:bg-surface-card-dark rounded-lg border border-hairline dark:border-hairline-dark p-4 sm:p-5 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ink">
          {membro ? `Observações — ${membro.nome}` : 'Selecione um membro'}
        </h2>
        {membro ? (
          <>
            <div className="flex-1 space-y-2 min-h-[120px]">
              {membro.observacoes.length === 0 && (
                <p className="text-xs text-ash">
                  Nenhuma observação registrada.
                </p>
              )}
              {membro.observacoes.map((obs, i) => (
                <div
                  key={i}
                  className="bg-surface-soft dark:bg-surface-card rounded-md p-2.5"
                >
                  <p className="text-xs text-body leading-snug">
                    {obs}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-hairline-soft">
              <label htmlFor={`nova-observacao-${membro.id}`} className="sr-only">
                Nova observação para {membro.nome}
              </label>
              <input
                id={`nova-observacao-${membro.id}`}
                value={novaObs}
                onChange={(e) => setNovaObs(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && onAdicionarObservacao(membro.id)
                }
                placeholder="Nova observação…"
                className="min-w-0 flex-1 px-3 py-2 rounded-md border border-hairline dark:border-hairline-dark bg-surface-soft dark:bg-surface-dark text-xs text-ink placeholder-ash focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red"
              />
              <button
                type="button"
                onClick={() => onAdicionarObservacao(membro.id)}
                aria-label="Adicionar observação"
                disabled={!novaObs.trim()}
                className="min-h-10 min-w-10 text-xs px-3 py-1.5 rounded-md bg-red hover:bg-red-pressed text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                +
              </button>
            </div>
          </>
        ) : (
          <p className="text-xs text-ash">
            Clique em um membro para ver e registrar observações.
          </p>
        )}
      </aside>
    </div>
  )
}

function PresencasTab({ membros }: { membros: Membro[] }) {
  return (
    <div className="min-w-0 bg-canvas dark:bg-surface-card-dark rounded-lg border border-hairline dark:border-hairline-dark overflow-hidden">
      <div className="max-w-full overflow-x-auto overscroll-x-contain" role="region" aria-label="Tabela de presenças; deslize horizontalmente para ver todas as colunas" tabIndex={0}>
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="text-[11px] text-mute font-semibold uppercase tracking-wide border-b border-hairline-soft">
              <th scope="col" className="px-5 py-3 text-left">Membro</th>
              <th scope="col" className="px-5 py-3 text-left">Subsistema</th>
              <th scope="col" className="px-5 py-3 text-center">Presenças</th>
              <th scope="col" className="px-5 py-3 text-center">Reuniões</th>
              <th scope="col" className="px-5 py-3 text-left">Taxa</th>
              <th scope="col" className="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {membros.map((m) => {
              const pct = Math.round(percentualPresenca(m))
              return (
                <tr
                  key={m.id}
                  className="border-b border-hairline-soft hover:bg-surface-soft"
                >
                  <td className="px-5 py-3 font-medium text-ink text-xs">
                    {m.nome}
                  </td>
                  <td className="px-5 py-3 text-xs text-mute">
                    {m.subarea}
                  </td>
                  <td className="px-5 py-3 text-center font-mono text-xs text-body">
                    {m.presencas}
                  </td>
                  <td className="px-5 py-3 text-center font-mono text-xs text-mute">
                    {m.totalReunioes}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-secondary-bg rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${corPresenca(pct)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-mute">
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${STATUS_CHIP[m.status]}`}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReunioesTab({
  reunioes,
  membros,
}: {
  reunioes: Reuniao[]
  membros: Membro[]
}) {
  return (
    <div className="space-y-4">
      {reunioes.map((r, i) => (
        <div
          key={i}
          className="min-w-0 bg-canvas dark:bg-surface-card-dark rounded-lg border border-hairline dark:border-hairline-dark p-4 sm:p-5"
        >
          <div className="flex items-start justify-between mb-3 gap-3">
            <div>
              <h2 className="text-sm font-semibold text-ink">
                {r.titulo}
              </h2>
              <p className="text-xs text-mute mt-0.5">
                {formatarData(r.data)} · {r.hora}
              </p>
            </div>
            <span
              className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-md ${
                r.tipo === 'Obrigatória'
                  ? 'bg-red/10 text-red dark:text-red-300'
                  : 'bg-secondary-bg text-mute'
              }`}
            >
              {r.tipo}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {membros.map((m) => {
              const presente = r.presentes.includes(m.id)
              return (
                <span
                  key={m.id}
                  role="img"
                  aria-label={`${m.nome}: ${presente ? 'presente' : 'ausente'}`}
                  className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    presente
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300'
                  }`}
                >
                  <span>{m.nome.split(' ')[0]}</span>
                  {presente ? <CheckIcon /> : <CloseIcon />}
                </span>
              )
            })}
          </div>
          <p className="text-[11px] text-mute mt-2">
            {r.presentes.length}/{membros.length} presentes
          </p>
        </div>
      ))}
    </div>
  )
}

function SubsistemasTab({
  stats,
}: {
  stats: Array<{
    subarea: Subarea
    membros: number
    presenca: number
    criticos: number
  }>
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.subarea}
          className="min-w-0 bg-canvas dark:bg-surface-card-dark rounded-lg border border-hairline dark:border-hairline-dark p-4 sm:p-5 space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-sm font-semibold text-ink">
              {s.subarea}
            </h2>
            {s.criticos > 0 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                {s.criticos} crítico{s.criticos > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-wide text-mute">
                Membros
              </span>
              <span className="font-mono text-sm text-ink">
                {s.membros}
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] uppercase tracking-wide text-mute">
                  Presença média
                </span>
                <span className="font-mono text-sm text-ink">
                  {s.presenca}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-secondary-bg rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${corPresenca(s.presenca)}`}
                  style={{ width: `${s.presenca}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
