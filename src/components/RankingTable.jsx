import React from 'react';
import { useData } from '../context/DataContext';
import { getRanking } from '../utils/analytics';

const RankingTable = () => {
    const { getFilteredStudents } = useData();
    const students = getFilteredStudents();
    const ranking = getRanking(students, null).slice(0, 10); // Top 10

    const getMedalBg = (position) => {
        if (position === 1) return 'bg-[#ffd700]/20 text-[#ffd700]'; // Gold
        if (position === 2) return 'bg-[#c0c0c0]/20 text-[#c0c0c0]'; // Silver
        if (position === 3) return 'bg-[#cd7f32]/20 text-[#cd7f32]'; // Bronze
        return 'bg-white/5 text-white/50';
    };

    if (ranking.length === 0) {
        return (
            <div className="overflow-x-auto rounded-3xl border border-white/5">
                <div className="text-center text-text-secondary py-12 bg-card-dark">
                    📋 No hay datos disponibles
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-3xl border border-white/5">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white/5 text-text-secondary text-sm">
                        <th className="p-4 font-medium pl-6">Puesto</th>
                        <th className="p-4 font-medium">Código</th>
                        <th className="p-4 font-medium">Carrera</th>
                        <th className="p-4 font-medium">Sede</th>
                        <th className="p-4 font-medium text-right pr-6">Puntaje</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-card-dark text-white text-sm">
                    {ranking.map((student, index) => (
                        <tr key={student.id || index} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4 pl-6">
                                <div className={`size-8 rounded-full flex items-center justify-center font-bold ${getMedalBg(student.ranking)}`}>
                                    {student.ranking}
                                </div>
                            </td>
                            <td className="p-4 font-mono text-white/80">
                                {student.dni || `2024-${10000 + index}`}
                            </td>
                            <td className="p-4 font-medium">
                                {student.carrera || 'Sin carrera'}
                            </td>
                            <td className="p-4 text-white/70">
                                Abancay
                            </td>
                            <td className={`p-4 text-right font-bold pr-6 ${student.ranking <= 3 ? 'text-primary' : 'text-white'}`}>
                                {student.puntaje?.toFixed(3) || '0.000'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RankingTable;
