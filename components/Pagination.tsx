import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface PaginationProps {
  currentPage: number;
  count: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  count,
  pageSize,
  onPageChange,
}) => {
  // Calculate the total number of pages
  const calcTotalPages = Math.floor(count / pageSize);
  const totalPages =
    pageSize >= count
      ? 1
      : (count - calcTotalPages * pageSize) !== 0
      ? calcTotalPages + 1
      : calcTotalPages;

  // Helper function to generate pagination pages with ellipsis
  const generatePages = () => {
    let pages: (number | string)[] = [];

    // Always show the first page
    pages.push(1);

    // Show ellipsis if there are skipped pages before the current page
    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around the current page
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Show ellipsis if there are skipped pages after the current page
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show the last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <View className="flex flex-row justify-center items-center flex-wrap space-x-2 space-y-2 my-4">
      {pages.map((page, index) => (
        <TouchableOpacity
          key={index}
          className={`flex items-center justify-around w-9 h-9 rounded ${
            page === currentPage
              ? "bg-custom-green"
              : page === "..."
              ? "" // No style for ellipses
              : "bg-gray-200 border border-gray-300"
          }`}
          onPress={() => {
            if (page !== "...") onPageChange(Number(page));
          }}
        >
          <Text
            style={{ fontFamily: "Inter-Medium" }}
            className={`${
              page === currentPage
                ? "text-white"
                : page === "..."
                ? "text-gray-500" // Style for ellipses
                : "text-gray-700"
            }`}
          >
            {page}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Pagination;
