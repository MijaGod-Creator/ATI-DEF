/**
 * UNAMBA Analytics - Analytics Utility Functions
 * Statistical analysis and data processing for admission results
 */

/**
 * Get top N students by score
 * @param {Array} students - Array of student data
 * @param {Number} n - Number of top students to return
 * @param {String} carrera - Optional: filter by career
 * @returns {Array} - Top students sorted by score
 */
export const getTopStudents = (students, n = 10, carrera = null) => {
    let filtered = [...students];

    if (carrera) {
        filtered = filtered.filter(s => s.carrera === carrera);
    }

    return filtered
        .filter(s => s.puntaje !== null && s.puntaje !== undefined)
        .sort((a, b) => b.puntaje - a.puntaje)
        .slice(0, n);
};

/**
 * Get the best student overall
 * @param {Array} students - Array of student data
 * @returns {Object} - Top student with metadata
 */
export const getBestStudent = (students) => {
    const top = getTopStudents(students, 1);
    return top.length > 0 ? top[0] : null;
};

/**
 * Calculate statistics by career
 * @param {Array} students - Array of student data
 * @returns {Object} - Statistics grouped by career
 */
export const getCareerStats = (students) => {
    const careerMap = {};

    students.forEach(student => {
        const carrera = student.carrera || 'Sin Carrera';

        if (!careerMap[carrera]) {
            careerMap[carrera] = {
                nombre: carrera,
                estudiantes: [],
                count: 0,
                puntajes: []
            };
        }

        careerMap[carrera].estudiantes.push(student);
        careerMap[carrera].count++;
        if (student.puntaje !== null && student.puntaje !== undefined) {
            careerMap[carrera].puntajes.push(student.puntaje);
        }
    });

    // Calculate statistics for each career
    Object.keys(careerMap).forEach(carrera => {
        const stats = careerMap[carrera];
        const scores = stats.puntajes;

        if (scores.length > 0) {
            stats.max = Math.max(...scores);
            stats.min = Math.min(...scores);
            stats.avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            stats.median = calculateMedian(scores);
            stats.stdDev = calculateStdDev(scores);
            stats.topStudent = stats.estudiantes.find(s => s.puntaje === stats.max);
        } else {
            stats.max = 0;
            stats.min = 0;
            stats.avg = 0;
            stats.median = 0;
            stats.stdDev = 0;
            stats.topStudent = null;
        }
    });

    return careerMap;
};

/**
 * Get overall statistics
 * @param {Array} students - Array of student data
 * @returns {Object} - Overall statistics
 */
export const getOverallStats = (students) => {
    const scores = students
        .filter(s => s.puntaje !== null && s.puntaje !== undefined)
        .map(s => s.puntaje);

    if (scores.length === 0) {
        return {
            totalStudents: students.length,
            studentsWithScores: 0,
            maxScore: 0,
            minScore: 0,
            avgScore: 0,
            medianScore: 0,
            stdDev: 0
        };
    }

    return {
        totalStudents: students.length,
        studentsWithScores: scores.length,
        maxScore: Math.max(...scores),
        minScore: Math.min(...scores),
        avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        medianScore: calculateMedian(scores),
        stdDev: calculateStdDev(scores)
    };
};

/**
 * Calculate score distribution (histogram data)
 * @param {Array} students - Array of student data
 * @param {Number} bins - Number of bins for distribution
 * @returns {Array} - Distribution data
 */
export const getScoreDistribution = (students, bins = 10) => {
    const scores = students
        .filter(s => s.puntaje !== null && s.puntaje !== undefined)
        .map(s => s.puntaje);

    if (scores.length === 0) return [];

    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const binSize = (max - min) / bins;

    const distribution = [];
    for (let i = 0; i < bins; i++) {
        const binMin = min + (i * binSize);
        const binMax = binMin + binSize;
        const count = scores.filter(s => s >= binMin && (i === bins - 1 ? s <= binMax : s < binMax)).length;

        distribution.push({
            range: `${binMin.toFixed(1)} - ${binMax.toFixed(1)}`,
            min: binMin,
            max: binMax,
            count: count,
            percentage: (count / scores.length * 100).toFixed(1)
        });
    }

    return distribution;
};

