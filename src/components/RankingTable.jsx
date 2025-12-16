import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { getRanking } from '../utils/analytics';
import './RankingTable.css';

const RankingTable = () => {
    const { getFilteredStudents, getUniqueValues } = useData();
    const [sortBy, setSortBy] = useState('ranking');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCareer, setSelectedCareer] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const students = getFilteredStudents();
    const careers = getUniqueValues('carrera');

    // Apply search and career filter
    const filteredStudents = useMemo(() => {
        let filtered = [...students];

        if (selectedCareer) {
            filtered = filtered.filter(s => s.carrera === selectedCareer);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s => {
                const nombre = (s.nombre || '').toLowerCase();
                const apellido = (s.apellido || '').toLowerCase();
                const dni = (s.dni || '').toString().toLowerCase();
                return nombre.includes(query) || apellido.includes(query) || dni.includes(query);
            });
        }

        return filtered;
    }, [students, selectedCareer, searchQuery]);

    // Get ranking
    const ranking = getRanking(filteredStudents, selectedCareer || null);

    // Sort
    const sortedData = useMemo(() => {
        const sorted = [...ranking];

        sorted.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            // Handle strings
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = (bVal || '').toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return sorted;
    }, [ranking, sortBy, sortOrder]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages));
    };

    if (students.length === 0) {
        return (
            <div className="ranking-table glass-card">
                <div className="no-data">
                    <p>📋 No hay datos disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ranking-table glass-card">
            <div className="table-header">
                <h3>🏆 Ranking de Estudiantes</h3>

                <div className="table-controls">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o DNI..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="search-input"
                    />

                    <select
                        value={selectedCareer}
                        onChange={(e) => {
                            setSelectedCareer(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="career-filter"
                    >
                        <option value="">Todas las Carreras</option>
                        {careers.map(career => (
                            <option key={career} value={career}>{career}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="table-info">
                <p>Mostrando {paginatedData.length} de {sortedData.length} estudiantes</p>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('ranking')} className="sortable">
                                Puesto {sortBy === 'ranking' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('nombre')} className="sortable">
                                Nombre {sortBy === 'nombre' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('dni')} className="sortable">
                                DNI {sortBy === 'dni' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('carrera')} className="sortable">
                                Carrera {sortBy === 'carrera' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('puntaje')} className="sortable">
                                Puntaje {sortBy === 'puntaje' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((student, index) => (
                            <tr key={student.id || index} className={student.ranking <= 3 ? 'top-rank' : ''}>
                                <td className="rank-cell">
                                    <div className="rank-badge">
                                        {student.ranking <= 3 && <span className="medal">🏅</span>}
                                        #{student.ranking}
                                    </div>
                                </td>
                                <td className="name-cell">
                                    {student.nombre || 'Sin nombre'} {student.apellido || ''}
                                </td>
                                <td>{student.dni || '-'}</td>
                                <td className="career-cell">
                                    <span className="career-tag">{student.carrera || 'Sin carrera'}</span>
                                </td>
                                <td className="score-cell">
                                    <strong>{student.puntaje?.toFixed(2) || '0.00'}</strong>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn-secondary"
                    >
                        ← Anterior
                    </button>

                    <div className="page-numbers">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={currentPage === pageNum ? 'active' : ''}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn-secondary"
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
};

export default RankingTable;
