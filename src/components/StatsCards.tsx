
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken } from '@/utils/auth';
import { ContractResponse } from '@/types/contract';

interface StatCardProps {
  title: string;
  value: string | number;
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
  const { data } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const accessToken = getAccessToken();
      const response = await fetch('http://127.0.0.1:8000/api/contracts', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch contracts');
      }
      return response.json() as Promise<ContractResponse>;
    },
  });

  const acceptedCount = data?.results.filter(r => r.status_display.toLowerCase() === 'accepted').length || 0;
  const pendingCount = data?.results.filter(r => r.status_display.toLowerCase() === 'pending').length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="All Tuitions" value={data?.count || 0} />
      <StatCard title="Tutor Request Accepted" value={acceptedCount} />
      <StatCard title="Tutor Request Sent" value={pendingCount} />
    </div>
  );
};

export default StatsCards;
