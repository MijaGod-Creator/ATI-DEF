import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useData } from '../../context/DataContext';
import { getCareerStats } from '../../utils/analytics';

ChartJS.register(ArcElement, Tooltip, Legend);

const DistributionChart = () => {
    const { getFilteredStudents } = useData();
    const students = getFilteredStudents();
    const careerStats = getCareerStats(students);

    // Group by academic area (simplified categorization)
    const areas = {
        'Ingenierías': 0,
        'Sociales': 0,
        'Biomédicas': 0,
    };

    Object.entries(careerStats).forEach(([career, stats]) => {
        const careerLower = career.toLowerCase();
        if (careerLower.includes('ingen') || careerLower.includes('minas') || careerLower.includes('agroindustrial')) {
            areas['Ingenierías'] += stats.count;
        } else if (careerLower.includes('admin') || careerLower.includes('educaci') || careerLower.includes('social')) {
            areas['Sociales'] += stats.count;
        } else {
            areas['Biomédicas'] += stats.count;
        }
    });

    const totalStudents = Object.values(areas).reduce((a, b) => a + b, 0);
    const areaData = Object.entries(areas).filter(([_, count]) => count > 0);

    const data = {
        labels: areaData.map(([name]) => name),
        datasets: [
            {
                data: areaData.map(([_, count]) => count),
                backgroundColor: ['#1d4ed8', '#3b82f6', '#93c5fd'],
                borderColor: '#1e293b',
                borderWidth: 3,
                hoverOffset: 8,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#f9fafb',
                bodyColor: '#d1d5db',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (context) => {
                        const value = context.parsed;
                        const percentage = ((value / totalStudents) * 100).toFixed(1);
                        return `${context.label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        cutout: '70%',
    };

    if (areaData.length === 0) {
        return (
            <div className="bg-card-dark rounded-3xl p-6 md:p-8 border border-white/5 flex flex-col">
                <div className="text-center text-text-secondary py-12">
                    📊 No hay datos disponibles
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card-dark rounded-3xl p-6 md:p-8 border border-white/5 flex flex-col">
            <h3 className="text-white text-xl font-bold mb-1">Distribución por Área</h3>
            <p className="text-text-secondary text-sm mb-6">Puntajes mayores a 14.0</p>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="relative size-56">
                    <Doughnut data={data} options={options} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{totalStudents}</span>
                        <span className="text-xs text-text-secondary font-medium uppercase">Estudiantes</span>
                    </div>
                </div>

                <div className="w-full mt-8 flex flex-col gap-2">
                    {areaData.map(([name, count], index) => {
                        const percentage = ((count / totalStudents) * 100).toFixed(0);
                        const colors = ['#1d4ed8', '#3b82f6', '#93c5fd'];

                        return (
                            <div key={name} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="size-3 rounded-full" style={{ backgroundColor: colors[index] }}></div>
                                    <span className="text-white">{name}</span>
                                </div>
                                <span className="font-bold text-white">{percentage}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DistributionChart;
