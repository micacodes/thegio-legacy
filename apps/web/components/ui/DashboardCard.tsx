import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default DashboardCard;