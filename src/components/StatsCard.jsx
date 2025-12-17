import React from 'react';

const StatsCard = ({ title, value, subtitle, icon, trend }) => {
    const getTrendIcon = () => {
        if (!trend) return null;
        return trend > 0 ? 'trending_up' : 'trending_down';
    };

    const getTrendColor = () => {
        if (!trend) return '';
        return trend > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10';
    };

    return (
        <div className="bg-card-dark rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-white group-hover:text-primary">
                        {icon}
                    </span>
                </div>
                {trend && (
                    <span className={`flex items-center gap-1 ${getTrendColor()} px-2 py-1 rounded-lg text-xs font-bold`}>
                        <span className="material-symbols-outlined text-[14px]">{getTrendIcon()}</span>
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
            <h3 className="text-white text-3xl font-bold tracking-tight">{value}</h3>
            {subtitle && <p className="text-text-secondary text-xs mt-1">{subtitle}</p>}
        </div>
    );
};

export default StatsCard;
