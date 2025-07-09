"use client";

import { useState, useRef, useEffect } from "react";
import { CatalogService, CatalogItemFields } from "@/services/catalog";
import { ProductCard } from "./ProductCard";

export function FeaturedSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState<CatalogItemFields[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🔄 Starting to fetch products...");
        setLoading(true);
        const catalogItems = await CatalogService.getAll();
        console.log("✅ Products fetched successfully:", catalogItems);
        setProducts(catalogItems);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log(
          "👁️ Intersection observer triggered:",
          entry.isIntersecting
        );
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Get unique categories from products
  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter(
    (product) => activeCategory === "all" || product.category === activeCategory
  );

  console.log("🔍 Filtered products:", {
    categories,
    filteredProducts,
    isVisible,
    loading,
    error,
  });

  // Debug: Log individual product data to check type field
  filteredProducts.forEach((product, index) => {
    console.log(`Product ${index}:`, {
      id: product.id,
      title: product.title,
      type: product.type,
      condition: product.condition,
      hasType: !!product.type,
      typeValue: product.type,
    });
  });

  if (loading) {
    return (
      <section className="relative py-24 sm:py-32 bg-minimal-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-minimal-white">
              New <span className="text-minimal-gray-400">Arrivals</span>
            </h2>
            <p className="text-minimal-gray-400">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-24 sm:py-32 bg-minimal-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-minimal-white">
              New <span className="text-minimal-gray-400">Arrivals</span>
            </h2>
            <p className="text-minimal-gray-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-minimal-black overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-shine bg-[length:200%_200%] animate-gradient-shift opacity-10" />

      {/* Accent top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-minimal-white/10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
        <div
          className={`text-center mb-16 sm:mb-20 transition-all duration-1000 transform ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-100 translate-y-0"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-minimal-white">
            New <span className="text-minimal-gray-400">Arrivals</span>
          </h2>
          <p className="text-minimal-gray-400 mb-12 text-lg sm:text-xl max-w-2xl mx-auto">
            Explore our latest collection of premium designs, each piece crafted
            with attention to detail
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 sm:px-8 py-3 rounded-full transition-all duration-500 text-base tracking-wide transform-gpu hover:scale-105 active:scale-95 ${
                  activeCategory === category
                    ? "bg-minimal-white text-minimal-black font-bold shadow-lg shadow-minimal-white/20"
                    : "bg-minimal-gray-900 text-minimal-gray-400 hover:bg-minimal-gray-800 border border-minimal-gray-800"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={{ id: product.id, createdTime: "", fields: product }}
              index={index}
              isVisible={isVisible}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          ))}
        </div>
      </div>

      {/* Accent bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-minimal-white/10" />
    </section>
  );
}
