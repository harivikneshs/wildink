"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CatalogService, CatalogItemFields } from "@/services/catalog";
import ProductImageCarousel from "@/components/ProductImageCarousel";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<CatalogItemFields | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("🔍 Fetching product with ID:", params.id);
        setLoading(true);
        const productData = await CatalogService.getById(params.id);
        console.log("✅ Product fetched:", productData);
        setProduct(productData);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 40; // Similar to homepage
      const shouldShow = window.scrollY > scrollThreshold;
      setShowBackButton(shouldShow);
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBuyNow = () => {
    if (product) {
      router.push(`/checkout?id=${product.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-minimal-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-minimal-white text-xl mb-4">
            Loading product...
          </div>
          <div className="w-8 h-8 border-2 border-minimal-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-minimal-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-minimal-white mb-4">
            Product Not Found
          </h1>
          <p className="text-minimal-gray-400 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <a
            href="/"
            className="px-6 py-3 bg-minimal-white text-minimal-black font-semibold rounded-lg hover:bg-minimal-gray-200 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const hasDiscount =
    product.pre_discount_price && product.pre_discount_price > product.price;
  const discountPercentage =
    hasDiscount && product.pre_discount_price
      ? Math.round(
          ((product.pre_discount_price - product.price) /
            product.pre_discount_price) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-minimal-black">
      {/* Sticky Back Button */}
      <div
        className={`fixed top-2 left-2 z-50 transition-all duration-500 ease-out ${
          showBackButton
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        <Link
          href="/"
          className="w-12 h-12 bg-minimal-black/90 backdrop-blur-md border border-minimal-gray-700/50 rounded-full flex items-center justify-center text-minimal-white hover:bg-minimal-gray-800/90 hover:border-minimal-gray-600/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 pb-32 lg:pb-12 lg:min-h-screen lg:flex lg:items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
          {/* Product Image Carousel */}
          <ProductImageCarousel
            images={[
              product.image_link,
              product.image_2_link,
              product.image_3_link,
            ].filter((img): img is string => Boolean(img))}
            title={product.title}
            type={product.type}
          />

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-minimal-white mb-4">
                {product.title}
              </h1>
              <p className="text-minimal-gray-400 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Long Description */}
            {product.long_description && (
              <div className="prose prose-invert max-w-none">
                <div
                  className="text-minimal-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.long_description }}
                />
              </div>
            )}

            {/* Price Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-minimal-white">
                  ₹{product.price}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-minimal-gray-500 line-through">
                    ₹{product.pre_discount_price}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <div className="text-green-400 font-semibold">
                  Save ₹{product.pre_discount_price! - product.price} (
                  {discountPercentage}% OFF)
                </div>
              )}
            </div>

            {/* Delivery Tags */}
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/20 rounded-full flex items-center gap-2 backdrop-blur-sm">
                <svg
                  className="w-4 h-4 text-emerald-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span className="text-emerald-300 text-sm font-semibold">
                  Free Delivery
                </span>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-400/20 rounded-full flex items-center gap-2 backdrop-blur-sm">
                <svg
                  className="w-4 h-4 text-orange-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-orange-300 text-sm font-semibold">
                  Cash on Delivery
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <span className="text-minimal-gray-400 text-sm">
                  Availability
                </span>
                <p className="text-minimal-white font-semibold capitalize">
                  {product.availability}
                </p>
              </div>
            </div>

            {/* Desktop Buy Now Button */}
            <div className="hidden lg:block">
              <button
                className="w-full bg-minimal-white text-minimal-black font-bold py-4 px-6 rounded-full hover:bg-minimal-gray-200 transition-colors"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Buy Now Button - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-minimal-black border-t border-minimal-gray-800 p-6 z-50 lg:hidden">
        <div className="max-w-7xl mx-auto">
          <button
            className="w-full bg-minimal-white text-minimal-black font-bold py-4 px-6 rounded-full hover:bg-minimal-gray-200 transition-colors"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
