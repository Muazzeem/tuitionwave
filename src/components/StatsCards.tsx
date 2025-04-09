
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-none border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
};

const StatsCards: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="All Tuitions" value="00" />
            <StatCard title="Tutor Request Accepted" value="00" />
            <StatCard title="Tutor Request Sent" value="00" />
        </div>
    );
};

export default StatsCards;