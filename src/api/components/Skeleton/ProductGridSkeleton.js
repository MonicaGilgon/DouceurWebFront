import React from "react";

const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="product-grid flex flex-wrap justify-center gap-6">
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between w-[260px] m-2 border-2 border-transparent animate-pulse"
      >
        <div className="w-full h-40 bg-gray-200 rounded-lg mb-2" />
        <div className="flex flex-col text-center">
          <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto mb-4" />
          <div className="h-9 bg-pink-100 rounded-md w-full" />
        </div>
      </div>
    ))}
  </div>
);

export default ProductGridSkeleton;
