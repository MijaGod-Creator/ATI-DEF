import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useData } from '../../context/DataContext';
import { getCareerStats } from '../../utils/analytics';
import './ChartStyles.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CareerScoresChart = () => {
    const { getFilteredStudents } = useData();
    const students = getFilteredStudents();
    const careerStats = getCareerStats(students);

    const careers = Object.keys(careerStats).sort((a, b) =>
        careerStats[b].avg - careerStats[a].avg
    );

    const colors = [
        '#111827',
        '#374151',
        '#4b5563',
        '#6b7280',
        '#9ca3af',
        '#d1d5db',
    ];

    const data = {
        labels: careers.map(c => c.length > 25 ? c.substring(0, 25) + '...' : c),
        datasets: [
            {
                label: 'Puntaje Promedio',
                data: careers.map(c => careerStats[c].avg),
                backgroundColor: careers.map((_, i) => colors[i % colors.length]),
                borderColor: '#e5e7eb',
                borderWidth: 1,
                borderRadius: 6,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#111827',
                bodyColor: '#6b7280',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 6,
                callbacks: {
                    title: (items) => {
                        const careerName = careers[items[0].dataIndex];
                        return careerName;
                    },
                    label: (context) => {
                        const careerName = careers[context.dataIndex];
                        const stats = careerStats[careerName];
                        return [
                            `Promedio: ${stats.avg.toFixed(2)}`,
                            `Máximo: ${stats.max.toFixed(2)}`,
                            `Mínimo: ${stats.min.toFixed(2)}`,
                            `Estudiantes: ${stats.count}`
                        ];
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f3f4f6',
                    drawBorder: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 11
                    },
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };

    if (careers.length === 0) {
        return (
            <div className="chart-container">
                <div className="chart-header">
                    <h3 className="chart-title">Puntajes por Carrera</h3>
                </div>
                <div className="p-8 text-center">
                    <p className="text-sm text-gray-500">No hay datos disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h3 className="chart-title">Puntajes Promedio por Carrera</h3>
                <p className="chart-subtitle">Comparación de promedios entre carreras</p>
            </div>
            <div className="h-[400px]">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default CareerScoresChart;
