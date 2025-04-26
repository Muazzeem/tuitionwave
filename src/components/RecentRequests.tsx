
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { getAccessToken } from '@/utils/auth';
import { ContractResponse, Contract } from '@/types/contract';
import * as Tooltip from '@radix-ui/react-tooltip';

const RequestRow: React.FC<{ request: Contract }> = ({ request }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'text-tuitionwave-green';
      case 'rejected':
        return 'text-tuitionwave-red';
      case 'pending':
        return 'text-tuitionwave-yellow';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-tuitionwave-green';
      case 'rejected':
        return 'bg-tuitionwave-red';
      case 'pending':
        return 'bg-tuitionwave-yellow';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 px-2 text-sm">#{request.uid.slice(5, 10)}</td>
      <td className="py-3 px-2">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
            <img
              src={request.tutor.profile_picture}
              alt={`${request.tutor.institute.name}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{request.tutor.full_name}</p>
            <p className="text-xs text-gray-500">{request.tutor.institute.name}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-2 text-sm">
        {request.subjects.map(s => s.subject).join(', ')}
      </td>
      <td className="py-3 px-2 text-sm">{request.contract_duration} Month</td>
      <td className="py-3 px-2 text-sm">৳{request.proposed_salary}</td>
      <td className="py-3 px-2">
        <div className="flex items-center">
          <span className={`h-2 w-2 rounded-full ${getStatusDot(request.status_display)} mr-2`}></span>
          <span className={`text-sm ${getStatusColor(request.status_display)}`}>
            {request.status_display}
          </span>
        </div>
      </td>
      <td className="py-3 px-2">

      </td>
    </tr>
  );
};

const RecentRequests: React.FC = () => {
  const { data, isLoading, error } = useQuery({
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading requests</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-none border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Recent Request</h2>
        <Link to="/all-requests">
          <Button className="text-sm text-tuitionwave-blue hover:underline text-white">
            View All
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
              <th className="py-2 px-2">Req. ID</th>
              <th className="py-2 px-2">Tutor Name</th>
              <th className="py-2 px-2">Subject</th>
              <th className="py-2 px-2">Tuition Period</th>
              <th className="py-2 px-2">Requested Amount</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Others</th>
            </tr>
          </thead>
          <tbody>
            {data?.results.map((request, index) => (
              <RequestRow key={index} request={request} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentRequests;
