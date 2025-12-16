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
                backgroundColor: (context) => {
                    const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
                    gradient.addColorStop(1, 'rgba(118, 75, 162, 0.8)');
                    return gradient;
                },
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(102, 126, 234, 1)',
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
                text: carrera ? `Top ${count} Estudiantes - ${carrera}` : `Top ${count} Estudiantes`,
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

    if (topStudents.length === 0) {
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

export default TopStudentsChart;
