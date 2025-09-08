
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TutorPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  showWhenSinglePage?: boolean;
}

const TutorPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNext, 
  hasPrevious, 
  showWhenSinglePage = false 
}: TutorPaginationProps) => {
  // Don't show pagination if there's only one page and showWhenSinglePage is false
  if (totalPages <= 1 && !showWhenSinglePage) return null;

  // Function to generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 4;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate range around current page
      const rangeStart = Math.max(2, currentPage - 1);
      const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis after first page if needed
      if (rangeStart > 2) {
        pageNumbers.push("ellipsis-start");
      }
      
      // Add pages around current page
      for (let i = rangeStart; i <= rangeEnd; i++) {
        if (i !== 1 && i !== totalPages) {
          pageNumbers.push(i);
        }
      }
      
      // Add ellipsis before last page if needed
      if (rangeEnd < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }
      
      // Always show last page if there's more than one page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Use hasNext/hasPrevious if provided, otherwise calculate from currentPage and totalPages
  const canGoPrevious = hasPrevious !== undefined ? hasPrevious : currentPage > 1;
  const canGoNext = hasNext !== undefined ? hasNext : currentPage < totalPages;

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-8 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(currentPage - 1)}
              className={!canGoPrevious ? "pointer-events-none opacity-50 text-white" : "cursor-pointer hover:bg-gray-800 transition-colors text-white hover:text-white"}
            />
          </PaginationItem>
          
          {pageNumbers.map((pageNumber, index) => {
            if (pageNumber === "ellipsis-start" || pageNumber === "ellipsis-end") {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink 
                  onClick={() => handlePageChange(pageNumber as number)}
                  isActive={pageNumber === currentPage}
                  className="cursor-pointer text-white hover:text-white hover:bg-gray-800 transition-colors border-gray-600"
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(currentPage + 1)}
              className={!canGoNext ? "pointer-events-none opacity-50 text-white" : "cursor-pointer  hover:bg-gray-800 transition-colors text-white hover:text-white"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TutorPagination;
