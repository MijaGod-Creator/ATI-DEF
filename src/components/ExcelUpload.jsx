import { useState, useRef } from 'react';
import { parseExcelFile } from '../utils/excelParser';
import { useData } from '../context/DataContext';
import { Upload, CheckCircle, XCircle, Loader2, FileSpreadsheet } from 'lucide-react';

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
        <div className="excel-upload w-full">
            <div
                className={`relative min-h-[280px] flex items-center justify-center rounded-lg border-2 ${
                    isDragging
                        ? 'border-solid border-gray-400 bg-gray-50'
                        : uploadProgress?.status === 'success'
                        ? 'border-dashed border-green-300 bg-green-50'
                        : 'border-dashed border-gray-300 bg-white'
                } cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50`}
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
                    <div className="text-center p-8">
                        <div className="mb-4 flex justify-center">
                            <Upload className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="mb-2 text-base font-semibold text-gray-900">Cargar Archivo Excel</h3>
                        <p className="mb-1 text-sm text-gray-500">Arrastra y suelta tu archivo aquí o haz clic para seleccionar</p>
                        <p className="text-xs text-gray-400">Formatos soportados: .xlsx, .xls</p>
                    </div>
                ) : (
                    <div className="w-full p-8">
                        {uploadProgress.status === 'loading' && (
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="h-10 w-10 animate-spin text-gray-900" />
                                <p className="text-sm font-medium text-gray-900">Procesando {uploadProgress.fileName}...</p>
                            </div>
                        )}
                        {uploadProgress.status === 'success' && (
                            <div className="flex flex-col items-center gap-3 animate-fadeIn">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <p className="font-medium text-gray-900">Archivo cargado exitosamente</p>
                                <p className="text-sm text-gray-500 break-all">{uploadProgress.fileName}</p>
                            </div>
                        )}
                        {uploadProgress.status === 'error' && (
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border-2 border-red-200">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <p className="font-medium text-gray-900">Error al cargar el archivo</p>
                                <p className="text-sm text-red-600 max-w-md text-center">{uploadProgress.error}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {rawData && (
                <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm animate-fadeIn">
                    <h4 className="mb-4 text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Archivo Cargado
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center rounded-md bg-gray-50 px-3 py-2">
                            <span className="text-xs font-medium text-gray-600">Nombre:</span>
                            <span className="text-xs text-gray-900 font-medium">{rawData.fileName}</span>
                        </div>
                        <div className="flex justify-between items-center rounded-md bg-gray-50 px-3 py-2">
                            <span className="text-xs font-medium text-gray-600">Hojas:</span>
                            <span className="text-xs text-gray-900 font-medium">{rawData.totalSheets}</span>
                        </div>
                        <div className="flex justify-between items-center rounded-md bg-gray-50 px-3 py-2">
                            <span className="text-xs font-medium text-gray-600">Hojas disponibles:</span>
                            <span className="text-xs text-gray-900 font-medium text-right">{rawData.sheetNames.join(', ')}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExcelUpload;