/**
 * Calculate percentile for a given score
 * @param {Array} students - Array of student data
 * @param {Number} score - Score to calculate percentile for
 * @returns {Number} - Percentile (0-100)
 */
export const calculatePercentile = (students, score) => {
    const scores = students
        .filter(s => s.puntaje !== null && s.puntaje !== undefined)
        .map(s => s.puntaje)
        .sort((a, b) => a - b);

    if (scores.length === 0) return 0;

    const belowOrEqual = scores.filter(s => s <= score).length;
    return (belowOrEqual / scores.length) * 100;
};

/**
 * Get gender distribution
 * @param {Array} students - Array of student data
 * @returns {Object} - Gender statistics
 */
export const getGenderDistribution = (students) => {
    const distribution = {
        Masculino: 0,
        Femenino: 0,
        Otro: 0,
        'No especificado': 0
    };

    students.forEach(student => {
        const gender = student.genero;
        if (!gender) {
            distribution['No especificado']++;
        } else if (gender.toLowerCase().includes('m') || gender.toLowerCase().includes('masc')) {
            distribution.Masculino++;
        } else if (gender.toLowerCase().includes('f') || gender.toLowerCase().includes('fem')) {
            distribution.Femenino++;
        } else {
            distribution.Otro++;
        }
    });

    return distribution;
};

/**
 * Get regional distribution
 * @param {Array} students - Array of student data
 * @returns {Object} - Regional statistics
 */
export const getRegionalDistribution = (students) => {
    const distribution = {};

    students.forEach(student => {
        const region = student.procedencia || 'No especificado';
        distribution[region] = (distribution[region] || 0) + 1;
    });

    return Object.entries(distribution)
        .map(([region, count]) => ({
            region,
            count,
            percentage: (count / students.length * 100).toFixed(1)
        }))
        .sort((a, b) => b.count - a.count);
};

/**
 * Compare careers by multiple metrics
 * @param {Array} students - Array of student data
 * @param {Array} careers - Array of career names to compare
 * @returns {Object} - Comparison data
 */
export const compareCareers = (students, careers) => {
    const comparison = {
        careers: careers,
        metrics: {}
    };

    const careerStats = getCareerStats(students);

    careers.forEach(carrera => {
        const stats = careerStats[carrera];
        if (!stats) return;

        if (!comparison.metrics.avgScore) {
            comparison.metrics.avgScore = [];
            comparison.metrics.maxScore = [];
            comparison.metrics.minScore = [];
            comparison.metrics.totalStudents = [];
        }

        comparison.metrics.avgScore.push(stats.avg);
        comparison.metrics.maxScore.push(stats.max);
        comparison.metrics.minScore.push(stats.min);
        comparison.metrics.totalStudents.push(stats.count);
    });

    return comparison;
};

/**
 * Search students by name, DNI, or career
 * @param {Array} students - Array of student data
 * @param {String} query - Search query
 * @returns {Array} - Filtered students
 */
export const searchStudents = (students, query) => {
    if (!query) return students;

    const lowerQuery = query.toLowerCase();

    return students.filter(student => {
        const nombre = (student.nombre || '').toLowerCase();
        const apellido = (student.apellido || '').toLowerCase();
        const dni = (student.dni || '').toString().toLowerCase();
        const carrera = (student.carrera || '').toLowerCase();

        return nombre.includes(lowerQuery) ||
            apellido.includes(lowerQuery) ||
            dni.includes(lowerQuery) ||
            carrera.includes(lowerQuery);
    });
};

// Helper functions
const calculateMedian = (numbers) => {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
};

const calculateStdDev = (numbers) => {
    const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squareDiffs = numbers.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / numbers.length;
    return Math.sqrt(avgSquareDiff);
};

/**
 * Get ranking with position numbers
 * @param {Array} students - Array of student data
 * @param {String} carrera - Optional: filter by career
 * @returns {Array} - Ranked students
 */
export const getRanking = (students, carrera = null) => {
    let filtered = [...students];

    if (carrera) {
        filtered = filtered.filter(s => s.carrera === carrera);
    }

    return filtered
        .filter(s => s.puntaje !== null && s.puntaje !== undefined)
        .sort((a, b) => b.puntaje - a.puntaje)
        .map((student, index) => ({
            ...student,
            ranking: index + 1
        }));
};
