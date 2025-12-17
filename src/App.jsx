import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import ResumenPage from './pages/ResumenPage';
import GraficosPage from './pages/GraficosPage';
import RankingPage from './pages/RankingPage';
import ComparacionPage from './pages/ComparacionPage';

function ProtectedRoute({ children }) {
  const { hasData } = useData();
  
  if (!hasData) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AppContent() {
  const { hasData } = useData();

  return (
    <Routes>
      <Route path="/" element={hasData ? <Navigate to="/admin/resumen" replace /> : <HomePage />} />
      
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/resumen" replace />} />
        <Route path="resumen" element={<ResumenPage />} />
        <Route path="graficos" element={<GraficosPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="comparacion" element={<ComparacionPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </Router>
  );
}

export default App;


