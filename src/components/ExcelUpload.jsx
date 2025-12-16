import { useState, useRef } from 'react';
import { parseExcelFile } from '../utils/excelParser';
import { useData } from '../context/DataContext';
import './ExcelUpload.css';

const ExcelUpload = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const fileInputRef = useRef(null);
    const { loadData, rawData } = useData();

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleFile(files[0]);
        }
    };

    const handleFileInput = async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            await handleFile(files[0]);
        }
    };

    const handleFile = async (file) => {
        // Validate file type
        const validTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.oasis.opendocument.spreadsheet'
        ];

        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|ods)$/i)) {
            alert('Por favor, selecciona un archivo Excel válido (.xlsx, .xls)');
            return;
        }

        try {
            setUploadProgress({ fileName: file.name, status: 'loading' });

            const parsedData = await parseExcelFile(file);
            loadData(parsedData);

            setUploadProgress({ fileName: file.name, status: 'success' });

            // Clear progress after 3 seconds
            setTimeout(() => setUploadProgress(null), 3000);
        } catch (error) {
            console.error('Error parsing file:', error);
            setUploadProgress({ fileName: file.name, status: 'error', error: error.message });
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="excel-upload">
            <div
                className={`upload-zone ${isDragging ? 'dragging' : ''} ${uploadProgress?.status === 'success' ? 'success' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.ods"
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                />

                {!uploadProgress ? (
                    <div className="upload-content">
                        <div className="upload-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>
                        <h3>Cargar Archivo Excel</h3>
                        <p>Arrastra y suelta tu archivo aquí o haz clic para seleccionar</p>
                        <p className="file-types">Formatos soportados: .xlsx, .xls</p>
                    </div>
                ) : (
                    <div className="upload-status">
                        {uploadProgress.status === 'loading' && (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <p>Procesando {uploadProgress.fileName}...</p>
                            </div>
                        )}
                        {uploadProgress.status === 'success' && (
                            <div className="success-message">
                                <div className="success-icon">✓</div>
                                <p>Archivo cargado exitosamente</p>
                                <p className="file-name">{uploadProgress.fileName}</p>
                            </div>
                        )}
                        {uploadProgress.status === 'error' && (
                            <div className="error-message">
                                <div className="error-icon">✕</div>
                                <p>Error al cargar el archivo</p>
                                <p className="error-detail">{uploadProgress.error}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {rawData && (
                <div className="file-info glass-card mt-lg">
                    <h4>📄 Archivo Cargado</h4>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Nombre:</span>
                            <span className="value">{rawData.fileName}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Hojas:</span>
                            <span className="value">{rawData.totalSheets}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Hojas disponibles:</span>
                            <span className="value">{rawData.sheetNames.join(', ')}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExcelUpload;
