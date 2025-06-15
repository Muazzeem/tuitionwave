import React, { useEffect, useState, FC } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
}

const DetailItem: FC<DetailItemProps> = ({ label, value }) => {
  return (
    <div className="flex items-center gap-2">
      <dt className="font-medium text-gray-600 dark:text-gray-300 w-32 md:w-40">
        {label}:
      </dt>
      <dd className="text-gray-900 dark:text-gray-200">
        {value !== undefined && value !== null ? value : "N/A"}
      </dd>
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
          setRequestDetails(data);
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

  const getBgColorClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'accepted':
      case 'accept':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'end':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">Loading request details...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900">
      <DashboardHeader userName={userProfile?.first_name || "User"} />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold uppercase dark:text-white">
            Request #{requestDetails?.uid?.slice(0, 8) || ""}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore all the tuition request from guardian
          </p>
          <Button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 mt-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="container">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-white-200 dark:border-gray-700">
            <div className="ml-auto flex mb-3 justify-between h-7">
              <span className={`${getBgColorClass(requestDetails?.status_display)} px-3 py-1 rounded-lg text-sm font-medium`}>
                {requestDetails?.status_display}
              </span>
              <Link to={`/tutor/${requestDetails?.tutor?.uid}`} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="w-[150px] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700">
                  Tutor Profile
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <DetailItem
                  label="Student Class"
                  value={requestDetails?.student_class || "N/A"}
                />
                <DetailItem
                  label="Institution"
                  value={requestDetails?.student_institution}
                />
                <DetailItem
                  label="Subject"
                  value={requestDetails?.subjects
                    ?.map((s) => s.subject)
                    .join(", ")}
                />
                <DetailItem
                  label="Department"
                  value={requestDetails?.student_department || "N/A"}
                />
                <DetailItem
                  label="Gender"
                  value={requestDetails?.student_gender}
                />
              </div>
              <div className="space-y-4">
                <DetailItem
                  label="Area"
                  value={requestDetails?.student_area?.name || "N/A"}
                />
                <DetailItem
                  label="Tuition Type"
                  value={requestDetails?.tuition_type}
                />
                <DetailItem
                  label="Tuition Members"
                  value={requestDetails?.family_members}
                />
                <DetailItem
                  label="Preferred Days"
                  value={requestDetails?.active_days
                    ?.map((d) => d.day)
                    .join(", ")}
                />
                <DetailItem
                  label="Tuition Fee"
                  value={requestDetails?.proposed_salary}
                />
              </div>
            </div>

            {showRejection && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium dark:text-white">
                  Details About Rejection
                </h3>
                <Textarea
                  placeholder="Write about rejection of the request"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[120px] dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRejection(false)}
                    className="dark:border-gray-600 dark:text-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button onClick={confirmReject}>Submit</Button>
                </div>
              </div>
            )}

            <div>
              {userProfile?.user_type === "GUARDIAN" ? (
                <div className="mt-6 flex justify-end gap-4">
                  {requestDetails?.status_display === "Pending" ? (
                    <Button
                      variant="outline"
                      className="w-[200px] bg-red-600 hover:bg-red-700 text-white font-medium py-3 hover:text-white"
                      onClick={handleDelete}
                    >
                      Delete Request
                    </Button>
                  ) : requestDetails?.status_display === "Rejected" ? (
                    <Button
                      disabled
                      className="w-[200px] bg-red-700 text-white font-medium py-3 cursor-not-allowed"
                    >
                      Request Rejected
                    </Button>
                  ) : requestDetails?.status_display === "Completed" ? (
                    <Button
                      className="w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                      onClick={handleWriteReview}
                    >
                      Write a Review
                    </Button>
                  ) : (
                    <Button
                      className="w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                      onClick={handleSendMessage}
                      disabled={requestDetails?.status_display !== "Accepted"}
                    >
                      {requestDetails?.status_display === "Accepted"
                        ? "Send Message"
                        : "Waiting for Response"}
                    </Button>
                  )}
                </div>
              ) : (
                /* TEACHER actions */
                !showRejection && (
                  <div className="mt-6 flex justify-end gap-4">
                    {requestDetails?.status_display === "Pending" && (
                      <>
                        <Button
                          variant="outline"
                          className="w-[200px] dark:border-gray-600 dark:text-gray-200"
                          onClick={handleReject}
                        >
                          Reject
                        </Button>
                        <Button
                          className="w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                          onClick={handleAccept}
                        >
                          Accept
                        </Button>
                      </>
                    )}

                    {requestDetails?.status_display === "Accepted" && (
                      <Button
                        className="w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                        onClick={handleSendMessage}
                      >
                        Send Message
                      </Button>
                    )}

                    {requestDetails?.status_display === "Completed" && (
                      <Button
                        disabled
                        className="w-[200px] bg-green-600 text-white font-medium py-3 opacity-75 cursor-not-allowed"
                      >
                        Completed
                      </Button>
                    )}

                    {requestDetails?.status_display === "Rejected" && (
                      <Button
                        disabled
                        variant="outline"
                        className="w-[200px] bg-red-600 hover:bg-red-700 text-white font-medium py-3 opacity-75 cursor-not-allowed"
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
