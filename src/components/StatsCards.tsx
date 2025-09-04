
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
    <div className="shadow-sm p-5 rounded-lg shadow-none border border-gray-100 bg-background border-gray-900">
      <h3 className="text-sm font-medium mb-1 text-white">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>  
    </div>
  );
};

const StatsCards: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const accessToken = getAccessToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contracts`, {
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
      <StatCard title="All Requests" value={data?.count || 0} />
      <StatCard title="Accepted Requests" value={acceptedCount} />
      <StatCard title="Pending Requests" value={pendingCount} />
    </div>
  );
};

export default StatsCards;
