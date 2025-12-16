import TopStudentsChart from '../components/charts/TopStudentsChart';
import CareerScoresChart from '../components/charts/CareerScoresChart';
import DistributionChart from '../components/charts/DistributionChart';

const GraficosPage = () => {
  return (
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
  );
};

export default GraficosPage;
