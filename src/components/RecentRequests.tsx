
import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from './ui/button';

interface RequestData {
    id: string;
    tutorName: string;
    university: string;
    subject: string;
    period: string;
    status: 'Accepted' | 'Rejected' | 'Pending';
    avatar: string;
}

const RequestRow: React.FC<{ request: RequestData }> = ({ request }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'text-tuitionwave-green';
            case 'Rejected':
                return 'text-tuitionwave-red';
            case 'Pending':
                return 'text-tuitionwave-yellow';
            default:
                return 'text-gray-500';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'bg-tuitionwave-green';
            case 'Rejected':
                return 'bg-tuitionwave-red';
            case 'Pending':
                return 'bg-tuitionwave-yellow';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <tr className="border-b border-gray-100">
            <td className="py-3 px-2 text-sm">{request.id}</td>
            <td className="py-3 px-2">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                        <img
                            src={request.avatar}
                            alt={request.tutorName}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{request.tutorName}</p>
                        <p className="text-xs text-gray-500">{request.university}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 px-2 text-sm">{request.subject}</td>
            <td className="py-3 px-2 text-sm">{request.period}</td>
            <td className="py-3 px-2">
                <div className="flex items-center">
                    <span className={`h-2 w-2 rounded-full ${getStatusDot(request.status)} mr-2`}></span>
                    <span className={`text-sm ${getStatusColor(request.status)}`}>{request.status}</span>
                </div>
            </td>
            <td className="py-3 px-2">

            </td>
        </tr>
    );
};

const RecentRequests: React.FC = () => {
    const requests: RequestData[] = [
        {
            id: '#1440',
            tutorName: 'Robert Brown',
            university: 'Dhaka University',
            subject: 'English for Today (HSC)',
            period: '3 Month',
            status: 'Accepted',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        {
            id: '#1440',
            tutorName: 'Wade Warren',
            university: 'Dhaka University',
            subject: 'English for Today (HSC)',
            period: '3 Month',
            status: 'Rejected',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        {
            id: '#1440',
            tutorName: 'Dianne Russell',
            university: 'Dhaka University',
            subject: 'English for Today (HSC)',
            period: '3 Month',
            status: 'Pending',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        },
        {
            id: '#1440',
            tutorName: 'Annette Black',
            university: 'Dhaka University',
            subject: 'English for Today (HSC)',
            period: '3 Month',
            status: 'Accepted',
            avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
        },
        {
            id: '#1440',
            tutorName: 'Ralph Edwards',
            university: 'Dhaka University',
            subject: 'English for Today (HSC)',
            period: '3 Month',
            status: 'Pending',
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        },
        {
            id: '#1440',
            tutorName: 'Esther Howard',
            university: 'Dhaka University',
            subject: 'English for Today (HSC)',
            period: '3 Month',
            status: 'Accepted',
            avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        },
        {
            id: '#1440',
            tutorName: 'Dianne Russell',
            university: 'Dhaka University',
            subject: 'English for Today (HSC)',
            period: '3 Month',
            status: 'Accepted',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        },
    ];

    return (
        <div className="bg-white p-4 rounded-md shadow-none border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Recent Request</h2>
                <Button className="text-sm text-tuitionwave-blue hover:underline text-white">View All</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                            <th className="py-2 px-2">Req. ID</th>
                            <th className="py-2 px-2">Tutor Name</th>
                            <th className="py-2 px-2">Subject</th>
                            <th className="py-2 px-2">Tuition Period</th>
                            <th className="py-2 px-2">Status</th>
                            <th className="py-2 px-2">Others</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request, index) => (
                            <RequestRow key={index} request={request} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentRequests;