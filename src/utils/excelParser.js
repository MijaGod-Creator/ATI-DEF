import * as XLSX from 'xlsx';

export const parseExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const parsedData = {
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date().toISOString(),
          sheets: {},
          sheetNames: workbook.SheetNames,
          totalSheets: workbook.SheetNames.length
        };
        
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            raw: false,
            defval: null
          });
          
          parsedData.sheets[sheetName] = {
            name: sheetName,
            data: jsonData,
            rowCount: jsonData.length,
            columns: jsonData.length > 0 ? Object.keys(jsonData[0]) : []
          };
        });
        
        resolve(parsedData);
      } catch (error) {
        reject(new Error(`Error parsing Excel file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const normalizeStudentData = (data) => {
  if (!data || data.length === 0) return [];
  
  const fieldMappings = {
    nombre: ['nombre', 'nombres', 'alumno', 'estudiante', 'postulante', 'name'],
    apellido: ['apellido', 'apellidos', 'lastname'],
    dni: ['dni', 'documento', 'cedula', 'id', 'codigo'],
    
    puntaje: ['puntaje', 'puntaje_total', 'score', 'nota', 'calificacion', 'total'],
    puntaje_examen: ['puntaje_examen', 'examen', 'test_score'],
    
    carrera: ['carrera', 'programa', 'especialidad', 'career', 'program'],
    facultad: ['facultad', 'faculty', 'escuela'],
    
    genero: ['genero', 'sexo', 'gender', 'sex'],
    procedencia: ['procedencia', 'origen', 'ciudad', 'provincia', 'region'],
    modalidad: ['modalidad', 'tipo', 'categoria', 'type'],
    puesto: ['puesto', 'ranking', 'posicion', 'rank'],
    estado: ['estado', 'status', 'resultado', 'result']
  };
  
  const firstRow = data[0];
  const columnMap = {};
  
  Object.keys(fieldMappings).forEach(standardField => {
    const possibleNames = fieldMappings[standardField];
    const foundColumn = Object.keys(firstRow).find(col => 
      possibleNames.some(name => col.toLowerCase().includes(name.toLowerCase()))
    );
    if (foundColumn) {
      columnMap[standardField] = foundColumn;
    }
  });
  
  return data.map((row, index) => {
    const normalized = {
      id: index + 1,
      originalData: row 
    };
    
    Object.keys(columnMap).forEach(standardField => {
      const originalColumn = columnMap[standardField];
      normalized[standardField] = row[originalColumn];
    });
    
    if (normalized.puntaje) {
      normalized.puntaje = parseFloat(normalized.puntaje) || 0;
    }
    if (normalized.puntaje_examen) {
      normalized.puntaje_examen = parseFloat(normalized.puntaje_examen) || 0;
    }
    if (normalized.puesto) {
      normalized.puesto = parseInt(normalized.puesto) || null;
    }
    
    return normalized;
  });
};

export const validateStudentData = (data) => {
  const results = {
    isValid: true,
    errors: [],
    warnings: [],
    stats: {
      totalRecords: data.length,
      validRecords: 0,
      invalidRecords: 0
    }
  };
  
  if (!data || data.length === 0) {
    results.isValid = false;
    results.errors.push('No data found');
    return results;
  }
  
  data.forEach((row, index) => {
    let isRowValid = true;
    
    if (!row.puntaje && row.puntaje !== 0) {
      results.warnings.push(`Row ${index + 1}: Missing score (puntaje)`);
      isRowValid = false;
    }
    
    if (!row.carrera) {
      results.warnings.push(`Row ${index + 1}: Missing career (carrera)`);
    }
    
    if (row.puntaje && (isNaN(row.puntaje) || row.puntaje < 0)) {
      results.errors.push(`Row ${index + 1}: Invalid score value`);
      isRowValid = false;
    }
    
    if (isRowValid) {
      results.stats.validRecords++;
    } else {
      results.stats.invalidRecords++;
    }
  });
  
  if (results.errors.length > 0) {
    results.isValid = false;
  }
  
  return results;
};

export const mergeSheets = (sheets) => {
  const allData = [];
  
  Object.values(sheets).forEach(sheet => {
    const normalized = normalizeStudentData(sheet.data);
    normalized.forEach(row => {
      row.sourceSheet = sheet.name;
    });
    allData.push(...normalized);
  });
  
  return allData;
};

export const exportToExcel = (data, filename = 'export.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, filename);
};
