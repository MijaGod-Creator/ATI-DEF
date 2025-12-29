import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { useData } from '../../context/DataContext';
import { getScoreDistribution } from '../../utils/analytics';
import './ChartStyles.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DistributionChart = ({ bins = 10 }) => {
    const { getFilteredStudents } = useData();
    const students = getFilteredStudents();
    const distribution = getScoreDistribution(students, bins);

    const data = {
        labels: distribution.map(d => d.range),
        datasets: [
            {
                label: 'Cantidad de Estudiantes',
                data: distribution.map(d => d.count),
                fill: true,
                backgroundColor: (context) => {
                    const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(17, 24, 39, 0.2)');
                    gradient.addColorStop(1, 'rgba(17, 24, 39, 0.01)');
                    return gradient;
                },
                borderColor: '#111827',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: '#111827',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
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
                    label: (context) => {
                        const dist = distribution[context.dataIndex];
                        return [
                            `Estudiantes: ${dist.count}`,
                            `Porcentaje: ${dist.percentage}%`
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
                    },
                    precision: 0
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

    if (distribution.length === 0) {
        return (
            <div className="chart-container">
                <div className="chart-header">
                    <h3 className="chart-title">Distribución de Puntajes</h3>
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
                <h3 className="chart-title">Distribución de Puntajes</h3>
                <p className="chart-subtitle">Frecuencia de estudiantes por rango de puntaje</p>
            </div>
            <div className="h-100">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default DistributionChart;
