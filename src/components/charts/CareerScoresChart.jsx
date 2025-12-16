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
        'rgba(102, 126, 234, 0.8)',
        'rgba(118, 75, 162, 0.8)',
        'rgba(79, 172, 254, 0.8)',
        'rgba(250, 112, 154, 0.8)',
        'rgba(254, 215, 102, 0.8)',
        'rgba(129, 140, 248, 0.8)',
    ];

    const data = {
        labels: careers.map(c => c.length > 25 ? c.substring(0, 25) + '...' : c),
        datasets: [
            {
                label: 'Puntaje Promedio',
                data: careers.map(c => careerStats[c].avg),
                backgroundColor: careers.map((_, i) => colors[i % colors.length]),
                borderColor: careers.map((_, i) => colors[i % colors.length].replace('0.8', '1')),
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
                display: false
            },
            title: {
                display: true,
                text: 'Puntajes Promedio por Carrera',
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
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 12
                    }
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

    if (careers.length === 0) {
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
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default CareerScoresChart;
