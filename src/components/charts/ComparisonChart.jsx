import React from 'react';
import { useData } from '../../context/DataContext';
import { getCareerStats } from '../../utils/analytics';

const ComparisonChart = () => {
    const { getFilteredStudents } = useData();
    const students = getFilteredStudents();
    const careerStats = getCareerStats(students);

    // Sort careers by count and take top 5
    const topCareers = Object.entries(careerStats)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5);

    const maxCount = Math.max(...topCareers.map(([_, stats]) => stats.count));

    if (topCareers.length === 0) {
        return (
            <div className="bg-card-dark rounded-3xl p-6 md:p-8 border border-white/5">
                <div className="text-center text-text-secondary py-12">
                    📊 No hay datos disponibles
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card-dark rounded-3xl p-6 md:p-8 border border-white/5">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-white text-xl font-bold">Ingresantes por Carrera</h3>
                    <p className="text-text-secondary text-sm mt-1">
                        Comparativa de vacantes cubiertas vs postulantes
                    </p>
                </div>
                <button className="p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            </div>

            <div className="flex flex-col gap-5">
                {topCareers.map(([career, stats], index) => {
                    const percentage = (stats.count / maxCount) * 100;
                    const opacity = 100 - (index * 10);

                    return (
                        <div key={career} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group">
                            <div className="w-full sm:w-48 text-sm font-medium text-white truncate">
                                {career}
                            </div>
                            <div className="flex-1 h-3 bg-black/20 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-primary rounded-full relative group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500`}
                                    style={{ width: `${percentage}%`, opacity: `${opacity}%` }}
                                ></div>
                            </div>
                            <div className="w-12 text-right text-sm font-bold text-white">
                                {stats.count}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ComparisonChart;
