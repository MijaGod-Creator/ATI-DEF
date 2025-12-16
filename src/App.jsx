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

function AppContent() {
  const { hasData, getFilteredStudents } = useData();
  const [activeView, setActiveView] = useState('overview');

  const students = getFilteredStudents();
  const overallStats = getOverallStats(students);
  const bestStudent = getBestStudent(students);
  const careerStats = getCareerStats(students);
  const totalCareers = Object.keys(careerStats).length;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="icon">🎓</span>
            UNAMBA Analytics Dashboard
          </h1>
          <p className="app-subtitle">Sistema de Análisis de Resultados de Admisión</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="app-container">
        {!hasData ? (
          /* Upload Section */
          <div className="upload-section">
            <div className="welcome-card glass-card">
              <h2>¡Bienvenido al Dashboard de UNAMBA!</h2>
              <p>
                Carga tu archivo Excel con los resultados de admisión para comenzar el análisis.
                El sistema detectará automáticamente las columnas y te mostrará estadísticas detalladas.
              </p>
              <div className="features-grid">
                <div className="feature">
                  <div className="feature-icon">📊</div>
                  <h4>Gráficos Interactivos</h4>
                  <p>Visualiza datos con gráficos dinámicos</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">🏆</div>
                  <h4>Rankings</h4>
                  <p>Identifica a los mejores estudiantes</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">📈</div>
                  <h4>Análisis Estadístico</h4>
                  <p>Estadísticas completas por carrera</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">🔍</div>
                  <h4>Búsqueda Avanzada</h4>
                  <p>Filtra y busca estudiantes fácilmente</p>
                </div>
              </div>
            </div>
            <ExcelUpload />
          </div>
        ) : (
          /* Dashboard Section */
          <div className="dashboard">
            {/* Sidebar Navigation */}
            <aside className="sidebar glass-card">
              <nav className="sidebar-nav">
                <button
                  className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveView('overview')}
                >
                  <span className="nav-icon">📊</span>
                  <span>Resumen General</span>
                </button>
                <button
                  className={`nav-item ${activeView === 'charts' ? 'active' : ''}`}
                  onClick={() => setActiveView('charts')}
                >
                  <span className="nav-icon">📈</span>
                  <span>Gráficos</span>
                </button>
                <button
                  className={`nav-item ${activeView === 'ranking' ? 'active' : ''}`}
                  onClick={() => setActiveView('ranking')}
                >
                  <span className="nav-icon">🏆</span>
                  <span>Ranking</span>
                </button>
                <button
                  className={`nav-item ${activeView === 'comparison' ? 'active' : ''}`}
                  onClick={() => setActiveView('comparison')}
                >
                  <span className="nav-icon">⚖️</span>
                  <span>Comparación</span>
                </button>
              </nav>

              <div className="sidebar-footer">
                <button className="btn-secondary" onClick={() => window.location.reload()}>
                  📁 Cargar Nuevo Archivo
                </button>
              </div>
            </aside>

            {/* Main Dashboard Content */}
            <main className="dashboard-main">
              {/* Overview View */}
              {activeView === 'overview' && (
                <div className="view-content animate-fadeIn">
                  <h2 className="view-title">📊 Resumen General</h2>

                  {/* Stats Cards */}
                  <div className="stats-grid grid-4">
                    <StatsCard
                      title="Total Estudiantes"
                      value={overallStats.totalStudents.toLocaleString()}
                      icon="👥"
                      gradient="primary"
                    />
                    <StatsCard
                      title="Puntaje Promedio"
                      value={overallStats.avgScore.toFixed(2)}
                      subtitle={`Máx: ${overallStats.maxScore.toFixed(2)}`}
                      icon="📊"
                      gradient="secondary"
                    />
                    <StatsCard
                      title="Mejor Puntaje"
                      value={overallStats.maxScore.toFixed(2)}
                      subtitle={bestStudent ? `${bestStudent.nombre} ${bestStudent.apellido || ''}`.trim() : '-'}
                      icon="🏆"
                      gradient="success"
                    />
                    <StatsCard
                      title="Carreras"
                      value={totalCareers}
                      subtitle={`${overallStats.studentsWithScores} con puntaje`}
                      icon="🎓"
                      gradient="accent"
                    />
                  </div>

                  {/* Quick Charts */}
                  <div className="grid-2 mt-xl">
                    <TopStudentsChart count={10} />
                    <CareerScoresChart />
                  </div>

                  {/* Best Student Highlight */}
                  {bestStudent && (
                    <div className="best-student-card glass-card mt-xl">
                      <h3>🌟 Estudiante Destacado</h3>
                      <div className="best-student-content">
                        <div className="student-info">
                          <h2 className="student-name">
                            {bestStudent.nombre} {bestStudent.apellido || ''}
                          </h2>
                          <p className="student-career">{bestStudent.carrera || 'Sin carrera'}</p>
                          {bestStudent.dni && <p className="student-dni">DNI: {bestStudent.dni}</p>}
                        </div>
                        <div className="student-score">
                          <div className="score-label">Puntaje</div>
                          <div className="score-value">{bestStudent.puntaje.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Charts View */}
              {activeView === 'charts' && (
                <div className="view-content animate-fadeIn">
                  <h2 className="view-title">📈 Análisis con Gráficos</h2>

                  <TopStudentsChart count={15} />
                  <CareerScoresChart />
                  <DistributionChart bins={12} />
                </div>
              )}

              {/* Ranking View */}
              {activeView === 'ranking' && (
                <div className="view-content animate-fadeIn">
                  <h2 className="view-title">🏆 Ranking de Estudiantes</h2>
                  <RankingTable />
                </div>
              )}

              {/* Comparison View */}
              {activeView === 'comparison' && (
                <div className="view-content animate-fadeIn">
                  <h2 className="view-title">⚖️ Comparación de Carreras</h2>
                  <ComparisonChart />

                  <div className="grid-2 mt-xl">
                    <TopStudentsChart count={10} />
                    <DistributionChart bins={10} />
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>UNAMBA Analytics Dashboard © 2025 | Sistema de Análisis de Admisión</p>
      </footer>
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
