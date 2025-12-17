import ComparisonChart from '../components/charts/ComparisonChart';
import TopStudentsChart from '../components/charts/TopStudentsChart';
import DistributionChart from '../components/charts/DistributionChart';

const ComparacionPage = () => {
  return (
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
  );
};

export default ComparacionPage;
