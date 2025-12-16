import { Users, BarChart3, Trophy, GraduationCap } from 'lucide-react';

const getIcon = (iconType) => {
    const iconClass = "h-4 w-4";
    switch(iconType) {
        case 'users':
            return <Users className={iconClass} />;
        case 'chart':
            return <BarChart3 className={iconClass} />;
        case 'trophy':
            return <Trophy className={iconClass} />;
        case 'graduation':
            return <GraduationCap className={iconClass} />;
        default:
            return <BarChart3 className={iconClass} />;
    }
};

const StatsCard = ({ title, value, subtitle, icon }) => {
    return (
        <div className="rounded-lg border border-gray-200 p-5 shadow-sm bg-white transition-all hover:shadow-md">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">{title}</p>
                <div className="text-gray-400">
                    {getIcon(icon)}
                </div>
            </div>
            <p className="text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
            {subtitle && (
                <div className="mt-2 flex items-center gap-1 text-xs">
                    <span className="text-gray-500">{subtitle}</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
