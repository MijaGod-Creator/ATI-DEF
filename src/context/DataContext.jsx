/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeStudentData, mergeSheets, validateStudentData } from '../utils/excelParser';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const navigate = useNavigate();
    const [rawData, setRawData] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState(null);
    const [filters, setFilters] = useState({
        carrera: null,
        searchQuery: '',
        minScore: null,
        maxScore: null,
        genero: null,
        procedencia: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const selectSheet = useCallback((sheetName, data = rawData) => {
        if (!data || !data.sheets[sheetName]) {
            setError(`Sheet "${sheetName}" not found`);
            return;
        }

        setSelectedSheet(sheetName);
        const normalized = normalizeStudentData(data.sheets[sheetName].data);

        const validation = validateStudentData(normalized);
        if (!validation.isValid) {
            console.warn('Data validation warnings:', validation.warnings);
        }

        setStudents(normalized);
    }, [rawData]);

    const loadData = useCallback((parsedData) => {
        try {
            setIsLoading(true);
            setError(null);
            setRawData(parsedData);

            if (parsedData.sheetNames.length === 1) {
                const sheetName = parsedData.sheetNames[0];
                selectSheet(sheetName, parsedData);
            } else {
                const merged = mergeSheets(parsedData.sheets);
                setStudents(merged);
            }

            setIsLoading(false);
            
            navigate('/admin/resumen');
        } catch (err) {
            setError(`Error loading data: ${err.message}`);
            setIsLoading(false);
        }
    }, [navigate, selectSheet]);

    const mergeAllSheets = useCallback(() => {
        if (!rawData) return;

        setSelectedSheet(null);
        const merged = mergeSheets(rawData.sheets);
        setStudents(merged);
    }, [rawData]);

    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);


    const resetFilters = useCallback(() => {
        setFilters({
            carrera: null,
            searchQuery: '',
            minScore: null,
            maxScore: null,
            genero: null,
            procedencia: null
        });
    }, []);

    const getFilteredStudents = useCallback(() => {
        let filtered = [...students];

        if (filters.carrera) {
            filtered = filtered.filter(s => s.carrera === filters.carrera);
        }

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(s => {
                const nombre = (s.nombre || '').toLowerCase();
                const apellido = (s.apellido || '').toLowerCase();
                const dni = (s.dni || '').toString().toLowerCase();
                const carrera = (s.carrera || '').toLowerCase();

                return nombre.includes(query) ||
                    apellido.includes(query) ||
                    dni.includes(query) ||
                    carrera.includes(query);
            });
        }

        if (filters.minScore !== null && filters.minScore !== '') {
            filtered = filtered.filter(s => s.puntaje >= parseFloat(filters.minScore));
        }

        if (filters.maxScore !== null && filters.maxScore !== '') {
            filtered = filtered.filter(s => s.puntaje <= parseFloat(filters.maxScore));
        }

        if (filters.genero) {
            filtered = filtered.filter(s => s.genero === filters.genero);
        }

        if (filters.procedencia) {
            filtered = filtered.filter(s => s.procedencia === filters.procedencia);
        }

        return filtered;
    }, [students, filters]);

    const getUniqueValues = useCallback((field) => {
        const values = new Set();
        students.forEach(student => {
            if (student[field]) {
                values.add(student[field]);
            }
        });
        return Array.from(values).sort();
    }, [students]);

    const clearData = useCallback(() => {
        setRawData(null);
        setStudents([]);
        setSelectedSheet(null);
        resetFilters();
        setError(null);
    }, [resetFilters]);

    const value = {
        rawData,
        students,
        selectedSheet,
        filters,
        isLoading,
        error,

        loadData,
        selectSheet,
        mergeAllSheets,
        updateFilters,
        resetFilters,
        getFilteredStudents,
        getUniqueValues,
        clearData,

        hasData: students.length > 0,
        totalStudents: students.length,
        sheets: rawData?.sheets || {},
        sheetNames: rawData?.sheetNames || []
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
