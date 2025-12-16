import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { getRanking } from '../utils/analytics';
import { Search, ChevronUp, ChevronDown, Trophy, Medal } from 'lucide-react';

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
            <div className="rounded-lg border border-gray-200 p-8 shadow-sm bg-white">
                <div className="text-center">
                    <p className="text-sm text-gray-500">📋 No hay datos disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 shadow-sm bg-white">
            <div className="border-b border-gray-200 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Ranking de Estudiantes
                    </h3>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o DNI..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="h-8 w-full rounded-md border border-gray-200 bg-white pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 transition-all"
                            />
                        </div>

                        <select
                            value={selectedCareer}
                            onChange={(e) => {
                                setSelectedCareer(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-8 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-400 transition-all"
                        >
                            <option value="">Todas las Carreras</option>
                            {careers.map(career => (
                                <option key={career} value={career}>{career}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <p className="mt-3 text-xs text-gray-500">Mostrando {paginatedData.length} de {sortedData.length} estudiantes</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-full table-auto text-left text-sm">
                    <thead className="bg-gray-50/50 text-xs font-medium text-gray-500">
                        <tr>
                            <th onClick={() => handleSort('ranking')} className="px-4 py-3 font-medium cursor-pointer hover:text-gray-900 transition-colors">
                                <div className="flex items-center gap-1">
                                    Puesto 
                                    {sortBy === 'ranking' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                                </div>
                            </th>
                            <th onClick={() => handleSort('nombre')} className="px-4 py-3 font-medium cursor-pointer hover:text-gray-900 transition-colors">
                                <div className="flex items-center gap-1">
                                    Nombre
                                    {sortBy === 'nombre' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                                </div>
                            </th>
                            <th onClick={() => handleSort('dni')} className="px-4 py-3 font-medium cursor-pointer hover:text-gray-900 transition-colors">
                                <div className="flex items-center gap-1">
                                    DNI
                                    {sortBy === 'dni' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                                </div>
                            </th>
                            <th onClick={() => handleSort('carrera')} className="px-4 py-3 font-medium cursor-pointer hover:text-gray-900 transition-colors">
                                <div className="flex items-center gap-1">
                                    Carrera
                                    {sortBy === 'carrera' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                                </div>
                            </th>
                            <th onClick={() => handleSort('puntaje')} className="px-4 py-3 font-medium text-right cursor-pointer hover:text-gray-900 transition-colors">
                                <div className="flex items-center justify-end gap-1">
                                    Puntaje
                                    {sortBy === 'puntaje' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {paginatedData.map((student, index) => (
                            <tr key={student.id || index} className={`group hover:bg-gray-50/50 transition-colors ${
                                student.ranking <= 3 ? 'bg-yellow-50/30' : ''
                            }`}>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {student.ranking <= 3 && (
                                            <Medal className={`h-4 w-4 ${
                                                student.ranking === 1 ? 'text-yellow-500' :
                                                student.ranking === 2 ? 'text-gray-400' :
                                                'text-orange-600'
                                            }`} />
                                        )}
                                        <span className="font-medium text-gray-900">#{student.ranking}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-900">
                                        {student.nombre || 'Sin nombre'} {student.apellido || ''}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{student.dni || '-'}</td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-600">
                                        {student.carrera || 'Sin carrera'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                    {student.puntaje?.toFixed(2) || '0.00'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="rounded border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Anterior
                    </button>

                    <div className="flex gap-1">
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
                                    className={`rounded px-3 py-1 text-xs font-medium transition-all ${
                                        currentPage === pageNum
                                            ? 'bg-gray-900 text-white'
                                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="rounded border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default RankingTable;
