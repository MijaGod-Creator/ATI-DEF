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
                    const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(79, 172, 254, 0.3)');
                    gradient.addColorStop(1, 'rgba(79, 172, 254, 0.01)');
                    return gradient;
                },
                borderColor: 'rgba(79, 172, 254, 1)',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: 'rgba(79, 172, 254, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
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
                display: true,
                text: 'Distribución de Puntajes',
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
                borderColor: 'rgba(79, 172, 254, 0.5)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
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
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 12
                    },
                    precision: 0
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#9ca3af',
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
            <div className="chart-container glass-card">
                <div className="no-data">
                    <p>📊 No hay datos disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chart-container glass-card">
            <div className="chart-wrapper">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default DistributionChart;
