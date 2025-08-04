import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { getAccessToken } from "@/utils/auth";
import { ContractResponse, Contract } from "@/types/contract";
import { useToast } from "@/hooks/use-toast";
import { useConfirmationDialog } from "@/components/useConfirmationDialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Eye, Pen, Trash2 } from "lucide-react";

import { RequestRowProps } from "@/types/common";
import { useAuth } from "@/contexts/AuthContext";


const getUserTypeFromUrl = (pathname: string): string => {
  const segments = pathname.split('/');
  const dashboardIndex = segments.findIndex(segment => segment === 'dashboard');
  
  if (dashboardIndex !== -1 && segments[dashboardIndex + 1]) {
    const userType = segments[dashboardIndex + 1];
    return userType.toUpperCase();
  }
  
  return 'GUARDIAN';
};

const RequestRow: React.FC<RequestRowProps> = ({
  request,
  showConfirmationDialog,
}) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Extract user type from URL
  const userTypeFromUrl = getUserTypeFromUrl(location.pathname);

  const deleteContractMutation = useMutation({
    mutationFn: async (contractUid: string) => {
      const accessToken = getAccessToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contracts/${contractUid}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to delete contract");
      }
    },
    onSuccess: () => {
      toast({
        title: "Request Deleted",
        description: "The tuition request has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete the request: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDetailsClick = () => {
    navigate(`/${userTypeFromUrl.toLowerCase()}/requests/${request.uid}`);
  };

  const handleDeleteClick = () => {
    showConfirmationDialog({
      title: "Delete Request",
      description: "Are you sure you want to delete this tuition request?",
      onConfirm: () => deleteContractMutation.mutate(request.uid),
      variant: "cancel",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "text-tuitionwave-green";
      case "rejected":
        return "text-tuitionwave-red";
      case "pending":
        return "text-tuitionwave-yellow";
      case "completed":
        return "text-tuitionwave-green";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-tuitionwave-green";
      case "rejected":
        return "bg-tuitionwave-red";
      case "pending":
        return "bg-tuitionwave-yellow";
      case "completed":
        return "bg-tuitionwave-green";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <tr className="border-b border-gray-100 dark:border-gray-700">
      <td className="font-medium text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 uppercase dark:text-white" onClick={() => handleDetailsClick()}>
        #{request.uid.slice(0, 8)}
      </td>
      <td className="py-3 px-2">
        {userTypeFromUrl === 'GUARDIAN' && (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
            <img
              src={request.tutor.profile_picture}
              alt={`${request.tutor.institute?.name}`}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div>
            <p className="text-sm font-medium dark:text-white">{request.tutor.full_name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {request.tutor.institute?.name}
            </p>
          </div>
        </div>
        )}
        {userTypeFromUrl === 'TEACHER' && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
              <img
                src={request.guardian.profile_picture}
                alt={`${request.guardian.first_name}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium dark:text-white">{request.guardian.first_name} {request.guardian.last_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {request.guardian.email}
              </p>
            </div>
          </div>
        )}
      </td>
      <td className="py-3 px-2 text-sm dark:text-gray-300">
        {request.subjects.map((s) => s.subject).join(", ")}
      </td>
      {/* <td className="py-3 px-2 text-sm dark:text-gray-300">{request.contract_duration} Month</td> */}
      <td className="py-3 px-2 text-sm dark:text-gray-300">৳{request.proposed_salary}</td>
      <td className="py-3 px-2">
        <div className="flex items-center">
          <span
            className={`h-2 w-2 rounded-full ${getStatusDot(
              request.status_display
            )} mr-2`}
          />
          <span className={`text-sm ${getStatusColor(request.status_display)}`}>
            {request.status_display}
          </span>
        </div>
      </td>
      <td className="py-3 px-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg
                className="h-4 w-4 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 dark:bg-gray-800">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleDetailsClick}
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>View</span>
              </DropdownMenuItem>
              {request.status_display === "Pending" && (
                <DropdownMenuItem>
                  <Pen className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            {request.status_display === "Pending" && (
              <DropdownMenuItem
                className="cursor-pointer text-red-500"
                onClick={handleDeleteClick}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Request</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

const RecentRequests: React.FC = () => {
  const { userProfile } = useAuth();
  const location = useLocation();
  const { Confirmation: ConfirmationComponent, showConfirmationDialog } =
    useConfirmationDialog();

  // Extract user type from URL
  const userTypeFromUrl = getUserTypeFromUrl(location.pathname);

  const { data, isLoading, error } = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const accessToken = getAccessToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contracts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch contracts");
      }
      return response.json() as Promise<ContractResponse>;
    },
  });

  if (isLoading) {
    return <div className="dark:text-white">Loading...</div>;
  }

  if (error) {
    return <div className="dark:text-white">Error loading requests</div>;
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold dark:text-white">Recent Request</h2>
        <Link to={`/requests`}>
          <Button className="text-sm text-tuitionwave-blue hover:underline text-white">
            View All
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 px-2">Req. ID</th>
              {userTypeFromUrl === 'GUARDIAN' && (
                <th className="py-2 px-2">Tutor</th>
              )}
              {userTypeFromUrl === 'TEACHER' && (
                <th className="py-2 px-2">Guardian</th>
              )}
              <th className="py-2 px-2">Subject</th>
              <th className="py-2 px-2">Requested Amount</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Others</th>
            </tr>
          </thead>
          <tbody>
            {data?.results.map((request) => (
              <RequestRow
                key={request.uid}
                request={request}
                showConfirmationDialog={showConfirmationDialog}
              />
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationComponent />
    </div>
  );
};

export default RecentRequests;