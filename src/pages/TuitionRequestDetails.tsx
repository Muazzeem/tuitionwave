
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import DashboardHeader from '@/components/DashboardHeader';
import { useToast } from '@/hooks/use-toast';

interface DetailItemProps {
    label: string;
    value: string | number;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
    <div className="py-2">
        <dt className="text-gray-600">{label}:</dt>
        <dd className="font-medium text-gray-900">{value}</dd>
    </div>
);

const TuitionRequestDetails: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { id } = useParams();
    const [showRejection, setShowRejection] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    // In a real app, you would fetch this data based on the ID
    const requestDetails = {
        id: '#12145',
        studentClass: 'IX',
        institution: 'Dhaka Residential Model School',
        subject: 'Bangla, English, Math',
        department: 'Science',
        gender: 'Male',
        area: 'Mirpur 1',
        tuitionType: 'Home',
        tuitionMembers: 'Single',
        preferredDays: 'Sat, Mon, Tues(3 Days)',
        payment: '5000 BDT'
    };

    const handleBack = () => {
        navigate('/my-request');
    };

    const handleReject = () => {
        setShowRejection(true);
    };

    const handleAccept = () => {
        toast({
            title: "Request Accepted",
            description: "The tuition request has been accepted successfully."
        });
        navigate('/my-request');
    };

    const handleSubmitRejection = () => {
        if (!rejectionReason.trim()) {
            toast({
                title: "Error",
                description: "Please provide a reason for rejection.",
                variant: "destructive"
            });
            return;
        }

        toast({
            title: "Request Rejected",
            description: "The tuition request has been rejected successfully."
        });
        navigate('/my-request');
    };

    return (
        <div className="flex-1 overflow-auto bg-gray-50">
            <DashboardHeader userName="John" />

            <div className="p-6">
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </button>
                    <h1 className="text-2xl font-bold">Request {requestDetails.id}</h1>
                    <p className="text-gray-600">Explore all the tuition request from guardian</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <DetailItem label="Student Class" value={requestDetails.studentClass} />
                            <DetailItem label="Institution" value={requestDetails.institution} />
                            <DetailItem label="Subject" value={requestDetails.subject} />
                            <DetailItem label="Department" value={requestDetails.department} />
                            <DetailItem label="Gender" value={requestDetails.gender} />
                        </div>
                        <div className="space-y-4">
                            <DetailItem label="Area" value={requestDetails.area} />
                            <DetailItem label="Tuition Type" value={requestDetails.tuitionType} />
                            <DetailItem label="Tuition Members" value={requestDetails.tuitionMembers} />
                            <DetailItem label="Preferred Days" value={requestDetails.preferredDays} />
                            <DetailItem label="Payment" value={requestDetails.payment} />
                        </div>
                    </div>

                    {showRejection && (
                        <div className="mt-6 space-y-4">
                            <h3 className="text-lg font-medium">Details About Rejection</h3>
                            <Textarea
                                placeholder="Write about rejection of the request"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="min-h-[120px]"
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleSubmitRejection}>Submit</Button>
                            </div>
                        </div>
                    )}

                    {!showRejection && (
                        <div className="mt-6 flex justify-end gap-4">
                            <Button
                                variant="outline"
                                className="w-[200px]"
                                onClick={handleReject}
                            >
                                Reject
                            </Button>
                            <Button 
                                className="w-[200px]"
                                onClick={handleAccept}
                            >
                                Accept
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TuitionRequestDetails;
