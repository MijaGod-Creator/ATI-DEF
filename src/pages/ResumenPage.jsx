import { useData } from '../context/DataContext';
import { getOverallStats, getBestStudent, getCareerStats } from '../utils/analytics';
import StatsCard from '../components/StatsCard';
import TopStudentsChart from '../components/charts/TopStudentsChart';
import CareerScoresChart from '../components/charts/CareerScoresChart';
import { Trophy } from 'lucide-react';

const ResumenPage = () => {
  const { getFilteredStudents } = useData();
  const students = getFilteredStudents();
  const overallStats = getOverallStats(students);
  const bestStudent = getBestStudent(students);
  const careerStats = getCareerStats(students);
  const totalCareers = Object.keys(careerStats).length;

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Resumen General</h1>
        <p className="mt-1 text-base text-gray-500">Visión general de resultados y estadísticas de admisión.</p>
      </div>

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

      <div className="grid gap-8 lg:grid-cols-2 mb-8">
        <TopStudentsChart count={10} />
        <CareerScoresChart />
      </div>

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
  );
};

export default ResumenPage;
