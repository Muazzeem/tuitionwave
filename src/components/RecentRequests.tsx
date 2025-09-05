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
import { Eye, Pen, Trash2, MoreVertical, User } from "lucide-react";

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
        return "text-emerald-400";
      case "rejected":
        return "text-red-400";
      case "pending":
        return "text-amber-400";
      case "completed":
        return "text-emerald-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-emerald-400";
      case "rejected":
        return "bg-red-400";
      case "pending":
        return "bg-amber-400";
      case "completed":
        return "bg-emerald-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-emerald-400/10 border-emerald-400/20";
      case "rejected":
        return "bg-red-400/10 border-red-400/20";
      case "pending":
        return "bg-amber-400/10 border-amber-400/20";
      case "completed":
        return "bg-emerald-400/10 border-emerald-400/20";
      default:
        return "bg-gray-400/10 border-gray-400/20";
    }
  };

  // Mobile Card Layout
  const MobileCard = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 space-y-4 hover:bg-gray-800/70 transition-all duration-200">
      {/* Header with ID and Actions */}
      <div className="flex items-center justify-between">
        <div
          className="font-mono text-sm font-semibold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
          onClick={handleDetailsClick}
        >
          #{request.uid.slice(0, 8)}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-300"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
            <DropdownMenuLabel className="text-gray-200">Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer text-gray-200 hover:bg-gray-700 focus:bg-gray-700"
                onClick={handleDetailsClick}
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              {request.status_display === "Pending" && (
                <DropdownMenuItem className="cursor-pointer text-gray-200 hover:bg-gray-700 focus:bg-gray-700">
                  <Pen className="mr-2 h-4 w-4" />
                  <span>Edit Request</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            {request.status_display === "Pending" && (
              <>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Request</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
            {(userTypeFromUrl === 'GUARDIAN' ? request.tutor.profile_picture : request.guardian.profile_picture) ? (
              <img
                src={userTypeFromUrl === 'GUARDIAN' ? request.tutor.profile_picture : request.guardian.profile_picture}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {userTypeFromUrl === 'GUARDIAN'
              ? request.tutor.full_name
              : `${request.guardian.first_name} ${request.guardian.last_name}`
            }
          </p>
          <p className="text-xs text-gray-400 truncate">
            {userTypeFromUrl === 'GUARDIAN'
              ? request.tutor.institute?.name || 'No institute'
              : request.guardian.email
            }
          </p>
        </div>
      </div>

      {/* Subjects */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Subjects</p>
        <div className="flex flex-wrap gap-1">
          {request.subjects.map((subject, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
            >
              {subject.subject}
            </span>
          ))}
        </div>
      </div>

      {/* Amount and Status */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Amount</p>
          <p className="text-lg font-bold text-white">৳{request.proposed_salary}</p>
        </div>
        <div className={`px-3 py-2 rounded-lg border ${getStatusBg(request.status_display)}`}>
          <div className="flex items-center space-x-2">
            <span className={`h-2 w-2 rounded-full ${getStatusDot(request.status_display)}`} />
            <span className={`text-sm font-medium ${getStatusColor(request.status_display)}`}>
              {request.status_display}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Table Row
  const DesktopRow = () => (
    <>
      {/* Mobile Card */}
      <div className="block lg:hidden">
        <MobileCard />
      </div>

      {/* Desktop Row */}
      <tr className="hidden lg:table-row border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors duration-200">
        <td className="py-4 px-3">
          <span
            className="font-mono text-sm font-semibold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors uppercase"
            onClick={handleDetailsClick}
          >
            #{request.uid.slice(0, 8)}
          </span>
        </td>
        <td className="py-4 px-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                {(userTypeFromUrl === "GUARDIAN" ? request.tutor.profile_picture : request.guardian.profile_picture) ? (
                  <img
                    src={userTypeFromUrl === "GUARDIAN" ? request.tutor.profile_picture : request.guardian.profile_picture}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {userTypeFromUrl === "GUARDIAN"
                  ? request.tutor.full_name
                  : `${request.guardian.first_name} ${request.guardian.last_name}`}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {userTypeFromUrl === "GUARDIAN"
                  ? request.tutor.institute?.name || "No institute"
                  : request.guardian.email}
              </p>
            </div>
          </div>
        </td>
        <td className="py-4 px-3">
          <div className="flex flex-wrap gap-1 max-w-xs">
            {request.subjects.slice(0, 2).map((subject, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
              >
                {subject.subject}
              </span>
            ))}
            {request.subjects.length > 2 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                +{request.subjects.length - 2}
              </span>
            )}
          </div>
        </td>
        <td className="py-4 px-3">
          <span className="text-sm font-semibold text-white">৳{request.proposed_salary}</span>
        </td>
        <td className="py-4 px-3">
          <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getStatusBg(request.status_display)}`}>
            <span className={`h-2 w-2 rounded-full ${getStatusDot(request.status_display)} mr-2`} />
            <span className={`text-xs font-medium ${getStatusColor(request.status_display)}`}>
              {request.status_display}
            </span>
          </div>
        </td>
        <td className="py-4 px-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-300"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
              <DropdownMenuLabel className="text-gray-200">Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer text-gray-200 hover:bg-gray-700 focus:bg-gray-700"
                  onClick={handleDetailsClick}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View Details</span>
                </DropdownMenuItem>
                {request.status_display === "Pending" && (
                  <DropdownMenuItem className="cursor-pointer text-gray-200 hover:bg-gray-700 focus:bg-gray-700">
                    <Pen className="mr-2 h-4 w-4" />
                    <span>Edit Request</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              {request.status_display === "Pending" && (
                <>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Request</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    </>
  )

  return (
    <>
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <MobileCard />
      </div>
      {/* Desktop Layout */}
      <div className="hidden lg:table-row">
        <DesktopRow />
      </div>
    </>
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
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-700 rounded w-32"></div>
            <div className="h-8 bg-gray-700 rounded w-20"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-800/50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 text-red-400">
          <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-xs">!</span>
          </div>
          <span className="text-sm font-medium">Error loading requests</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-xl">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <h2 className="text-xl font-bold text-white">Recent Requests</h2>
          <Link to="/requests">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-colors"
            >
              View All Requests
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {!data?.results?.length ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No Requests Found</h3>
            <p className="text-gray-500">You don't have any tuition requests yet.</p>
          </div>
        ) : (
          <>
            {/* Mobile Layout */}
            <div className="block lg:hidden space-y-4">
              {data.results.map((request) => (
                <RequestRow
                  key={request.uid}
                  request={request}
                  showConfirmationDialog={showConfirmationDialog}
                />
              ))}
            </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-700/30">
                        <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Request ID
                        </th>
                        <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          {userTypeFromUrl === 'GUARDIAN' ? 'Tutor' : 'Guardian'}
                        </th>
                        <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Subjects
                        </th>
                        <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.results.map((request) => (
                        <RequestRow
                          key={request.uid}
                          request={request}
                          showConfirmationDialog={showConfirmationDialog}
                        />
                      ))}
                    </tbody>
                  </table>
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmationComponent />
    </div>
  );
};

export default RecentRequests;