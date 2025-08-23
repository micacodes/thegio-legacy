// path: apps/web/components/ui/AdminStatCard.tsx
import { ReactNode } from 'react';

interface AdminStatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-4 rounded-full bg-gradient-to-tr text-white ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
};

export default AdminStatCard;