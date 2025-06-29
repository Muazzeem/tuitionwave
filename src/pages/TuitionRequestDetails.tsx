import React, { useEffect, useState, FC } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, BookOpen, Clock, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DashboardHeader from "@/components/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { Contract } from "@/types/contract";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirmationDialog } from "@/components/useConfirmationDialog";
import ReviewModal from "@/components/ReviewModal";
import { getAccessToken } from "@/utils/auth";

interface DetailItemProps {
  label: string;
  value: string | number | undefined | null;
  icon?: React.ReactNode;
}

const DetailItem: FC<DetailItemProps> = ({ label, value, icon }) => {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="flex-1 min-w-0">
        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </dt>
        <dd className="text-base text-gray-900 dark:text-gray-100 break-words">
          {value !== undefined && value !== null ? value : "Not specified"}
        </dd>
      </div>
    </div>
  );
};

const TuitionRequestDetails: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [showRejection, setShowRejection] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [requestDetails, setRequestDetails] = useState<Contract | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const { showConfirmationDialog, Confirmation: ConfirmationComponent } =
    useConfirmationDialog();

  useEffect(() => {
    setLoading(true);
    const accessToken = getAccessToken();

    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/contracts/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setRequestDetails(data))
        .catch((error) => console.error("Error fetching tutor details:", error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = () => {
    showConfirmationDialog({
      title: "Cancel Request",
      description:
        "Are you sure to cancel this request? This action cannot be undone, so please confirm your decision.",
      onConfirm: confirmDelete,
      variant: "cancel",
    });
  };

  const confirmDelete = () => {
    const accessToken = getAccessToken();

    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/contracts/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(() => {
          toast({
            title: "Request Deleted",
            description: "The tuition request has been deleted successfully.",
          });
          navigate(`/${userProfile.user_type.toLocaleLowerCase()}/requests`);
        })
        .catch((error) => {
          console.error("Error deleting request:", error);
          toast({
            title: "Error",
            description: "Failed to delete the request.",
            variant: "destructive",
          });
        });
    }
  };

  const handleAccept = () => {
    showConfirmationDialog({
      title: "Accept Request",
      description: "Are you sure you want to accept this tuition request?",
      onConfirm: confirmAccept,
      variant: "approve",
    });
  };

  const confirmAccept = () => {
    const accessToken = getAccessToken();

    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/contracts/${id}/confirm/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setRequestDetails(prev => prev ? {...prev, status_display: 'Accepted'} : null);
          toast({
            title: "Request Accepted",
            description: "The tuition request has been accepted successfully.",
          });
        })
        .catch((error) => {
          console.error("Error accepting request:", error);
          toast({
            title: "Error",
            description: "Failed to accept the request.",
            variant: "destructive",
          });
        });
    }
  };

  const handleReject = () => {
    setShowRejection(true);
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    const accessToken = getAccessToken();

    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/contracts/${id}/reject/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason: rejectionReason })
      })
        .then((response) => response.json())
        .then((data) => {
          setRequestDetails(data);
          setShowRejection(false);
          setRejectionReason("");
          toast({
            title: "Request Rejected",
            description: "The tuition request has been rejected successfully.",
          });
        })
        .catch((error) => {
          console.error("Error rejecting request:", error);
          toast({
            title: "Error",
            description: "Failed to reject the request.",
            variant: "destructive",
          });
        });
    }
  };

  const handleSendMessage = () => {
    if (userProfile?.user_type === 'TEACHER') {
      navigate(`/message/?friend=${requestDetails.guardian.uid}`);
    } else {
      navigate(`/message/?friend=${requestDetails.tutor.uid}`);
    }
  };

  const handleWriteReview = () => {
    setIsReviewModalOpen(true);
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { 
          variant: 'secondary' as const, 
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
        };
      case 'rejected':
        return { 
          variant: 'destructive' as const, 
          className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
          icon: null
        };
      case 'accepted':
      case 'accept':
      case 'approved':
        return { 
          variant: 'default' as const, 
          className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
          icon: null
        };
      case 'completed':
        return { 
          variant: 'default' as const, 
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
        };
      case 'end':
        return { 
          variant: 'secondary' as const, 
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
          icon: null
        };
      default:
        return { 
          variant: 'outline' as const, 
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
          icon: null
        };
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!requestDetails) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">Request not found</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(requestDetails?.status_display);

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <DashboardHeader userName={userProfile?.first_name || "User"} />
      
      <div className="mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <Button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 mt-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Request #{requestDetails?.uid?.slice(0, 8) || ""}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Tuition request details and management
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`${statusConfig.className} px-3 py-1 rounded-lg text-sm font-medium`}>
                {statusConfig.icon}
                {requestDetails?.status_display}
              </span>
              
              {userProfile?.user_type === 'GUARDIAN' && requestDetails?.tutor && (
                <Link to={`/private-profile/tutor/${requestDetails?.tutor?.uid}`}>
                  <Button variant="outline" size="sm">
                    View Tutor Profile
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Student Information */}
          <Card className="xl:col-span-2 shadow-none border-0 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <DetailItem
                  label="Class"
                  value={requestDetails?.student_class}
                />
                <DetailItem
                  label="Institution"
                  value={requestDetails?.student_institution}
                />
                <DetailItem
                  label="Department"
                  value={requestDetails?.student_department}
                />
                <DetailItem
                  label="Gender"
                  value={requestDetails?.student_gender}
                />
                <DetailItem
                  label="Version"
                  value={requestDetails?.version_bangla_english}
                />
                <DetailItem
                  label="Subjects"
                  value={requestDetails?.subjects?.map((s) => s.subject).join(", ")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Schedule */}
          <Card className="shadow-none border-0 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Location & Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem
                label="Location"
                value={
                  requestDetails?.student_upazila?.name
                    ? `${requestDetails.student_upazila.name}, ${requestDetails.student_upazila.district.name}`
                    : "Not specified"
                }
                icon={<MapPin className="h-4 w-4" />}
              />
              <DetailItem
                label="Area"
                value={requestDetails?.student_area?.name}
              />
              <DetailItem
                label="Tuition Type"
                value={requestDetails?.tuition_type}
              />
              {(requestDetails?.tuition_type === 'HOME' || requestDetails?.tuition_type === 'BOTH') && (
                <DetailItem
                  label="Address"
                  value={requestDetails?.student_address}
                />
              )}
              <DetailItem
                label="Active Days"
                value={requestDetails?.active_days?.map((d) => d.day).join(", ")}
              />
            </CardContent>
          </Card>

          {/* Tuition Details */}
          <Card className="xl:col-span-3 shadow-none border-0 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                Tuition Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DetailItem
                  label="Family Members"
                  value={requestDetails?.family_members}
                />
                <DetailItem
                  label="Proposed Salary"
                  value={requestDetails?.proposed_salary ? `৳${requestDetails.proposed_salary}` : "Not specified"}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rejection Form */}
        {showRejection && (
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-300">
                Rejection Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Please provide a detailed reason for rejecting this request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[120px] resize-none"
                rows={5}
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowRejection(false);
                    setRejectionReason("");
                  }}
                  className="sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmReject}
                  variant="destructive"
                  className="sm:w-auto"
                  disabled={!rejectionReason.trim()}
                >
                  Submit Rejection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {userProfile?.user_type === "GUARDIAN" ? (
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            {requestDetails?.status_display === "Pending" ? (
              <Button
                variant="destructive"
                className="sm:w-auto"
                onClick={handleDelete}
              >
                Delete Request
              </Button>
            ) : requestDetails?.status_display === "Rejected" ? (
              <Button
                disabled
                variant="destructive"
                className="sm:w-auto opacity-75 cursor-not-allowed"
              >
                Request Rejected
              </Button>
            ) : requestDetails?.status_display === "Completed" ? (
              <Button
                disabled
                className="sm:w-auto bg-blue-600 opacity-75 cursor-not-allowed"
              >
                Contract Ended
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSendMessage}
                  disabled={requestDetails?.status_display !== "Accepted"}
                  className="sm:w-auto flex items-center gap-2 text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  {requestDetails?.status_display === "Accepted"
                    ? "Send Message"
                    : "Waiting for Response"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleWriteReview}
                  className="sm:w-auto"
                >
                  End Contract
                </Button>
              </div>
            )}
          </div>
        ) : (
          !showRejection && (
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              {requestDetails?.status_display === "Pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    className="sm:w-auto"
                  >
                    Reject Request
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="sm:w-auto"
                  >
                    Accept Request
                  </Button>
                </>
              )}

              {requestDetails?.status_display === "Accepted" && (
                <Button
                  onClick={handleSendMessage}
                  className="sm:w-auto flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send Message
                </Button>
              )}

              {requestDetails?.status_display === "Completed" && (
                <Button
                  disabled
                  className="sm:w-auto bg-green-600 opacity-75 cursor-not-allowed"
                >
                  Completed
                </Button>
              )}

              {requestDetails?.status_display === "Rejected" && (
                <Button
                  disabled
                  variant="destructive"
                  className="sm:w-auto opacity-75 cursor-not-allowed"
                >
                  Already Rejected
                </Button>
              )}
            </div>
          )
        )}
      </div>

      <ConfirmationComponent />
      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        contractId={id || ""}
      />
    </div>
  );
};

export default TuitionRequestDetails;