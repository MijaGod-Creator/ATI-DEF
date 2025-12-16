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
        { bg: 'rgba(17, 24, 39, 0.15)', border: '#111827' },
        { bg: 'rgba(55, 65, 81, 0.15)', border: '#374151' },
        { bg: 'rgba(75, 85, 99, 0.15)', border: '#4b5563' },
        { bg: 'rgba(107, 114, 128, 0.15)', border: '#6b7280' },
        { bg: 'rgba(156, 163, 175, 0.15)', border: '#9ca3af' },
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
                    color: '#111827',
                    font: {
                        size: 12
                    },
                    padding: 15,
                    usePointStyle: true
                }
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
                    color: '#f3f4f6'
                },
                angleLines: {
                    color: '#e5e7eb'
                },
                pointLabels: {
                    color: '#111827',
                    font: {
                        size: 13,
                        weight: '600'
                    }
                },
                ticks: {
                    color: '#6b7280',
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
            <div className="chart-container">
                <div className="chart-header">
                    <h3 className="chart-title">Comparación de Carreras</h3>
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
      <h3 className="chart-title">Comparación de Carreras</h3>
      <p className="chart-subtitle">Métricas normalizadas a escala 0-100</p>
    </div>

    <div className="mb-4 px-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Selecciona carreras para comparar (máx. 5):
      </h4>
      <div className="flex flex-wrap gap-2">
        {allCareers.map((career) => (
          <button
            key={career}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCareers.includes(career)
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleCareerToggle(career)}
          >
            {career}
          </button>
        ))}
      </div>
    </div>

    {selectedCareers.length > 0 ? (
      <div className="h-[400px]">
        <Radar data={data} options={options} />
      </div>
    ) : (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-500">
          Selecciona al menos una carrera para comparar
        </p>
      </div>
    )}
  </div>
);
};

export default ComparisonChart;
