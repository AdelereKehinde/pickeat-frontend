import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface PaginationProps {
  currentPage: number;
  count: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, count, pageSize, onPageChange }) => {
  // Generate a flat list of page numbers
  var calcTotalPages = Math.floor(count / pageSize)
  var totalPages = (pageSize >= count)? 1 : ((count - (calcTotalPages * pageSize)) != 0)? (calcTotalPages + 1): calcTotalPages

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <View className="flex flex-row justify-center items-center flex-wrap space-x-2 space-y-2 my-4">
      {pages.map((page) => (
        <TouchableOpacity
          key={page}
          className={`flex items-center justify-around w-9 h-9 rounded ${
            page === currentPage ? "bg-custom-green" : "bg-gray-200 border border-gray-300"
          }`}
          onPress={() => onPageChange(page)}
        >
          <Text
          style={{fontFamily: 'Inter-Medium'}}
            className={`${
              page === currentPage ? "text-white" : "text-gray-700"
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
