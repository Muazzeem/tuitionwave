import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TutorPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Function to generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
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
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push("ellipsis-end");
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => handlePageChange(currentPage - 1)}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                onClick={() => handlePageChange(pageNumber)}
                isActive={pageNumber === currentPage}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => handlePageChange(currentPage + 1)}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TutorPagination;