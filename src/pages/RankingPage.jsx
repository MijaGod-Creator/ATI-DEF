import RankingTable from '../components/RankingTable';

const RankingPage = () => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Ranking de Estudiantes</h1>
        <p className="mt-1 text-base text-gray-500">Clasificación completa de estudiantes por puntaje.</p>
      </div>
      <RankingTable />
    </div>
  );
};

export default RankingPage;
