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
import ConfiguracoesPage from '../pages/ConfiguracoesPage'

// Routes:
//   /          → Welcome (AFK default, logo + blank wallpaper)
//   /login     → Login form (only reachable via welcome click/keypress)
//   /app/*     → Authenticated shell. Gestores land on /app/gestao after login.
export const router = createHashRouter([
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <Shell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/app/gestao" replace /> },
      { path: 'gestao', Component: GestaoPage },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'equipe', Component: EquipePage },
      { path: 'atividades', Component: AtividadesPage },
      { path: 'financeiro', Component: FinanceiroPage },
      { path: 'competicoes', Component: CompeticoesPage },
      { path: 'documentacao', Component: DocumentacaoPage },
      { path: 'configuracoes', Component: ConfiguracoesPage },
    ],
  },
  { path: '/login', Component: LoginPage },
  { path: '/', Component: WelcomePage },
  { path: '*', element: <Navigate to="/" replace /> },
])
