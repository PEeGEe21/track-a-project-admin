"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Meta = {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
};

type PaginationProps = {
  meta: Meta;
  currentPage: number;
  handlePageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  meta,
  currentPage,
  handlePageChange,
}) => {
  const getPageNumbers = (): (number | string)[] => {
    if (!meta) return [];

    const pageNumbers: (number | string)[] = [];
    const totalPages = meta?.last_page;
    const currentPageNumber = meta?.current_page;

    pageNumbers.push(1);

    const start = Math.max(2, currentPageNumber - 1);
    const end = Math.min(totalPages - 1, currentPageNumber + 1);

    if (start > 2) {
      pageNumbers.push("...");
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (end < totalPages - 1) {
      pageNumbers.push("...");
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between border-t border-[#2B2B2B] bg-[#171717] px-4 py-3 sm:px-4 w-full rounded-b-lg text-white">
      {/* Mobile View */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === meta?.last_page}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[#999999]">
            Showing <span className="font-medium">{meta?.from}</span> to{" "}
            <span className="font-medium">{meta?.to}</span> of{" "}
            <span className="font-medium">{meta?.total}</span> entries
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Prev */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md hover:bg-[#ADED221A] disabled:opacity-50 text-white border border-[#2B2B2B] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..." || page === currentPage}
                className={`px-3 py-1 rounded-md cursor-pointer ${
                  page === currentPage
                    ? "bg-[#E6E6E6] text-black"
                    : page === "..."
                    ? "cursor-default text-white"
                    : "hover:bg-gray-100 text-white hover:text-black"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === meta?.last_page}
            className="p-2 rounded-md hover:bg-[#ADED221A] disabled:opacity-50 text-white border border-[#2B2B2B] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
