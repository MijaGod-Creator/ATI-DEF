import { useState, useRef } from 'react';
import { parseExcelFile } from '../utils/excelParser';
import { useData } from '../context/DataContext';

const ExcelUpload = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const fileInputRef = useRef(null);
    const { loadData } = useData();

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
        <div className="w-full max-w-3xl mx-auto">
            <div
                className={`
          relative bg-card-dark rounded-3xl p-12 border-2 border-dashed cursor-pointer
          transition-all duration-300
          ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-white/10 hover:border-primary/50'}
          ${uploadProgress?.status === 'success' ? 'border-emerald-500 bg-emerald-500/5' : ''}
        `}
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
                    className="hidden"
                />

                {!uploadProgress ? (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
                            <span className="material-symbols-outlined text-5xl">upload_file</span>
                        </div>
                        <h3 className="text-white text-2xl font-bold mb-2">Cargar Archivo Excel</h3>
                        <p className="text-text-secondary text-base mb-1">
                            Arrastra y suelta tu archivo aquí o haz clic para seleccionar
                        </p>
                        <p className="text-text-secondary text-sm">
                            Formatos soportados: .xlsx, .xls
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        {uploadProgress.status === 'loading' && (
                            <div>
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                                    <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                                </div>
                                <p className="text-white text-lg font-medium">Procesando {uploadProgress.fileName}...</p>
                            </div>
                        )}
                        {uploadProgress.status === 'success' && (
                            <div>
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6">
                                    <span className="material-symbols-outlined text-5xl text-emerald-500">check_circle</span>
                                </div>
                                <p className="text-white text-lg font-medium mb-2">Archivo cargado exitosamente</p>
                                <p className="text-text-secondary text-sm">{uploadProgress.fileName}</p>
                            </div>
                        )}
                        {uploadProgress.status === 'error' && (
                            <div>
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
                                    <span className="material-symbols-outlined text-5xl text-red-500">error</span>
                                </div>
                                <p className="text-white text-lg font-medium mb-2">Error al cargar el archivo</p>
                                <p className="text-red-400 text-sm">{uploadProgress.error}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExcelUpload;
