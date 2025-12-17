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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CareerScoresChart = () => {
    const { getFilteredStudents } = useData();
    const students = getFilteredStudents();
    const careerStats = getCareerStats(students);

    // Get top 8 careers by average score
    const topCareers = Object.entries(careerStats)
        .sort((a, b) => b[1].avg - a[1].avg)
        .slice(0, 8);

    const data = {
        labels: topCareers.map(([career]) => career.length > 20 ? career.substring(0, 20) + '...' : career),
        datasets: [
            {
                label: 'Promedio',
                data: topCareers.map(([_, stats]) => stats.avg),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: '#3b82f6',
                borderWidth: 2,
                borderRadius: 6,
            },
            {
                label: 'Máximo',
                data: topCareers.map(([_, stats]) => stats.max),
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: '#10b981',
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
                display: true,
                position: 'top',
                labels: {
                    color: '#d1d5db',
                    font: { size: 12 },
                    padding: 15,
                    usePointStyle: true
                }
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
                    afterBody: (context) => {
                        const index = context[0].dataIndex;
                        const [_, stats] = topCareers[index];
                        return [
                            ``,
                            `Estudiantes: ${stats.count}`,
                            `Mínimo: ${stats.min.toFixed(2)}`,
                            `Mediana: ${stats.median.toFixed(2)}`
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
                    font: { size: 12 }
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
            <div className="mb-6">
                <h3 className="text-white text-xl font-bold">Puntajes por Carrera</h3>
                <p className="text-text-secondary text-sm mt-1">
                    Comparativa de puntajes promedio y máximo
                </p>
            </div>
            <div className="h-80">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default CareerScoresChart;
