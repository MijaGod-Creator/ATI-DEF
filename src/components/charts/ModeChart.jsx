import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useData } from '../../context/DataContext';
import { calculateMode } from '../../utils/analytics';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ModeChart = () => {
    const { getFilteredStudents } = useData();
    const students = getFilteredStudents();
    const modeData = calculateMode(students);

    if (!modeData) {
        return (
            <div className="bg-card-dark rounded-3xl p-6 md:p-8 border border-white/5">
                <div className="text-center text-text-secondary py-12">
                    📊 No hay datos disponibles
                </div>
            </div>
        );
    }

    // Get distribution sorted by score
    const sortedScores = Object.keys(modeData.distribution)
        .map(Number)
        .sort((a, b) => a - b);

    const data = {
        labels: sortedScores,
        datasets: [
            {
                label: 'Frecuencia',
                data: sortedScores.map(score => modeData.distribution[score]),
                backgroundColor: sortedScores.map(score =>
                    modeData.modes.includes(score)
                        ? 'rgba(59, 130, 246, 0.8)'
                        : 'rgba(148, 163, 184, 0.5)'
                ),
                borderColor: sortedScores.map(score =>
                    modeData.modes.includes(score)
                        ? '#3b82f6'
                        : '#94a3b8'
                ),
                borderWidth: 2,
                borderRadius: 6,
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
                    title: (context) => `Puntaje: ${context[0].label}`,
                    label: (context) => {
                        const isMode = modeData.modes.includes(Number(context.label));
                        return [
                            `Frecuencia: ${context.parsed.y} estudiantes`,
                            isMode ? '⭐ Moda (más frecuente)' : ''
                        ].filter(Boolean);
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#9ca3af',
                    font: { size: 12 },
                    precision: 0
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: '#9ca3af',
                    font: { size: 11 }
                }
            }
        }
    };

    return (
        <div className="bg-card-dark rounded-3xl p-6 md:p-8 border border-white/5">
            <div className="mb-6">
                <h3 className="text-white text-xl font-bold">Distribución de Frecuencias (Moda)</h3>
                <p className="text-text-secondary text-sm mt-1">
                    Puntajes más frecuentes en los resultados
                </p>
            </div>

            <div className="h-80">
                <Bar data={data} options={options} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                <div className="bg-primary/10 rounded-xl p-4">
                    <p className="text-text-secondary text-xs mb-1">Puntaje(s) Moda</p>
                    <p className="text-primary text-2xl font-bold">
                        {modeData.modes.join(', ')}
                    </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-text-secondary text-xs mb-1">Frecuencia</p>
                    <p className="text-white text-2xl font-bold">
                        {modeData.frequency} estudiantes
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ModeChart;
