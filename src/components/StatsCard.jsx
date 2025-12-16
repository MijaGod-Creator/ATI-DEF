import './StatsCard.css';

const StatsCard = ({ title, value, subtitle, icon, gradient, trend }) => {
    return (
        <div className={`stats-card glass-card ${gradient}`}>
            <div className="stats-header">
                <div className="stats-icon">{icon}</div>
                {trend && (
                    <div className={`stats-trend ${trend > 0 ? 'positive' : 'negative'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="stats-content">
                <h3 className="stats-title">{title}</h3>
                <div className="stats-value">{value}</div>
                {subtitle && <p className="stats-subtitle">{subtitle}</p>}
            </div>
            <div className="stats-glow"></div>
        </div>
    );
};

export default StatsCard;
