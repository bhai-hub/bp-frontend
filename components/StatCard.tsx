import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: string;
  badge?: {
    text: string;
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'blue';
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  badge,
}) => {
  return (
    <div className="metric-box h-100 d-flex flex-column justify-content-between">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <span className="metric-label">{label}</span>
        {icon && <i className={`bi ${icon} text-muted fs-5`} aria-hidden="true"></i>}
      </div>

      <div>
        <div className="metric-value">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {(subtext || badge) && (
          <div className="d-flex align-items-center gap-2 mt-2">
            {badge && (
              <span className={`enterprise-badge enterprise-badge-${badge.variant || 'blue'}`}>
                {badge.text}
              </span>
            )}
            {subtext && <span className="metric-sub mb-0">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
