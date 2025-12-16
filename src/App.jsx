import { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { getOverallStats, getBestStudent, getCareerStats } from './utils/analytics';
import ExcelUpload from './components/ExcelUpload';
import StatsCard from './components/StatsCard';
import TopStudentsChart from './components/charts/TopStudentsChart';
import CareerScoresChart from './components/charts/CareerScoresChart';
import DistributionChart from './components/charts/DistributionChart';
import ComparisonChart from './components/charts/ComparisonChart';
import RankingTable from './components/RankingTable';
import './App.css';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BarChart3, 
  Trophy, 
  GitCompare, 
  Upload,
  Minus
} from 'lucide-react';
function AppContent() {
  const { hasData, getFilteredStudents } = useData();
  const [activeView, setActiveView] = useState('overview');

  const students = getFilteredStudents();
  const overallStats = getOverallStats(students);
  const bestStudent = getBestStudent(students);
  const careerStats = getCareerStats(students);
  const totalCareers = Object.keys(careerStats).length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Only show when data is loaded */}
      {hasData && (
        <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
          <div className="flex h-14 items-center border-b border-gray-200 px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-900 text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-gray-900">UNAMBA</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveView('overview')}
                className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeView === 'overview'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Resumen General
              </button>
              <button
                onClick={() => setActiveView('charts')}
                className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeView === 'charts'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Gráficos
              </button>
              <button
                onClick={() => setActiveView('ranking')}
                className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeView === 'ranking'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Trophy className="h-4 w-4" />
                Ranking
              </button>
              <button
                onClick={() => setActiveView('comparison')}
                className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeView === 'comparison'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <GitCompare className="h-4 w-4" />
                Comparación
              </button>
            </nav>
          </div>

          <div className="border-t border-gray-200 p-4">
            <button
              onClick={() => window.location.reload()}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
            >
              <Upload className="h-3.5 w-3.5" />
              Cargar Nuevo Archivo
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="glass-effect sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 px-6">
          <div className="flex items-center gap-4">
            {!hasData && (
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-900 text-white">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold tracking-tight text-gray-900">UNAMBA análisis</span>
              </div>
            )}
            {hasData && (
              <nav className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
                <span className="cursor-pointer transition-colors hover:text-gray-900">Inicio</span>
                <span className="text-gray-400">/</span>
                <span className="font-medium text-gray-900">Análisis de Admisión</span>
              </nav>
            )}
          </div>
        </header>

        {/* Content Scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 mx-auto w-full max-w-7xl">
          {!hasData ? (
            /* Upload Section */
            <div className="mx-auto max-w-4xl">
              <div className="mb-8">
                <h1 className="text-xl font-semibold tracking-tight text-gray-900">¡Bienvenido al Dashboard de UNAMBA!</h1>
                <p className="mt-1 text-base text-gray-500">
                  Carga tu archivo Excel con los resultados de admisión para comenzar el análisis.
                </p>
              </div>

              <ExcelUpload />

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-200 p-5 shadow-sm bg-white">
                  <div className="mb-2 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-center text-sm font-medium text-gray-900">Gráficos Interactivos</h4>
                  <p className="text-center text-xs text-gray-500 mt-1">Visualiza datos con gráficos dinámicos</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-5 shadow-sm bg-white">
                  <div className="mb-2 flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-center text-sm font-medium text-gray-900">Rankings</h4>
                  <p className="text-center text-xs text-gray-500 mt-1">Identifica a los mejores estudiantes</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-5 shadow-sm bg-white">
                  <div className="mb-2 flex items-center justify-center">
                    <LayoutDashboard className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-center text-sm font-medium text-gray-900">Análisis Estadístico</h4>
                  <p className="text-center text-xs text-gray-500 mt-1">Estadísticas completas por carrera</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-5 shadow-sm bg-white">
                  <div className="mb-2 flex items-center justify-center">
                    <GitCompare className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-center text-sm font-medium text-gray-900">Comparación</h4>
                  <p className="text-center text-xs text-gray-500 mt-1">Compara carreras fácilmente</p>
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard Views */
            <div>
              {/* Overview View */}
              {activeView === 'overview' && (
                <div className="animate-fadeIn">
                  <div className="mb-8">
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">Resumen General</h1>
                    <p className="mt-1 text-base text-gray-500">Visión general de resultados y estadísticas de admisión.</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                      title="Total Estudiantes"
                      value={overallStats.totalStudents.toLocaleString()}
                      icon="users"
                    />
                    <StatsCard
                      title="Puntaje Promedio"
                      value={overallStats.avgScore.toFixed(2)}
                      subtitle={`Máx: ${overallStats.maxScore.toFixed(2)}`}
                      icon="chart"
                    />
                    <StatsCard
                      title="Mejor Puntaje"
                      value={overallStats.maxScore.toFixed(2)}
                      subtitle={bestStudent ? `${bestStudent.nombre} ${bestStudent.apellido || ''}`.trim() : '-'}
                      icon="trophy"
                    />
                    <StatsCard
                      title="Carreras"
                      value={totalCareers}
                      subtitle={`${overallStats.studentsWithScores} con puntaje`}
                      icon="graduation"
                    />
                  </div>

                  {/* Quick Charts */}
                  <div className="grid gap-8 lg:grid-cols-2 mb-8">
                    <TopStudentsChart count={10} />
                    <CareerScoresChart />
                  </div>

                  {/* Best Student Highlight */}
                  {bestStudent && (
                    <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-gradient-to-br from-gray-50 to-white">
                      <h3 className="mb-4 text-base font-semibold text-gray-900 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Estudiante Destacado
                      </h3>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">
                            {bestStudent.nombre} {bestStudent.apellido || ''}
                          </h2>
                          <p className="text-base text-gray-600 mt-1">{bestStudent.carrera || 'Sin carrera'}</p>
                          {bestStudent.dni && <p className="text-sm text-gray-500 mt-1">DNI: {bestStudent.dni}</p>}
                        </div>
                        <div className="text-center rounded-lg border border-gray-200 bg-white px-6 py-4">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Puntaje</div>
                          <div className="text-3xl font-bold text-gray-900">{bestStudent.puntaje.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Charts View */}
              {activeView === 'charts' && (
                <div className="animate-fadeIn">
                  <div className="mb-8">
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">Análisis con Gráficos</h1>
                    <p className="mt-1 text-base text-gray-500">Visualizaciones detalladas de los datos de admisión.</p>
                  </div>

                  <div className="space-y-8">
                    <TopStudentsChart count={15} />
                    <CareerScoresChart />
                    <DistributionChart bins={12} />
                  </div>
                </div>
              )}

              {/* Ranking View */}
              {activeView === 'ranking' && (
                <div className="animate-fadeIn">
                  <div className="mb-8">
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">Ranking de Estudiantes</h1>
                    <p className="mt-1 text-base text-gray-500">Clasificación completa de estudiantes por puntaje.</p>
                  </div>
                  <RankingTable />
                </div>
              )}

              {/* Comparison View */}
              {activeView === 'comparison' && (
                <div className="animate-fadeIn">
                  <div className="mb-8">
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">Comparación de Carreras</h1>
                    <p className="mt-1 text-base text-gray-500">Análisis comparativo entre diferentes carreras.</p>
                  </div>

                  <ComparisonChart />

                  <div className="mt-8 grid gap-8 lg:grid-cols-2">
                    <TopStudentsChart count={10} />
                    <DistributionChart bins={10} />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-6 py-3">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            UNAMBA Análisis <Minus className="h-3 w-3" /> Dashboard © 2025 | Sistema de Análisis de Admisión
          </p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
