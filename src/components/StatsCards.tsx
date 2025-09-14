import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken } from '@/utils/auth';
import { ContractResponse } from '@/types/contract';

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-background-700/80 px-6 py-6">
      <div>
        <p className="text-4xl font-bold text-white font-unbounded">{value}</p>
        <p className="mt-1 text-sm text-white/70">{label}</p>
      </div>

      {/* circular blue icon badge */}
      <div className="shrink-0 rounded-full p-3 bg-primary-600">
        <div className="h-8 w-8 text-white">
          {icon}
        </div>
      </div>
    </div>
  );
};

// simple inline SVG icons (no extra deps)
const QuestionEditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
    <path d="M9.5 9a3.5 3.5 0 1 1 3.5 3.5V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17.5 20.5l3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 21l.7-2.8c.1-.4.3-.6.6-.9l2.9-2.9a1.5 1.5 0 0 1 2.1 0l.2.2a1.5 1.5 0 0 1 0 2.1l-2.9 2.9c-.3.3-.5.5-.9.6L14 21Z" fill="currentColor" />
  </svg>
);

const DocumentCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M14 2v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="m8.5 14.5 2 2 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockPendingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 5.5c.7.7 1.3 1.6 1.7 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const StatsCards: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const accessToken = getAccessToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contracts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch contracts');
      return response.json() as Promise<ContractResponse>;
    },
  });

  const total = data?.count || 0;
  const acceptedCount =
    data?.results.filter(r => r.status_display.toLowerCase() === 'accepted').length || 0;
  const pendingCount =
    data?.results.filter(r => r.status_display.toLowerCase() === 'pending').length || 0;

  return (
    <div className="rounded-2xl bg-background-900 p-4">
      <h2 className="text-md font-bold text-white font-unbounded mb-2">
        Summary
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          value={total}
          label="Total Requests"
          icon={<QuestionEditIcon />}
        />
        <StatCard
          value={acceptedCount}
          label="Total Accepted Requests"
          icon={<DocumentCheckIcon />}
        />
        <StatCard
          value={pendingCount}
          label="Pending Requests"
          icon={<ClockPendingIcon />}
        />
      </div>
    </div>
  );
};

export default StatsCards;
