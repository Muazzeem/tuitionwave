import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { getAccessToken } from "@/utils/auth";
import { ContractResponse } from "@/types/contract";
import { useAuth } from "@/contexts/AuthContext";

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
    switch (status) {
      case "Accepted":
        return "text-green-500";
      case "Rejected":
        return "text-red-500";
      case "Pending":
        return "text-yellow-500";
      case "Completed":
        return "text-green-500";
      default:
        return "";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      case "Pending":
        return "bg-yellow-500";
      case "Completed":
        return "bg-green-500";
      default:
        return "";
    }
  };

  const handleRequestClick = (requestId: string) => {
    // Navigate to the request details page
    const userType = userProfile?.user_type?.toLowerCase() === 'teacher' ? 'teacher' : 'guardian';
    navigate(`/${userType}/requests/${requestId}`);
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

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <DashboardHeader userName="John" />

      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold dark:text-white">My Tuition Request</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Explore all the tuition request from guardian
          </p>
        </div>

        {isLoading && <div className="text-center p-4 dark:text-gray-200">Loading...</div>}

        <div
          className="bg-white dark:bg-background rounded-lg shadow-sm border border-gray-200 shadow-md dark:border-gray-900"
          hidden={isLoading}
        >
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
              <h2 className="text-base sm:text-lg font-semibold dark:text-white">All Tuition Request</h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search By Institute"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className={`pl-10 w-full sm:w-[250px] lg:w-[300px] dark:bg-gray-900 border-primary-200 ${isTyping ? "border-blue-400 bg-blue-50 dark:bg-primary-900" : ""
                    }`}
                  />
                  {isTyping && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 dark:text-blue-400">
                      Typing...
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-auto bg-primary shadow-lg hover:bg-primary-700"
                  onClick={handleAdvancedSearch}
                >
                  <Filter className="h-4 w-4" />
                  <span className="sm:inline">Filters</span>
                </Button>
              </div>
            </div>

            {/* Active filters section - responsive */}
            {isSearching && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-primary-900/20 border border-blue-200 dark:border-primary-800 rounded-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium dark:text-white text-sm">Filters:</span>
                    {debouncedSearchQuery && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 dark:text-white rounded-md text-xs sm:text-sm flex items-center">
                        Search: {debouncedSearchQuery}
                        <button
                          className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                          onClick={() => {
                            setSearchQuery("");
                            setDebouncedSearchQuery("");
                            setCurrentPage(1);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {advancedSearch.subject && (
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-600 dark:text-white rounded-md text-xs sm:text-sm flex items-center">
                        Subject: {advancedSearch.subject}
                        <button
                          className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                          onClick={() => {
                            setAdvancedSearch({ ...advancedSearch, subject: "" });
                            setCurrentPage(1);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {advancedSearch.institution && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-primary-600 dark:text-white rounded-md text-xs sm:text-sm flex items-center">
                        Institution: {advancedSearch.institution}
                        <button
                          className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                          onClick={() => {
                            setAdvancedSearch({
                              ...advancedSearch,
                              institution: "",
                            });
                            setCurrentPage(1);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                  <button
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm font-medium"
                    onClick={() => {
                      setSearchQuery("");
                      setDebouncedSearchQuery("");
                      setAdvancedSearch({ subject: "", institution: "" });
                      setIsSearching(false);
                      setCurrentPage(1);
                    }}
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Table with horizontal scroll on mobile */}
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-primary-700">
                      <TableHead className="dark:text-gray-300 text-xs sm:text-sm">Req. ID</TableHead>
                      <TableHead className="dark:text-gray-300 text-xs sm:text-sm">Institution</TableHead>
                      <TableHead className="dark:text-gray-300 text-xs sm:text-sm">Class</TableHead>
                      <TableHead className="dark:text-gray-300 text-xs sm:text-sm">Subject</TableHead>
                      <TableHead className="dark:text-gray-300 text-xs sm:text-sm">Area</TableHead>
                      <TableHead className="dark:text-gray-300 text-xs sm:text-sm">Type</TableHead>
                      <TableHead className="dark:text-gray-300 text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-right dark:text-gray-300 text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.results.map((request, index) => (
                      <TableRow key={index} className="dark:border-primary-700">
                        <TableCell
                          className="font-medium cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 uppercase dark:text-white text-xs sm:text-sm"
                          onClick={() => handleRequestClick(request.uid)}
                        >
                          #{request.uid.slice(0, 8)}
                        </TableCell>
                        <TableCell className="dark:text-gray-300 text-xs sm:text-sm">{request.student_institution}</TableCell>
                        <TableCell className="dark:text-gray-300 text-xs sm:text-sm">{request.student_class}</TableCell>
                        <TableCell className="dark:text-gray-300 text-xs sm:text-sm">
                          {request.subjects.map((s) => s.subject).join(", ")}
                        </TableCell>
                        <TableCell className="dark:text-gray-300 text-xs sm:text-sm">
                          {request.student_area?.name || "N/A"}
                        </TableCell>
                        <TableCell className="dark:text-gray-300 text-xs sm:text-sm">{request.tuition_type}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span
                              className={`h-2 w-2 rounded-full ${getStatusDot(
                                request.status_display
                              )} mr-2`}
                            ></span>
                            <span
                              className={`text-xs sm:text-sm ${getStatusColor(
                                request.status_display
                              )}`}
                            >
                              {request.status_display}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <svg
                              className="h-3 w-3 sm:h-4 sm:w-4 dark:text-gray-300"
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Responsive pagination */}
            <div className="mt-4">
              <Pagination>
                <PaginationContent className="flex-wrap gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={handlePreviousPage}
                      className={
                        data?.previous ? "" : "pointer-events-none opacity-50 bg-primary"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(data?.total_pages || 1, 5) }, (_, i) => (
                    <PaginationItem key={i} className="hidden sm:block">
                      <PaginationLink
                        href="#"
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
                        data?.next ? "" : "pointer-events-none opacity-50 bg-primary"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Advanced Search Dialog */}
      <dialog id="search-dialog" className="p-0 rounded-lg shadow-xl dark:bg-gray-800 max-w-[95vw] w-full sm:max-w-md">
        <div className="w-full p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4 dark:text-white">Advanced Search</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Subject</label>
              <Input
                type="text"
                className="dark:bg-gray-900 border-primary-200 text-white"
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
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Institution
              </label>
              <Input
                type="text"
                className="dark:bg-gray-900 border-primary-200 text-white"
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
              <Button className="dark:text-gray-300 hover:dark:bg-primary-700 w-full sm:w-auto text-white"
                variant="outline"
                onClick={() => {
                  const searchDialog = document.getElementById(
                    "search-dialog"
                  ) as HTMLDialogElement;
                  if (searchDialog) {
                    searchDialog.close();
                  }
                }}
              >
                Cancel
              </Button>
              <Button className="dark:text-white w-full sm:w-auto text-gray-900"
                onClick={() => {
                  setCurrentPage(1);
                  setIsSearching(true);
                  const searchDialog = document.getElementById(
                    "search-dialog"
                  ) as HTMLDialogElement;
                  if (searchDialog) {
                    searchDialog.close();
                  }
                }}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyRequest;
