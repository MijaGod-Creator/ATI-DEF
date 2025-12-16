/**
 * UNAMBA Analytics - Data Context
 * Global state management for student data and analytics
 */

import { createContext, useContext, useState, useCallback } from 'react';
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

    /**
     * Load data from parsed Excel
     */
    const loadData = useCallback((parsedData) => {
        try {
            setIsLoading(true);
            setError(null);
            setRawData(parsedData);

            // If there's only one sheet, select it automatically
            if (parsedData.sheetNames.length === 1) {
                const sheetName = parsedData.sheetNames[0];
                selectSheet(sheetName, parsedData);
            } else {
                // Merge all sheets by default
                const merged = mergeSheets(parsedData.sheets);
                setStudents(merged);
            }

            setIsLoading(false);
        } catch (err) {
            setError(`Error loading data: ${err.message}`);
            setIsLoading(false);
        }
    }, []);

    /**
     * Select a specific sheet to analyze
     */
    const selectSheet = useCallback((sheetName, data = rawData) => {
        if (!data || !data.sheets[sheetName]) {
            setError(`Sheet "${sheetName}" not found`);
            return;
        }

        setSelectedSheet(sheetName);
        const normalized = normalizeStudentData(data.sheets[sheetName].data);

        // Validate data
        const validation = validateStudentData(normalized);
        if (!validation.isValid) {
            console.warn('Data validation warnings:', validation.warnings);
        }

        setStudents(normalized);
    }, [rawData]);

    /**
     * Merge all sheets
     */
    const mergeAllSheets = useCallback(() => {
        if (!rawData) return;

        setSelectedSheet(null);
        const merged = mergeSheets(rawData.sheets);
        setStudents(merged);
    }, [rawData]);

    /**
     * Update filters
     */
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    /**
     * Reset filters
     */
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

    /**
     * Get filtered students based on current filters
     */
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

    /**
     * Get unique values for filters
     */
    const getUniqueValues = useCallback((field) => {
        const values = new Set();
        students.forEach(student => {
            if (student[field]) {
                values.add(student[field]);
            }
        });
        return Array.from(values).sort();
    }, [students]);

    /**
     * Clear all data
     */
    const clearData = useCallback(() => {
        setRawData(null);
        setStudents([]);
        setSelectedSheet(null);
        resetFilters();
        setError(null);
    }, [resetFilters]);

    const value = {
        // Data
        rawData,
        students,
        selectedSheet,
        filters,
        isLoading,
        error,

        // Methods
        loadData,
        selectSheet,
        mergeAllSheets,
        updateFilters,
        resetFilters,
        getFilteredStudents,
        getUniqueValues,
        clearData,

        // Computed
        hasData: students.length > 0,
        totalStudents: students.length,
        sheets: rawData?.sheets || {},
        sheetNames: rawData?.sheetNames || []
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
