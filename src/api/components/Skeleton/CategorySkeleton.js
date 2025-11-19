import React from "react";
import "./CategorySkeleton.scss";

const CategorySkeleton = ({ count = 5 }) => {
  return (
    <div className="categorias-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="categoria-skeleton-item" />
      ))}
    </div>
  );
};

export default CategorySkeleton;
