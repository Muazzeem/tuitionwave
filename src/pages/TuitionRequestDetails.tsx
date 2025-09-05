import React, { useEffect, useState, FC } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, BookOpen, MessageCircle, Star, Home, School, User, Clock3, MapIcon, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/components/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { Contract } from "@/types/contract";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirmationDialog } from "@/components/useConfirmationDialog";
import ReviewModal from "@/components/ReviewModal";
import { getAccessToken } from "@/utils/auth";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DetailItemProps {
  label: string;
  value: string | number | undefined | null;
  icon?: React.ReactNode;
}

const DetailItem: FC<DetailItemProps> = ({ label, value, icon }) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
      {icon && (
        <div className="flex-shrink-0 p-2 rounded-md bg-gray-700 shadow-sm">
          <div className="text-gray-300">
            {icon}
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          {label}
        </dt>
        <dd className="text-sm font-semibold text-gray-100 break-words">
          {value !== undefined && value !== null ? value : (
            <span className="text-gray-400 dark:text-gray-500 font-normal">Not specified</span>
          )}
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
          setRequestDetails(prev => prev ? { ...prev, status_display: 'Accepted' } : null);
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
          className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-200 dark:border-amber-800',
        };
      case 'rejected':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border border-red-200 dark:border-red-800',
          icon: null
        };
      case 'accepted':
      case 'accept':
      case 'approved':
        return {
          variant: 'default' as const,
          className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800',
          icon: null
        };
      case 'completed':
        return {
          variant: 'default' as const,
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-200 dark:border-blue-800',
        };
      case 'end':
        return {
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-200 border border-gray-200 dark:border-gray-600',
          icon: null
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-200 border border-slate-200 dark:border-slate-600',
          icon: null
        };
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-800">
        <div className="text-center space-y-6 p-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 mx-auto animate-ping"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-100">Loading request details...</p>
            <p className="text-sm text-gray-400">Please wait while we fetch the information</p>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(requestDetails?.status_display);

  return (
    <div className="flex-1 overflow-auto bg-gray-900 min-h-screen">
      <DashboardHeader userName={userProfile?.first_name || "User"} />
      <ScrollArea type="always" style={{ height: "calc(100vh - 100px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Enhanced Header Section */}
          <div className="space-y-6">
            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              className="flex items-center text-gray-300 hover:text-gray-900 hover:text-white hover:bg-gray-800 transition-all duration-200 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-900/30">
                    <BookOpen className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                      Request #{requestDetails?.uid?.slice(0, 8) || ""}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      Tuition request details and management
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Badge className={`${statusConfig.className} px-4 py-2 text-sm font-medium shadow-sm`}>
                  {statusConfig.icon}
                  {requestDetails?.status_display}
                </Badge>

                {userProfile?.user_type === 'GUARDIAN' && requestDetails?.tutor && (
                  <Link to={`/private-profile/tutor/${requestDetails?.tutor?.uid}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Tutor Profile
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Student Information - Enhanced */}
            <Card className="lg:col-span-8 shadow-lg border-0 bg-background overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-b border-gray-100 border-gray-700">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 rounded-lg bg-blue-900/50">
                    <GraduationCap className="h-5 w-5 text-blue-400" />
                  </div>
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem
                    label="Class Level"
                    value={requestDetails?.student_class}
                    icon={<BookOpen className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Institution"
                    value={requestDetails?.student_institution}
                    icon={<School className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Department"
                    value={requestDetails?.student_department}
                    icon={<GraduationCap className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Student Gender"
                    value={requestDetails?.student_gender}
                    icon={<User className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Language Version"
                    value={requestDetails?.version_bangla_english}
                    icon={<BookOpen className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Subjects Required"
                    value={requestDetails?.subjects?.map((s) => s.subject).join(", ")}
                    icon={<BookOpen className="h-4 w-4" />}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location & Schedule - Enhanced */}
            <Card className="lg:col-span-4 shadow-lg border-0 bg-background overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-b border-gray-100 border-gray-700">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 rounded-lg bg-green-900/50">
                    <MapPin className="h-5 w-5 text-green-400" />
                  </div>
                  Location & Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <DetailItem
                  label="Location"
                  value={
                    requestDetails?.student_upazila?.name
                      ? `${requestDetails.student_upazila.name}, ${requestDetails.student_upazila.district.name}`
                      : "Not specified"
                  }
                  icon={<MapIcon className="h-4 w-4" />}
                />
                <DetailItem
                  label="Specific Area"
                  value={requestDetails?.student_area?.name}
                  icon={<MapPin className="h-4 w-4" />}
                />
                <DetailItem
                  label="Tuition Type"
                  value={requestDetails?.tuition_type}
                  icon={requestDetails?.tuition_type === 'HOME' ? <Home className="h-4 w-4" /> : <School className="h-4 w-4" />}
                />
                {(requestDetails?.tuition_type === 'HOME' || requestDetails?.tuition_type === 'BOTH') && (
                  <DetailItem
                    label="Home Address"
                    value={requestDetails?.student_address}
                    icon={<Home className="h-4 w-4" />}
                  />
                )}
                <DetailItem
                  label="Active Days"
                  value={requestDetails?.active_days?.map((d) => d.day).join(", ")}
                  icon={<Calendar className="h-4 w-4" />}
                />
              </CardContent>
            </Card>

            {/* Tuition Details - Enhanced */}
            <Card className="lg:col-span-12 shadow-lg border-0 bg-background overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-b border-gray-100 border-gray-700">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 rounded-lg bg-purple-900/50">
                    <DollarSign className="h-5 w-5 text-purple-400" />
                  </div>
                  Financial & Family Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DetailItem
                    label="Family Members"
                    value={requestDetails?.family_members}
                    icon={<Users className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Proposed Salary"
                    value={requestDetails?.proposed_salary ? `৳${requestDetails.proposed_salary}` : "Not specified"}
                    icon={<DollarSign className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Request Date"
                    value={requestDetails?.created_at ? new Date(requestDetails.created_at).toLocaleDateString() : "Not available"}
                    icon={<Clock3 className="h-4 w-4" />}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Rejection Form */}
          {showRejection && (
            <Card className="border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-b border-gray-100 border-gray-700">
                <CardTitle className="text-red-800 dark:text-red-300 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-200 dark:bg-red-900/50">
                    <MessageCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  Rejection Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reason for Rejection *
                  </label>
                  <Textarea
                    placeholder="Please provide a detailed and professional reason for rejecting this request. This will be shared with the student's guardian."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-[120px] resize-none bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:border-red-400 dark:focus:border-red-500 focus:ring-red-400 dark:focus:ring-red-500"
                    rows={5}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Minimum 10 characters required. Be respectful and constructive.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRejection(false);
                      setRejectionReason("");
                    }}
                    className="sm:w-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel Rejection
                  </Button>
                  <Button
                    onClick={confirmReject}
                    variant="destructive"
                    className="sm:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                    disabled={!rejectionReason.trim() || rejectionReason.length < 10}
                  >
                    Submit Rejection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Action Buttons */}
          <div className="pb-8">
            <div className="bg-background rounded-xl border-0 p-6">
              {userProfile?.user_type === "GUARDIAN" ? (
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                  {requestDetails?.status_display === "Pending" ? (
                    <Button
                      variant="destructive"
                      className="sm:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 shadow-lg"
                      onClick={handleDelete}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Delete Request
                    </Button>
                  ) : requestDetails?.status_display === "Rejected" ? (
                    <Button
                      disabled
                      variant="destructive"
                        className="sm:w-auto opacity-75 cursor-not-allowed bg-red-400 dark:bg-red-800"
                      >
                        Request Rejected
                      </Button>
                    ) : requestDetails?.status_display === "Completed" ? (
                      <Button
                        disabled
                          className="sm:w-auto bg-blue-600 opacity-75 cursor-not-allowed shadow-lg"
                        >
                          Contract Ended
                        </Button>
                      ) : (
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                              onClick={handleSendMessage}
                              disabled={requestDetails?.status_display !== "Accepted"}
                              className="sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white shadow-lg disabled:opacity-50"
                            >
                              <MessageCircle className="h-4 w-4" />
                              {requestDetails?.status_display === "Accepted"
                                ? "Send Message"
                                : "Waiting for Response"}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleWriteReview}
                              className="sm:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 shadow-lg"
                            >
                              <Star className="h-4 w-4 mr-2" />
                        End Contract
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                !showRejection && (
                    <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                      {requestDetails?.status_display === "Pending" && (
                        <>
                          <Button
                            variant="outline"
                            onClick={handleReject}
                            className="sm:w-auto bg-white dark:bg-gray-800 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-lg"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Reject Request
                          </Button>
                          <Button
                            onClick={handleAccept}
                            className="sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 shadow-lg"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Accept Request
                          </Button>
                        </>
                      )}

                      {requestDetails?.status_display === "Accepted" && (
                        <Button
                          onClick={handleSendMessage}
                          className="sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-lg"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Send Message
                        </Button>
                      )}

                      {requestDetails?.status_display === "Completed" && (
                        <Button
                          disabled
                          className="sm:w-auto bg-green-600 opacity-75 cursor-not-allowed shadow-lg"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      )}

                      {requestDetails?.status_display === "Rejected" && (
                        <Button
                          disabled
                          variant="destructive"
                        className="sm:w-auto opacity-75 cursor-not-allowed bg-red-400 dark:bg-red-800 shadow-lg"
                      >
                        Already Rejected
                      </Button>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <ConfirmationComponent />
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          contractId={id || ""}
        />
        <div className="pb-20"></div>
      </ScrollArea>
    </div>
  );
};

export default TuitionRequestDetails;