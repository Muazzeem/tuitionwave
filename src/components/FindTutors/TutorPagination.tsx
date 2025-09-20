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
  if (totalPages <= 1 && !showWhenSinglePage) return null;

  const getPageNumbers = () => {
    const pageNumbers = [];

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (isMobile) {
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
      }
    } else {
      pageNumbers.push(1);

      const rangeStart = Math.max(2, currentPage - 2);
      const rangeEnd = Math.min(totalPages - 1, currentPage + 2);

      if (rangeStart > 2) {
        pageNumbers.push("ellipsis-start");
      }

      for (let i = rangeStart; i <= rangeEnd; i++) {
        if (i !== 1 && i !== totalPages) {
          pageNumbers.push(i);
        }
      }

      if (rangeEnd < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }

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

  const canGoPrevious = hasPrevious !== undefined ? hasPrevious : currentPage > 1;
  const canGoNext = hasNext !== undefined ? hasNext : currentPage < totalPages;

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-8 flex justify-center">
      <Pagination>
        <PaginationContent className="gap-1 sm:gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={!canGoPrevious ? "pointer-events-none opacity-50 text-white border-primary-700" : "cursor-pointer hover:bg-gray-800 transition-colors text-white hover:text-white"}
            />
          </PaginationItem>

          {pageNumbers.map((pageNumber, index) => {
            if (pageNumber === "ellipsis-start" || pageNumber === "ellipsis-end") {
              return (
                <PaginationItem key={pageNumber} className="hidden sm:block text-white">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  onClick={() => handlePageChange(pageNumber as number)}
                  isActive={pageNumber === currentPage}
                  className="cursor-pointer text-white hover:text-white hover:bg-gray-800 transition-colors border-primary-700 text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2">

                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={!canGoNext ? "pointer-events-none opacity-50 text-white" : "cursor-pointer hover:bg-gray-800 transition-colors text-white hover:text-white"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TutorPagination;
