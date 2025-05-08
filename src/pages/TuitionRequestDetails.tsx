
import React, { useEffect, useState, FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DashboardHeader from "@/components/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { Contract, ContractResponse } from "@/types/contract";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirmationDialog } from "@/components/useConfirmationDialog";

interface DetailItemProps {
  label: string;
  value: string | number | undefined | null;
}

const DetailItem: FC<DetailItemProps> = ({ label, value }) => {
  return (
    <div className="flex items-center gap-2">
      <dt className="font-medium text-gray-600 dark:text-gray-400 w-32 md:w-40">{label}:</dt>
      <dd className="text-gray-900 dark:text-gray-200">{value !== undefined && value !== null ? value : "N/A"}</dd>
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
  const { showConfirmationDialog, Confirmation: ConfirmationComponent } = useConfirmationDialog();

  useEffect(() => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (id) {
      fetch(`http://127.0.0.1:8000/api/contracts/${id}`, {
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

  const handleBack = () => {
    navigate("/all-requests");
  };

  const handleDelete = () => {
    showConfirmationDialog({
      title: "Cancel Request",
      description: "Are you sure to cancel this request? This action cannot be undone, so please confirm your decision.",
      onConfirm: confirmDelete,
      variant: "cancel",
    });
  };

  const confirmDelete = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (id) {
      fetch(`http://127.0.0.1:8000/api/contracts/${id}/`, {
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
          navigate("/all-requests");
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
    const accessToken = localStorage.getItem("accessToken");

    if (id) {
      fetch(`http://127.0.0.1:8000/api/contracts/${id}/confirm/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(() => {
          toast({
            title: "Request Accepted",
            description: "The tuition request has been accepted successfully.",
          });
          navigate("/all-requests");
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
    showConfirmationDialog({
      title: "Reject Request",
      description: "Are you sure you want to reject this tuition request? Please confirm your decision.",
      onConfirm: confirmReject,
      variant: "reject",
    });
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

    const accessToken = localStorage.getItem("accessToken");

    if (id) {
      fetch(`http://127.0.0.1:8000/api/contracts/${id}/reject/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setRequestDetails(data);
          toast({
            title: "Request Rejected",
            description: "The tuition request has been rejected successfully.",
          });
          navigate("/all-requests");
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
    navigate("/message");
  };

  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900">
      <DashboardHeader userName={userProfile?.first_name || 'User'} />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold uppercase dark:text-white">
            Request #{requestDetails?.uid.slice(0, 8)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore all the tuition request from guardian
          </p>
          <Button
            onClick={handleBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 mt-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="container">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-white-200 dark:border-gray-700">
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
                    .map((s) => s.subject)
                    .join(", ")}
                />
                <DetailItem
                  label="Department"
                  value={requestDetails?.student_department}
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
                    .map((d) => d.day)
                    .join(", ")}
                />
                <DetailItem
                  label="Payment"
                  value={requestDetails?.proposed_salary}
                />
              </div>
            </div>

            {showRejection && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium dark:text-white">Details About Rejection</h3>
                <Textarea
                  placeholder="Write about rejection of the request"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[120px] dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <div className="flex justify-end">
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

                    {requestDetails?.status_display === "Rejected" && (
                      <Button
                        disabled
                        variant="outline"
                        className="w-[200px] bg-red-600 hover:bg-red-700 text-white font-medium py-3 opacity-75"
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
      <ConfirmationComponent /> {/* Render the ConfirmationComponent here */}
    </div>
  );
};

export default TuitionRequestDetails;
