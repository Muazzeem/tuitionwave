import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface TuitionRequest {
    id: string;
    institution: string;
    studentClass: string;
    subjects: string[];
    area: string;
    tuitionType: 'Home' | 'Online';
    status: 'Accepted' | 'Rejected' | 'Pending';
}

const MyRequest: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    
    // Dummy data - replace with API call later
    const requests: TuitionRequest[] = [
        {
            id: '#1440',
            institution: 'Dhaka Residential Model School',
            studentClass: 'Class IV',
            subjects: ['Bangla', 'English', 'Math'],
            area: 'Mirpur 1',
            tuitionType: 'Home',
            status: 'Accepted',
        },
        {
            id: '#1440',
            institution: 'Dhaka Residential Model School',
            studentClass: 'Class IV',
            subjects: ['Bangla', 'English', 'Math'],
            area: 'Mirpur 1',
            tuitionType: 'Online',
            status: 'Rejected',
        },
        // ... keep more dummy data with the same structure
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'text-green-500';
            case 'Rejected':
                return 'text-red-500';
            case 'Pending':
                return 'text-yellow-500';
            default:
                return '';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-500';
            case 'Rejected':
                return 'bg-red-500';
            case 'Pending':
                return 'bg-yellow-500';
            default:
                return '';
        }
    };

    const handleRequestClick = (requestId: string) => {
        navigate(`/my-request/${requestId}`);
    };

    return (
        <div className="flex-1 overflow-auto bg-gray-50">
            <DashboardHeader userName="John" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">My Tuition Request</h1>
                    <p className="text-gray-600">Explore all the tuition request from guardian</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">All Tuition Request</h2>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-[300px]"
                                    />
                                </div>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Req. ID</TableHead>
                                        <TableHead>Institution</TableHead>
                                        <TableHead>Student Class</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Area</TableHead>
                                        <TableHead>Tuition Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Others</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((request, index) => (
                                        <TableRow key={index}>
                                            <TableCell 
                                                className="font-medium cursor-pointer hover:text-blue-600"
                                                onClick={() => handleRequestClick(request.id)}
                                            >
                                                {request.id}
                                            </TableCell>
                                            <TableCell>{request.institution}</TableCell>
                                            <TableCell>{request.studentClass}</TableCell>
                                            <TableCell>{request.subjects.join(', ')}</TableCell>
                                            <TableCell>{request.area}</TableCell>
                                            <TableCell>{request.tuitionType}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${getStatusDot(request.status)}`} />
                                                    <span className={getStatusColor(request.status)}>{request.status}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                                    </svg>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">2</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#" isActive>3</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">4</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext href="#" />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRequest;
