import { createHashRouter, Navigate } from 'react-router-dom'
import { Shell } from './Shell'

import DashboardPage from '../pages/DashboardPage'
import EquipePage from '../pages/EquipePage'
import AtividadesPage from '../pages/AtividadesPage'
import FinanceiroPage from '../pages/FinanceiroPage'
import CompeticoesPage from '../pages/CompeticoesPage'
import DocumentacaoPage from '../pages/DocumentacaoPage'
import ConfiguracoesPage from '../pages/ConfiguracoesPage'

export const router = createHashRouter([
  {
    path: '/app',
    Component: Shell,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'equipe', Component: EquipePage },
      { path: 'atividades', Component: AtividadesPage },
      { path: 'financeiro', Component: FinanceiroPage },
      { path: 'competicoes', Component: CompeticoesPage },
      { path: 'documentacao', Component: DocumentacaoPage },
      { path: 'configuracoes', Component: ConfiguracoesPage },
    ],
  },
  { path: '/', element: <Navigate to="/app/dashboard" replace /> },
])
