import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useData } from '../../context/DataContext';
import { predictSuccessRate } from '../../utils/analytics';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PredictionChart = ({ cutoffScore = 14.0 }) => {
    const { getFilteredStudents } = useData();
    const students = getFilteredStudents();
    const predictions = predictSuccessRate(students, cutoffScore);

    if (!predictions) {
        return (
            <div className="bg-card-dark rounded-3xl p-6 md:p-8 border border-white/5">
                <div className="text-center text-text-secondary py-12">
                    📈 No hay datos disponibles
                </div>
            </div>
        );
    }

    // Top 8 careers by success rate
    const topCareers = predictions.byCareer.slice(0, 8);

    const data = {
        labels: topCareers.map(c => c.career.length > 20 ? c.career.substring(0, 20) + '...' : c.career),
        datasets: [
            {
                label: 'Tasa de Aprobación (%)',
                data: topCareers.map(c => c.successRate),
                backgroundColor: topCareers.map((c, i) => {
                    const opacity = 0.9 - (i * 0.1);
                    return `rgba(59, 130, 246, ${opacity})`;
                }),
                borderColor: '#3b82f6',
                borderWidth: 2,
                borderRadius: 8,
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
                        const career = topCareers[context.dataIndex];
                        return [
                            `Tasa: ${career.successRate.toFixed(1)}%`,
                            `Aprobados: ${career.passing}/${career.total}`,
                            `Puntaje promedio: ${career.avgScore.toFixed(2)}`
                        ];
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#9ca3af',
                    font: { size: 12 },
                    callback: (value) => value + '%'
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: '#9ca3af',
                    font: { size: 11 },
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };

    return (
        <div className="bg-card-dark rounded-3xl p-6 md:p-8 border border-white/5">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-white text-xl font-bold">Predicción de Aprobación</h3>
                    <p className="text-text-secondary text-sm mt-1">
                        Tasa de aprobación por carrera (puntaje ≥ {cutoffScore})
                    </p>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-full">
                    <p className="text-sm font-bold">{predictions.overall.successRate.toFixed(1)}% general</p>
                </div>
            </div>

            <div className="h-80">
                <Bar data={data} options={options} />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                <div className="text-center">
                    <p className="text-text-secondary text-xs mb-1">Aprobados</p>
                    <p className="text-emerald-400 text-2xl font-bold">{predictions.overall.passing}</p>
                </div>
                <div className="text-center">
                    <p className="text-text-secondary text-xs mb-1">Reprobados</p>
                    <p className="text-red-400 text-2xl font-bold">{predictions.overall.failing}</p>
                </div>
                <div className="text-center">
                    <p className="text-text-secondary text-xs mb-1">Total</p>
                    <p className="text-white text-2xl font-bold">{predictions.overall.total}</p>
                </div>
            </div>
        </div>
    );
};

export default PredictionChart;
