import { createHashRouter, Navigate } from 'react-router-dom'
import { Shell } from './Shell'
import { ProtectedRoute } from './ProtectedRoute'

import WelcomePage from '../pages/WelcomePage'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import EquipePage from '../pages/EquipePage'
import GestaoPage from '../pages/GestaoPage'
import AtividadesPage from '../pages/AtividadesPage'
import FinanceiroPage from '../pages/FinanceiroPage'
import CompeticoesPage from '../pages/CompeticoesPage'
import DocumentacaoPage from '../pages/DocumentacaoPage'
import { PlaceholderPage } from '../components/shared/PlaceholderPage'
import ConfiguracoesPage from '../pages/ConfiguracoesPage'

// Routes:
//   /          → Welcome (AFK default, logo + blank wallpaper)
//   /login     → Login form (only reachable via welcome click/keypress)
//   /app/*     → Authenticated shell. Users land on /app/dashboard after login.
export const router = createHashRouter([
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <Shell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'gestao', Component: GestaoPage },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'equipe', Component: EquipePage },
      { path: 'pessoas', element: <PlaceholderPage title="Pessoas e Participação" /> },
      { path: 'governanca', element: <PlaceholderPage title="Governança" /> },
      { path: 'atividades', Component: AtividadesPage },
      { path: 'financeiro', Component: FinanceiroPage },
      { path: 'competicoes', Component: CompeticoesPage },
      { path: 'documentacao', Component: DocumentacaoPage },
      { path: 'configuracoes', Component: ConfiguracoesPage },
      ...[
        ['equipe/integrantes', 'Integrantes'], ['equipe/subsistemas', 'Subsistemas'], ['equipe/cargos', 'Cargos e permissões'],
        ['atividades/quadro', 'Quadro de atividades'], ['atividades/backlog', 'Backlog'], ['atividades/sprints', 'Sprints'],
        ['financeiro/solicitacoes', 'Solicitações de compra'], ['financeiro/compras', 'Compras e aprovações'], ['financeiro/movimentacoes', 'Movimentações'],
      ].map(([path, title]) => ({ path, element: <PlaceholderPage title={title} /> })),
    ],
  },
  { path: '/login', Component: LoginPage },
  { path: '/', Component: WelcomePage },
  { path: '*', element: <Navigate to="/" replace /> },
])
