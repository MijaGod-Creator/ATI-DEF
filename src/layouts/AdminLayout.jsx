import { Outlet, Link, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  GraduationCap,
  LayoutDashboard,
  BarChart3,
  Trophy,
  GitCompare,
  Upload,
  Minus
} from 'lucide-react';

const AdminLayout = () => {
  const { hasData } = useData();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  if (!hasData) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
        <div className="flex h-14 items-center border-b border-gray-200 px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded bg-blue-700 text-white">
              <img className="h-6" src="/logo-unamba.webp" alt="logounamba" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-gray-900">
              Analizador <br /> de resultados
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <nav className="space-y-1">
            <Link
              to="/admin/resumen"
              className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/admin/resumen')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Resumen General
            </Link>
            <Link
              to="/admin/graficos"
              className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/admin/graficos')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Gráficos
            </Link>
            <Link
              to="/admin/ranking"
              className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/admin/ranking')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Trophy className="h-4 w-4" />
              Ranking
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => window.location.href = '/'}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
          >
            <Upload className="h-3.5 w-3.5" />
            Cargar Nuevo Archivo
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="glass-effect sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 px-6">
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
              <span className="cursor-pointer transition-colors hover:text-gray-900">Inicio</span>
              <span className="text-gray-400">/</span>
              <span className="font-medium text-gray-900">Análisis de Admisión</span>
            </nav>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 mx-auto w-full max-w-7xl">
          <Outlet />

             <footer className="border-t border-gray-200 bg-white px-6 py-3">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            UNAMBA Análisis <Minus className="h-3 w-3" /> Dashboard © 2025 | Sistema de Análisis de Admisión
          </p>
        </footer>
        </main>

     
      </div>
    </div>
  );
};

export default AdminLayout;
