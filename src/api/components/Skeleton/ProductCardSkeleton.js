import React from "react";
import "./ProductCardSkeleton.scss";

const ProductCardSkeleton = () => {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text skeleton-price"></div>
    </div>
  );
};

export default ProductCardSkeleton;
