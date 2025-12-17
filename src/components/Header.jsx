import React from 'react';

const Header = () => {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark px-8 py-4 bg-background-dark/95 backdrop-blur-sm z-10 sticky top-0">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button className="md:hidden text-white">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h2 className="text-white text-xl font-bold leading-tight hidden sm:block">
                    Resultados de Admisión 2024-II
                </h2>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-card-dark rounded-full px-4 py-2 w-64 border border-white/5 focus-within:border-primary/50 transition-colors">
                    <span className="material-symbols-outlined text-text-secondary">search</span>
                    <input
                        className="bg-transparent border-none text-white placeholder-text-secondary text-sm w-full focus:ring-0 focus:outline-none ml-2"
                        placeholder="Buscar postulante..."
                        type="text"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <button className="flex items-center justify-center size-10 rounded-full bg-card-dark text-white hover:bg-primary hover:text-white transition-all relative">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-card-dark"></span>
                    </button>

                    {/* Divider */}
                    <div className="h-8 w-px bg-border-dark mx-1"></div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-right hidden sm:block">
                            <p className="text-white text-sm font-bold group-hover:text-primary transition-colors">
                                Admin. General
                            </p>
                            <p className="text-text-secondary text-xs">Oficina Central</p>
                        </div>
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-transparent group-hover:border-primary transition-all"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD9l4KUfAZXqW-wzHLscPWSIRlyN3RqXmE4nGnH5evP20f0YqcRyJA_73cgs5Ej4iV3N2VApGvxOHBUCNXP_XjzlHoFSh7svs7DZ1E7cqhBTu-QpcGinYRiQiMbjcU1kT2-UwVZS_FcHIx1D_GP5D2hUCZEjkWjTDm8PiMpXTztzFB59esi769PN-7_KDpbTGBtduDi-8A_dI99IMwgmRpxXPLDKx6BVrfbnAG2w9YQ79PHoIPa9fV-kNYhJY78Z5TO6ozyD2HxdQk")' }}
                        ></div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
