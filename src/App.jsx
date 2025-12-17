import { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { getOverallStats, getBestStudent, getCareerStats } from './utils/analytics';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ExcelUpload from './components/ExcelUpload';
import StatsCard from './components/StatsCard';
import TopStudentsChart from './components/charts/TopStudentsChart';
import CareerScoresChart from './components/charts/CareerScoresChart';
import DistributionChart from './components/charts/DistributionChart';
import ComparisonChart from './components/charts/ComparisonChart';
import PredictionChart from './components/charts/PredictionChart';
import ModeChart from './components/charts/ModeChart';
import BoxPlotChart from './components/charts/BoxPlotChart';
import RankingTable from './components/RankingTable';

function AppContent() {
  const { hasData, getFilteredStudents, clearData } = useData();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMode, setSelectedMode] = useState('Ordinario');

  const students = getFilteredStudents();
  const overallStats = getOverallStats(students);
  const bestStudent = getBestStudent(students);
  const careerStats = getCareerStats(students);
  const totalCareers = Object.keys(careerStats).length;

  const handleExportPDF = () => {
    alert('Funcionalidad de exportar PDF en desarrollo');
    // TODO: Implement PDF export
  };

  const handleReload = () => {
    if (window.confirm('¿Deseas cargar un nuevo archivo? Se perderán los datos actuales.')) {
      clearData();
      window.location.reload();
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex">
      {hasData ? (
        <>
          {/* Sidebar with reload button */}
          <aside className="hidden md:flex flex-col w-72 h-full border-r border-border-dark bg-background-dark">
            <div className="p-6 flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-lg shadow-primary/20"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3sQllOnVjlq9XeQuB7mbbl3VqmmqDj-8hXiXKZHY6a7NEruwA93Sma7VnLN8g0r341oorK2bu7ZuF_1LuALjZGSUC1rmH3bv7tcGlaFZTxzIbvOr2_81utk7QF6IycO2PMz3AXk7iVs_5e5siGZX-F5mIhpnSW86krbUr6qf8G9B0-dYO66-h1ebXHBO8Mz0Hs3IJP5PFndMtBLnJwj22vSbEY-qTptqRP41UxU92nejxba41xC8bFoD3VrqfES3Tu8loLg-DeVs")' }}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-white text-lg font-bold leading-tight tracking-tight">Admisión UNAMBA</h1>
                <p className="text-text-secondary text-xs font-medium">Panel Administrativo</p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
              <a className="flex items-center gap-3 px-4 py-3 rounded-full bg-primary/20 text-primary transition-all duration-200 border border-primary/10" href="#">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                <span className="text-sm font-bold">Dashboard</span>
              </a>

              <a className="flex items-center gap-3 px-4 py-3 rounded-full text-text-secondary hover:bg-card-dark hover:text-white transition-all duration-200" href="#">
                <span className="material-symbols-outlined">bar_chart</span>
                <span className="text-sm font-medium">Reportes</span>
              </a>

              <a className="flex items-center gap-3 px-4 py-3 rounded-full text-text-secondary hover:bg-card-dark hover:text-white transition-all duration-200" href="#">
                <span className="material-symbols-outlined">groups</span>
                <span className="text-sm font-medium">Postulantes</span>
              </a>

              <a className="flex items-center gap-3 px-4 py-3 rounded-full text-text-secondary hover:bg-card-dark hover:text-white transition-all duration-200" href="#">
                <span className="material-symbols-outlined">school</span>
                <span className="text-sm font-medium">Carreras</span>
              </a>

              <div className="my-2 border-t border-border-dark"></div>

              <button
                onClick={handleReload}
                className="flex items-center gap-3 px-4 py-3 rounded-full text-text-secondary hover:bg-card-dark hover:text-white transition-all duration-200 cursor-pointer"
              >
                <span className="material-symbols-outlined">upload_file</span>
                <span className="text-sm font-medium">Cargar Nuevo</span>
              </button>

              <a className="flex items-center gap-3 px-4 py-3 rounded-full text-text-secondary hover:bg-card-dark hover:text-white transition-all duration-200" href="#">
                <span className="material-symbols-outlined">settings</span>
                <span className="text-sm font-medium">Configuración</span>
              </a>
            </nav>

            <div className="p-4">
              <div className="bg-gradient-to-br from-card-dark to-[#020617] rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-sm">bolt</span>
                  </div>
                  <p className="text-white text-sm font-bold">Sistema en Línea</p>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed mb-3">
                  Analizando {students.length} postulantes
                </p>
                <div className="w-full bg-black/20 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            <Header />

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 scroll-smooth">
              <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
                {/* Page Title & Filters */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-white text-3xl md:text-4xl font-extrabold tracking-tight">
                      Resumen General
                    </h1>
                    <p className="text-text-secondary text-base">
                      Visualización de estadísticas y métricas clave del último examen.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="relative group">
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="appearance-none bg-card-dark text-white pl-4 pr-10 py-2.5 rounded-full text-sm font-medium border border-transparent hover:border-primary/30 focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option>Año: 2024</option>
                        <option>Año: 2023</option>
                        <option>Año: 2022</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none text-sm">
                        expand_more
                      </span>
                    </div>
                    <div className="relative group">
                      <select
                        value={selectedMode}
                        onChange={(e) => setSelectedMode(e.target.value)}
                        className="appearance-none bg-card-dark text-white pl-4 pr-10 py-2.5 rounded-full text-sm font-medium border border-transparent hover:border-primary/30 focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option>Modalidad: Ordinario</option>
                        <option>Modalidad: Extraordinario</option>
                        <option>Modalidad: CPU</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none text-sm">
                        expand_more
                      </span>
                    </div>
                    <button
                      onClick={handleExportPDF}
                      className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary-hover transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Exportar PDF
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard
                    title="Total Postulantes"
                    value={overallStats.totalStudents.toLocaleString()}
                    icon="groups"
                    trend={5.2}
                  />
                  <StatsCard
                    title="Total con Puntaje"
                    value={overallStats.studentsWithScores.toLocaleString()}
                    icon="person_check"
                    trend={2.1}
                  />
                  <StatsCard
                    title="Puntaje Promedio"
                    value={overallStats.avgScore.toFixed(2)}
                    subtitle={`Máx: ${overallStats.maxScore.toFixed(2)}`}
                    icon="analytics"
                    trend={0.5}
                  />
                  <StatsCard
                    title="Total Carreras"
                    value={totalCareers}
                    subtitle={`${overallStats.studentsWithScores} con puntaje`}
                    icon="pie_chart"
                  />
                </div>

                {/* Charts Grid - Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ComparisonChart />
                  </div>
                  <div>
                    <DistributionChart bins={10} />
                  </div>
                </div>

                {/* Advanced Analytics - Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PredictionChart cutoffScore={14.0} />
                  <ModeChart />
                </div>

                {/* Box Plot - Full Width */}
                <BoxPlotChart />

                {/* Top Students & Career Scores */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TopStudentsChart count={10} />
                  <CareerScoresChart />
                </div>

                {/* Ranking Table */}
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-white text-xl font-bold">
                        Top 10 Puntajes Generales
                      </h3>
                      <p className="text-text-secondary text-sm">
                        Resultados destacados del proceso de admisión
                      </p>
                    </div>
                    <button className="text-primary text-sm font-bold hover:underline self-start md:self-auto">
                      Ver lista completa
                    </button>
                  </div>
                  <RankingTable />
                </div>
              </div>
            </div>
          </main>
        </>
      ) : (
        /* Upload Screen */
        <div className="flex-1 flex items-center justify-center p-6 bg-background-dark">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                ¡Bienvenido al Dashboard de UNAMBA!
              </h1>
              <p className="text-text-secondary text-lg">
                Carga tu archivo Excel con los resultados de admisión para comenzar el análisis.
              </p>
            </div>

            <ExcelUpload />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              <div className="bg-card-dark rounded-2xl p-6 border border-white/5">
                <div className="text-4xl mb-3">📊</div>
                <h4 className="text-white font-bold mb-2">Gráficos Interactivos</h4>
                <p className="text-text-secondary text-sm">Visualiza datos con gráficos dinámicos</p>
              </div>
              <div className="bg-card-dark rounded-2xl p-6 border border-white/5">
                <div className="text-4xl mb-3">🔮</div>
                <h4 className="text-white font-bold mb-2">Predicciones</h4>
                <p className="text-text-secondary text-sm">Análisis predictivo de aprobación</p>
              </div>
              <div className="bg-card-dark rounded-2xl p-6 border border-white/5">
                <div className="text-4xl mb-3">📈</div>
                <h4 className="text-white font-bold mb-2">Análisis Estadístico</h4>
                <p className="text-text-secondary text-sm">Moda, cuartiles y distribuciones</p>
              </div>
              <div className="bg-card-dark rounded-2xl p-6 border border-white/5">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="text-white font-bold mb-2">Toma de Decisiones</h4>
                <p className="text-text-secondary text-sm">Métricas clave para decisiones informadas</p>
              </div>
            </div>
          </div>
        </div>
      )}
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
