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
import { getTopStudents } from '../../utils/analytics';
import './ChartStyles.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopStudentsChart = ({ count = 10, carrera = null }) => {
    const { getFilteredStudents } = useData();
    const students = getFilteredStudents();
    const topStudents = getTopStudents(students, count, carrera);

    const data = {
        labels: topStudents.map(s => {
            const nombre = s.nombre || 'Sin nombre';
            const apellido = s.apellido || '';
            return `${nombre} ${apellido}`.trim().substring(0, 20);
        }),
        datasets: [
            {
                label: 'Puntaje',
                data: topStudents.map(s => s.puntaje),
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                borderColor: 'rgba(17, 24, 39, 1)',
                borderWidth: 1,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(17, 24, 39, 0.9)',
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
                    afterLabel: (context) => {
                        const student = topStudents[context.dataIndex];
                        return [
                            student.carrera ? `Carrera: ${student.carrera}` : '',
                            student.dni ? `DNI: ${student.dni}` : ''
                        ].filter(Boolean);
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

    if (topStudents.length === 0) {
        return (
            <div className="chart-container">
                <div className="chart-header">
                    <h3 className="chart-title">Top Estudiantes</h3>
                </div>
                <div className="p-8 text-center">
                    <p className="text-sm text-gray-500">📊 No hay datos disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h3 className="chart-title">
                    {carrera ? `Top ${count} Estudiantes - ${carrera}` : `Top ${count} Estudiantes`}
                </h3>
                <p className="chart-subtitle">Ranking por puntaje más alto</p>
            </div>
            <div className="h-[400px]">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default TopStudentsChart;
