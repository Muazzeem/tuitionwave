import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Search, Filter, Eye, MoreVertical, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { getAccessToken } from "@/utils/auth";
import { ContractResponse, Contract } from "@/types/contract";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { set } from "date-fns";

const MyRequest: React.FC = () => {
  const { userProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get initial values from URL or use defaults
  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialSearch = searchParams.get("search") || "";
  const initialSubject = searchParams.get("subject") || "";
  const initialInstitution = searchParams.get("institution") || "";

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState(initialSearch);
  const [advancedSearch, setAdvancedSearch] = useState({
    subject: initialSubject,
    institution: initialInstitution,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  // Debounce search query with 2 second delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      if (searchQuery) {
        setIsSearching(true);
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    // reloadProfile();
  }, []);

  // Build the query string based on all filters
  const buildQueryString = useCallback(() => {
    let queryParams = `page=${currentPage}`;

    if (debouncedSearchQuery) {
      queryParams += `&institution=${encodeURIComponent(debouncedSearchQuery)}`;
    }

    if (advancedSearch.subject) {
      queryParams += `&subject=${encodeURIComponent(advancedSearch.subject)}`;
    }

    if (advancedSearch.institution) {
      queryParams += `&institution=${encodeURIComponent(
        advancedSearch.institution
      )}`;
    }

    return queryParams;
  }, [currentPage, debouncedSearchQuery, advancedSearch]);

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (currentPage > 1) newSearchParams.set("page", currentPage.toString());
    if (debouncedSearchQuery)
      newSearchParams.set("institution", debouncedSearchQuery);
    if (advancedSearch.subject)
      newSearchParams.set("subject", advancedSearch.subject);
    if (advancedSearch.institution)
      newSearchParams.set("institution", advancedSearch.institution);

    setSearchParams(newSearchParams);
  }, [currentPage, debouncedSearchQuery, advancedSearch, setSearchParams]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["contracts", currentPage, debouncedSearchQuery, advancedSearch],
    queryFn: async () => {
      const accessToken = getAccessToken();
      const queryString = buildQueryString();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contracts?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch contracts");
      }
      return response.json() as Promise<ContractResponse>;
    },
    refetchOnMount: true,
  });

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    setIsSearching(true);
    setDebouncedSearchQuery(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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

  const handleRequestClick = (requestId: string) => {
    if (window.location.pathname.includes('/teacher')) {
      navigate(`/teacher/requests/${requestId}`);
    } else {
      navigate(`/guardian/requests/${requestId}`);
    }
  };

  const handlePreviousPage = () => {
    if (data?.previous) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleAdvancedSearch = () => {
    const searchDialog = document.getElementById(
      "search-dialog"
    ) as HTMLDialogElement;
    if (searchDialog) {
      searchDialog.showModal();
    }
  };

  // Request Row Component for better organization
  const RequestRow = ({ request }: { request: Contract }) => {
    const userTypeFromUrl = userProfile?.user_type?.toLowerCase() === 'teacher' ? 'TEACHER' : 'GUARDIAN';

    // Mobile Card Layout
    const MobileCard = () => (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 space-y-4 hover:bg-gray-800/70 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div
            className="font-mono text-sm font-semibold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
            onClick={() => handleRequestClick(request.uid)}
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
                  onClick={() => handleRequestClick(request.uid)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View Details</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Institution and Class */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Institution & Class</p>
          <p className="text-sm font-medium text-white">{request.student_institution}</p>
          <p className="text-xs text-gray-400">Class: {request.student_class}</p>
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

        {/* Area and Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Area</p>
            <p className="text-sm font-medium text-white">{request.student_area?.name || "N/A"}</p>
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

    return (
      <>
        {/* Mobile Card */}
        <div className="lg:hidden">
          <MobileCard />
        </div>

        {/* Desktop Row */}
        <tr className="hidden lg:table-row border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors duration-200">
          <td className="py-4 px-3">
            <span
              className="font-mono text-sm font-semibold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors uppercase"
              onClick={() => handleRequestClick(request.uid)}
            >
              #{request.uid.slice(0, 8)}
            </span>
          </td>
          <td className="py-4 px-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{request.student_institution}</p>
              <p className="text-xs text-gray-400 truncate">Class: {request.student_class}</p>
            </div>
          </td>
          <td className="py-4 px-3">
            <span className="text-sm text-gray-300">{request.student_class}</span>
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
            <span className="text-sm text-gray-300">{request.student_area?.name || "N/A"}</span>
          </td>
          <td className="py-4 px-3">
            <span className="text-sm text-gray-300">{request.tuition_type}</span>
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
                    onClick={() => handleRequestClick(request.uid)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View Details</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        </tr>
      </>
    );
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-900 min-h-screen">
      <DashboardHeader userName="John" />

      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-white font-unbounded">Tuition Request</h1>
          <p className="text-sm sm:text-base text-gray-300">
            Explore all the tuition request from guardian
          </p>
        </div>

        <div className='bg-background border-gray-900 rounded-xl p-3'>
          {/* Header */}
          <div className="p-2 border-b border-gray-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-xl font-bold text-white"></h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search By Institute"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="pl-10 w-full sm:w-[250px] lg:w-[300px] bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <Button
                  variant="outline"
                  className="bg-transparent border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-colors hover:text-white text-xs"
                  onClick={
                    () => {
                      setIsOpen(true);
                    }
                  }
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-2">
            {isLoading ? (
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
            ) : error ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <span className="text-red-400">!</span>
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Error loading requests</h3>
              </div>
            ) : !data?.results?.length ? (
              <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8 text-gray-400" />
                </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No Requests Found</h3>
              </div>
            ) : (
                    <div className="bg-background md:bg-gray-900/50 backdrop-blur-sm rounded-xl">
                {/* Desktop Layout */}
                <div className="hidden lg:block">
                        <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full">
                            <thead className="bg-primary-600">
                        <tr className="border-b border-gray-700/30">
                                <th className="py-4 px-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Request ID
                          </th>
                                <th className="py-4 px-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Institution
                          </th>
                                <th className="py-4 px-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Class
                          </th>
                                <th className="py-4 px-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Subjects
                          </th>
                                <th className="py-4 px-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Area
                          </th>
                                <th className="py-4 px-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Type
                          </th>
                                <th className="py-4 px-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Status
                          </th>
                                <th className="py-4 px-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.results.map((request) => (
                          <RequestRow key={request.uid} request={request} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Mobile Layout */}
                <div className="lg:hidden space-y-4">
                  {data.results.map((request) => (
                    <RequestRow key={request.uid} request={request} />
                  ))}
                </div>

                {/* Pagination */}

                      <div className="mt-10">
                  <Pagination>
                    <PaginationContent className="flex-wrap gap-1">
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={handlePreviousPage}
                          className={
                            data?.previous ? "" : "text-white pointer-events-none opacity-50"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(data?.total_pages || 1, 5) }, (_, i) => (
                        <PaginationItem key={i} className="hidden sm:block">
                          <PaginationLink
                            href="#"
                            className="text-white border-gray-700 hover:bg-gray-800 hover:text-white"
                            isActive={currentPage === i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={handleNextPage}
                          className={
                            data?.next ? "" : "pointer-events-none opacity-50 text-white"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                        <div className="pb-10"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-xl border-0 bg-gray-900 rounded-lg shadow-lg text-white">
          <DialogTitle>

          </DialogTitle>
          <div className="w-full p-0">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">Advanced Search</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-200">Subject</label>
                <Input
                  type="text"
                  className="bg-gray-900 border-primary-200 text-white"
                  placeholder="Math, Science, etc."
                  value={advancedSearch.subject}
                  onChange={(e) =>
                    setAdvancedSearch({
                      ...advancedSearch,
                      subject: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-200">
                  Institution
                </label>
                <Input
                  type="text"
                  className="bg-gray-900 border-primary-200 text-white"
                  placeholder="School, College name"
                  value={advancedSearch.institution}
                  onChange={(e) =>
                    setAdvancedSearch({
                      ...advancedSearch,
                      institution: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <Button className="border-0 text-white
                        hover:bg-red-900 hover:text-white mt-2 md:mt-0"
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button className="bg-primary-600 text-white hover:bg-primary-700"
                  onClick={() => {
                    setCurrentPage(1);
                    setIsSearching(true);
                    setIsOpen(false);
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyRequest;
