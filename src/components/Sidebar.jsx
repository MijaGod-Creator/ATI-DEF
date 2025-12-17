import React from 'react';

const Sidebar = () => {
    return (
        <aside className="hidden md:flex flex-col w-72 h-full border-r border-border-dark bg-background-dark">
            {/* Logo & Branding */}
            <div className="p-6 flex items-center gap-3">
                <div
                    className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-lg shadow-primary/20"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3sQllOnVjlq9XeQuB7mbbl3VqmmqDj-8hXiXKZHY6a7NEruwA93Sma7VnLN8g0r341oorK2bu7ZuF_1LuALjZGSUC1rmH3bv7tcGlaFZTxzIbvOr2_81utk7QF6IycO2PMz3AXk7iVs_5e5siGZX-F5mIhpnSW86krbUr6qf8G9B0-dYO66-h1ebXHBO8Mz0Hs3IJP5PFndMtBLnJwj22vSbEY-qTptqRP41UxU92nejxba41xC8bFoD3VrqfES3Tu8loLg-DeVs")' }}
                ></div>
                <div className="flex flex-col">
                    <h1 className="text-white text-lg font-bold leading-tight tracking-tight">Admisión UNAMBA</h1>
                    <p className="text-text-secondary text-xs font-medium">Panel Administrativo</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
                <a className="flex items-center gap-3 px-4 py-3 rounded-full bg-primary/20 text-primary transition-all duration-200 border border-primary/10" href="#">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                    <span className="text-sm font-bold">Dashboard</span>
                </a>

                <a className="flex items-center gap-3 px-4 py-3 rounded-full text-text-secondary hover:bg-card-dark hover:text-white transition-all duration-200" href="#">
                    <span className="material-symbols-outlined">bar_chart</span>
                    <span className="text-sm font-medium">Reportes</span>
                </a>

                <a className="flex items-center gap-3 px-4 py-3 rounded-full text-text-secondary hover:bg-card-dark hover:text-white transition-all duration-200" href="#">
                    <span className="material-symbols-outlined">groups</span>
                    <span className="text-sm font-medium">Postulantes</span>
                </a>

                <a className="flex items-center gap-3 px-4 py-3 rounded-full text-text-secondary hover:bg-card-dark hover:text-white transition-all duration-200" href="#">
                    <span className="material-symbols-outlined">school</span>
                    <span className="text-sm font-medium">Carreras</span>
                </a>

                <div className="my-2 border-t border-border-dark"></div>

                <a className="flex items-center gap-3 px-4 py-3 rounded-full text-text-secondary hover:bg-card-dark hover:text-white transition-all duration-200" href="#">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-sm font-medium">Configuración</span>
                </a>

                <a className="flex items-center gap-3 px-4 py-3 rounded-full text-text-secondary hover:bg-card-dark hover:text-white transition-all duration-200" href="#">
                    <span className="material-symbols-outlined">help</span>
                    <span className="text-sm font-medium">Ayuda</span>
                </a>
            </nav>

            {/* System Status Card */}
            <div className="p-4">
                <div className="bg-gradient-to-br from-card-dark to-[#020617] rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-sm">bolt</span>
                        </div>
                        <p className="text-white text-sm font-bold">Sistema en Línea</p>
                    </div>
                    <p className="text-text-secondary text-xs leading-relaxed mb-3">
                        Servidores de examen operando al 100% de capacidad.
                    </p>
                    <div className="w-full bg-black/20 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
