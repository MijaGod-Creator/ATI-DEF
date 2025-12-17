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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopStudentsChart = ({ count = 10, carrera = null }) => {
    const { getFilteredStudents } = useData();
    const students = getFilteredStudents();
    const topStudents = getTopStudents(students, count, carrera);

    const data = {
        labels: topStudents.map((s, i) => `#${i + 1}`),
        datasets: [
            {
                label: 'Puntaje',
                data: topStudents.map(s => s.puntaje),
                backgroundColor: topStudents.map((s, i) => {
                    const opacity = 0.9 - (i * 0.05);
                    return `rgba(59, 130, 246, ${opacity})`;
                }),
                borderColor: '#3b82f6',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: '#3b82f6',
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
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#f9fafb',
                bodyColor: '#d1d5db',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    title: (context) => {
                        const student = topStudents[context[0].dataIndex];
                        const nombre = student.nombre || 'Sin nombre';
                        const apellido = student.apellido || '';
                        return `${nombre} ${apellido}`.trim();
                    },
                    label: (context) => {
                        const student = topStudents[context.dataIndex];
                        return [
                            `Puntaje: ${student.puntaje.toFixed(2)}`,
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
                    font: { size: 12 }
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: '#9ca3af',
                    font: { size: 12 }
                }
            }
        }
    };

    if (topStudents.length === 0) {
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
                <h3 className="text-white text-xl font-bold">
                    {carrera ? `Top ${count} - ${carrera}` : `Top ${count} Estudiantes`}
                </h3>
                <p className="text-text-secondary text-sm mt-1">
                    Mejores puntajes del proceso de admisión
                </p>
            </div>
            <div className="h-80">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default TopStudentsChart;
