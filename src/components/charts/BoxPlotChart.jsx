import React from 'react';
import { useData } from '../../context/DataContext';
import { calculateQuartiles, getCareerStats } from '../../utils/analytics';

const BoxPlotChart = () => {
    const { getFilteredStudents } = useData();
    const students = getFilteredStudents();
    const careerStats = getCareerStats(students);

    // Get top 6 careers by student count
    const topCareers = Object.entries(careerStats)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 6);

    if (topCareers.length === 0) {
        return (
            <div className="bg-card-dark rounded-3xl p-6 md:p-8 border border-white/5">
                <div className="text-center text-text-secondary py-12">
                    📊 No hay datos disponibles
                </div>
            </div>
        );
    }

    // Calculate quartiles for each career
    const careerBoxData = topCareers.map(([career, stats]) => {
        const careerStudents = stats.estudiantes.filter(s => s.puntaje !== null);
        const quartiles = calculateQuartiles(careerStudents);
        return { career, quartiles, count: stats.count };
    });

    const maxScore = 20; // Assuming score range 0-20

    return (
        <div className="bg-card-dark rounded-3xl p-6 md:p-8 border border-white/5">
            <div className="mb-6">
                <h3 className="text-white text-xl font-bold">Análisis Estadístico (Box Plot)</h3>
                <p className="text-text-secondary text-sm mt-1">
                    Distribución de puntajes por carrera (Q1, Mediana, Q3)
                </p>
            </div>

            <div className="space-y-6">
                {careerBoxData.map(({ career, quartiles, count }, index) => {
                    if (!quartiles) return null;

                    const scale = 100 / maxScore;
                    const positions = {
                        min: quartiles.min * scale,
                        q1: quartiles.q1 * scale,
                        median: quartiles.median * scale,
                        q3: quartiles.q3 * scale,
                        max: quartiles.max * scale
                    };

                    return (
                        <div key={career} className="group">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-40 flex-shrink-0">
                                    <p className="text-white text-sm font-medium truncate">{career}</p>
                                    <p className="text-text-secondary text-xs">{count} estudiantes</p>
                                </div>

                                <div className="flex-1 relative h-12">
                                    {/* Background scale */}
                                    <div className="absolute inset-0 flex">
                                        {[0, 25, 50, 75, 100].map((mark, i) => (
                                            <div key={i} className="flex-1 border-l border-white/5"></div>
                                        ))}
                                    </div>

                                    {/* Min-Max line */}
                                    <div
                                        className="absolute top-1/2 h-0.5 bg-text-secondary/30"
                                        style={{
                                            left: `${positions.min}%`,
                                            width: `${positions.max - positions.min}%`
                                        }}
                                    ></div>

                                    {/* Box (Q1-Q3) */}
                                    <div
                                        className="absolute top-2 h-8 bg-primary/20 border-2 border-primary rounded group-hover:bg-primary/30 transition-all"
                                        style={{
                                            left: `${positions.q1}%`,
                                            width: `${positions.q3 - positions.q1}%`
                                        }}
                                    >
                                        {/* Median line */}
                                        <div
                                            className="absolute top-0 bottom-0 w-0.5 bg-primary"
                                            style={{
                                                left: `${((positions.median - positions.q1) / (positions.q3 - positions.q1)) * 100}%`
                                            }}
                                        ></div>
                                    </div>

                                    {/* Min whisker */}
                                    <div
                                        className="absolute top-3 w-0.5 h-6 bg-text-secondary"
                                        style={{ left: `${positions.min}%` }}
                                    ></div>

                                    {/* Max whisker */}
                                    <div
                                        className="absolute top-3 w-0.5 h-6 bg-text-secondary"
                                        style={{ left: `${positions.max}%` }}
                                    ></div>

                                    {/* Outliers */}
                                    {quartiles.outliers.map((outlier, i) => (
                                        <div
                                            key={i}
                                            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"
                                            style={{ left: `${outlier * scale}%` }}
                                        ></div>
                                    ))}
                                </div>

                                <div className="w-32 flex-shrink-0 text-right">
                                    <p className="text-primary text-sm font-bold">Med: {quartiles.median.toFixed(2)}</p>
                                    <p className="text-text-secondary text-xs">
                                        IQR: {quartiles.iqr.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scale legend */}
            <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex justify-between text-xs text-text-secondary">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                    <span>20</span>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary/20 border-2 border-primary rounded"></div>
                    <span className="text-text-secondary">Rango intercuartílico (Q1-Q3)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-primary"></div>
                    <span className="text-text-secondary">Mediana</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-text-secondary">Outliers</span>
                </div>
            </div>
        </div>
    );
};

export default BoxPlotChart;
