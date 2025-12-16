import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { getCareerStats } from '../../utils/analytics';
import './ChartStyles.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const ComparisonChart = () => {
    const { getFilteredStudents, getUniqueValues } = useData();
    const students = getFilteredStudents();
    const careerStats = getCareerStats(students);
    const allCareers = getUniqueValues('carrera');

    const [selectedCareers, setSelectedCareers] = useState(
        allCareers.slice(0, Math.min(3, allCareers.length))
    );

    const handleCareerToggle = (career) => {
        if (selectedCareers.includes(career)) {
            setSelectedCareers(selectedCareers.filter(c => c !== career));
        } else {
            if (selectedCareers.length < 5) {
                setSelectedCareers([...selectedCareers, career]);
            }
        }
    };

    const metrics = ['Promedio', 'Puntaje Máximo', 'Total Estudiantes'];

    const colors = [
        { bg: 'rgba(102, 126, 234, 0.2)', border: 'rgba(102, 126, 234, 1)' },
        { bg: 'rgba(118, 75, 162, 0.2)', border: 'rgba(118, 75, 162, 1)' },
        { bg: 'rgba(79, 172, 254, 0.2)', border: 'rgba(79, 172, 254, 1)' },
        { bg: 'rgba(250, 112, 154, 0.2)', border: 'rgba(250, 112, 154, 1)' },
        { bg: 'rgba(254, 215, 102, 0.2)', border: 'rgba(254, 215, 102, 1)' },
    ];

    // Normalize data for radar chart (0-100 scale)
    const maxStudents = Math.max(...Object.values(careerStats).map(s => s.count));
    const maxScore = Math.max(...Object.values(careerStats).map(s => s.max));

    const data = {
        labels: metrics,
        datasets: selectedCareers.map((career, index) => {
            const stats = careerStats[career];
            if (!stats) return null;

            return {
                label: career.length > 25 ? career.substring(0, 25) + '...' : career,
                data: [
                    (stats.avg / maxScore) * 100,
                    (stats.max / maxScore) * 100,
                    (stats.count / maxStudents) * 100
                ],
                backgroundColor: colors[index % colors.length].bg,
                borderColor: colors[index % colors.length].border,
                borderWidth: 2,
                pointBackgroundColor: colors[index % colors.length].border,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: colors[index % colors.length].border,
            };
        }).filter(Boolean)
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#d1d5db',
                    font: {
                        size: 12
                    },
                    padding: 15,
                    usePointStyle: true
                }
            },
            title: {
                display: true,
                text: 'Comparación de Carreras',
                color: '#f9fafb',
                font: {
                    size: 18,
                    weight: 'bold'
                },
                padding: 20
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#f9fafb',
                bodyColor: '#d1d5db',
                borderColor: 'rgba(102, 126, 234, 0.5)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (context) => {
                        const career = selectedCareers[context.datasetIndex];
                        const stats = careerStats[career];
                        const metricIndex = context.dataIndex;

                        if (metricIndex === 0) return `Promedio: ${stats.avg.toFixed(2)}`;
                        if (metricIndex === 1) return `Máximo: ${stats.max.toFixed(2)}`;
                        if (metricIndex === 2) return `Estudiantes: ${stats.count}`;
                    }
                }
            }
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(255, 255, 255, 0.08)'
                },
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.08)'
                },
                pointLabels: {
                    color: '#d1d5db',
                    font: {
                        size: 13,
                        weight: 'bold'
                    }
                },
                ticks: {
                    color: '#9ca3af',
                    backdropColor: 'transparent',
                    font: {
                        size: 10
                    }
                }
            }
        }
    };

    if (allCareers.length === 0) {
        return (
            <div className="chart-container glass-card">
                <div className="no-data">
                    <p>📊 No hay datos disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chart-container glass-card">
            <div className="career-selector mb-lg">
                <h4>Selecciona carreras para comparar (máx. 5):</h4>
                <div className="career-chips">
                    {allCareers.map(career => (
                        <button
                            key={career}
                            className={`career-chip ${selectedCareers.includes(career) ? 'active' : ''}`}
                            onClick={() => handleCareerToggle(career)}
                        >
                            {career}
                        </button>
                    ))}
                </div>
            </div>

            {selectedCareers.length > 0 ? (
                <div className="chart-wrapper">
                    <Radar data={data} options={options} />
                </div>
            ) : (
                <div className="no-data">
                    <p>Selecciona al menos una carrera para comparar</p>
                </div>
            )}
        </div>
    );
};

export default ComparisonChart;
