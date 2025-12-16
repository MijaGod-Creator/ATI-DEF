import ExcelUpload from '../components/ExcelUpload';
import { BarChart3, Trophy, LayoutDashboard, GitCompare } from 'lucide-react';

const HomePage = () => {

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 bg-cover bg-center bg-[url('/mesh-gradient-category.svg')] ">
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="glass-effect sticky top-0 z-10 flex bg-red h-14 items-center justify-between border-b border-gray-200 px-6">
                    <div className="flex items-center gap-4 mx-auto w-full max-w-4xl">
                        <div className="flex items-center gap-2">
                            <div className="flex size-10 items-center justify-center rounded bg-blue-700 text-white">
                                <img className="h-8" src="/logo-unamba.webp" alt="logounamba" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight text-gray-900">
                                Análizar exámenes <br />
                                de admisión de la UNAMBA
                            </span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 mx-auto w-full max-w-7xl ">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-8">
                            <h1 className="text-xl font-semibold tracking-tight text-gray-900">¡Bienvenido al Análizar exámenes
                                de admisión de la UNAMBA!</h1>
                            <p className="mt-1 text-base text-gray-500">
                                Carga tu archivo Excel con los resultados de admisión para comenzar el análisis.
                            </p>
                        </div>

                        <ExcelUpload />

                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg border border-gray-200 p-5 shadow-sm bg-white">
                                <div className="mb-2 flex items-center justify-center">
                                    <BarChart3 className="h-8 w-8 text-gray-400" />
                                </div>
                                <h4 className="text-center text-sm font-medium text-gray-900">Gráficos Interactivos</h4>
                                <p className="text-center text-xs text-gray-500 mt-1">Visualiza datos con gráficos dinámicos</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-5 shadow-sm bg-white">
                                <div className="mb-2 flex items-center justify-center">
                                    <Trophy className="h-8 w-8 text-gray-400" />
                                </div>
                                <h4 className="text-center text-sm font-medium text-gray-900">Rankings</h4>
                                <p className="text-center text-xs text-gray-500 mt-1">Identifica a los mejores estudiantes</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-5 shadow-sm bg-white">
                                <div className="mb-2 flex items-center justify-center">
                                    <LayoutDashboard className="h-8 w-8 text-gray-400" />
                                </div>
                                <h4 className="text-center text-sm font-medium text-gray-900">Análisis Estadístico</h4>
                                <p className="text-center text-xs text-gray-500 mt-1">Estadísticas completas por carrera</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-5 shadow-sm bg-white">
                                <div className="mb-2 flex items-center justify-center">
                                    <GitCompare className="h-8 w-8 text-gray-400" />
                                </div>
                                <h4 className="text-center text-sm font-medium text-gray-900">Comparación</h4>
                                <p className="text-center text-xs text-gray-500 mt-1">Compara carreras fácilmente</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HomePage;
