"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CatalogItem } from "@/services/catalog";

interface ProductCardProps {
  product: CatalogItem;
  index: number;
  isVisible: boolean;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}

export function ProductCard({
  product,
  index,
  isVisible,
  hoveredId,
  setHoveredId,
}: ProductCardProps) {
  const router = useRouter();

  const hasDiscount =
    product.fields.pre_discount_price &&
    product.fields.pre_discount_price > product.fields.price;
  const discountPercentage =
    hasDiscount && product.fields.pre_discount_price
      ? Math.round(
          ((product.fields.pre_discount_price - product.fields.price) /
            product.fields.pre_discount_price) *
            100
        )
      : 0;

  const handleProductClick = () => {
    router.push(`/product/${product.fields.id}`);
  };

  return (
    <div
      className="group relative cursor-pointer hover:scale-[1.02] transition-all duration-300"
      onMouseEnter={() => setHoveredId(product.id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={handleProductClick}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(0)",
        opacity: isVisible ? 1 : 1,
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 150}ms`,
      }}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-minimal-gray-900 rounded-lg mb-4">
        <Image
          src={product.fields.image_link}
          alt={product.fields.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Subtle overlay */}

        {product.fields.type ? (
          <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-minimal-black to-minimal-gray-800 text-minimal-white text-xs font-bold rounded-full shadow-lg border border-minimal-gray-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-minimal-white/20 to-transparent -translate-x-full animate-shimmer"></div>
            <span className="relative z-10 drop-shadow-sm">
              {product.fields.type}
            </span>
          </div>
        ) : null}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-minimal-white group-hover:text-minimal-gray-300 transition-colors duration-300 line-clamp-2">
          {product.fields.title}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-bold text-minimal-white">
            ₹{product.fields.price}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-minimal-gray-500 line-through">
                ₹{product.fields.pre_discount_price}
              </span>
              <span className="text-xs text-minimal-gray-300 font-semibold">
                ({discountPercentage}% OFF)
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
