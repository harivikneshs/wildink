"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    id: 1,
    title: "Urban Essentials",
    description: "Minimal designs for the modern lifestyle",
    image: "/tshirt_hero.png",
    cta: "Shop Collection",
  },
  {
    id: 2,
    title: "Abstract Series",
    description: "Bold prints that make a statement",
    image: "/poster_hero_1.png",
    cta: "View Prints",
  },
  {
    id: 3,
    title: "Premium Collection",
    description: "Elevate your style with premium pieces",
    image: "/hoodie_hero.png",
    cta: "Explore Now",
  },
];

export function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    setIsLoaded(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % collections.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(
      (prev) => (prev - 1 + collections.length) % collections.length
    );
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Mobile features carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isPastHero = scrollY > (heroRef.current?.offsetHeight || 0);

  return (
    <section
      ref={heroRef}
      className="relative h-[100svh] overflow-hidden bg-minimal-black"
    >
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
          isPastHero ? "bg-minimal-black/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-start">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="WildInk"
              width={180}
              height={60}
              className="h-10 sm:h-12 md:h-14 w-auto"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="relative h-full w-full"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {collections.map((collection, index) => (
          <div
            key={collection.id}
            className={`absolute inset-0 transition-all duration-700 transform ${
              index === currentSlide
                ? "opacity-100 translate-x-0 scale-100"
                : index < currentSlide
                ? "opacity-0 -translate-x-full scale-95"
                : "opacity-0 translate-x-full scale-95"
            }`}
          >
            <div className="relative h-full w-full">
              {/* Full screen image */}
              <div className="absolute inset-0">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-minimal-black via-minimal-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-4xl mx-auto px-6 text-center">
                  <div
                    className={`transform transition-all duration-700 delay-300 ${
                      index === currentSlide
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                  >
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-minimal-white mb-6">
                      {collection.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-minimal-gray-400 mb-12 max-w-2xl mx-auto">
                      {collection.description}
                    </p>
                    <button className="px-8 py-4 bg-minimal-white text-minimal-black rounded-full font-bold hover:opacity-90 transform-gpu hover:scale-105 active:scale-95 transition-all duration-300 ease-out">
                      {collection.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Delivery Features */}
        <div className="absolute bottom-16 left-0 right-0 z-10 animate-float-slow flex justify-center px-6">
          {/* Desktop: Show all items */}
          <div className="hidden md:flex items-center justify-center gap-6 px-8 py-4 bg-gradient-to-r from-minimal-black/60 via-minimal-black/50 to-minimal-black/60 backdrop-blur-xl rounded-full border border-minimal-white/30 shadow-2xl">
            {/* Free Delivery */}
            <div className="flex items-center gap-3 group cursor-pointer relative">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-emerald-500/50">
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300"
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
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-minimal-white text-sm font-semibold group-hover:text-emerald-300 transition-colors duration-300">
                  Free Delivery
                </span>
                <span className="text-minimal-gray-400 text-xs group-hover:text-emerald-400 transition-colors duration-300">
                  Pan India
                </span>
              </div>
            </div>

            {/* Animated Separator */}
            <div className="relative">
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-minimal-white/40 to-transparent"></div>
              <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-transparent via-minimal-white/80 to-transparent animate-pulse"></div>
            </div>

            {/* Cash on Delivery */}
            <div className="flex items-center gap-3 group cursor-pointer relative">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-orange-500/50">
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300"
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
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-minimal-white text-sm font-semibold group-hover:text-orange-300 transition-colors duration-300">
                  Cash on Delivery
                </span>
                <span className="text-minimal-gray-400 text-xs group-hover:text-orange-400 transition-colors duration-300">
                  Available
                </span>
              </div>
            </div>

            {/* Animated Separator */}
            <div className="relative">
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-minimal-white/40 to-transparent"></div>
              <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-transparent via-minimal-white/80 to-transparent animate-pulse"></div>
            </div>

            {/* Fast Shipping */}
            <div className="flex items-center gap-3 group cursor-pointer relative">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-blue-500/50">
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-minimal-white text-sm font-semibold group-hover:text-blue-300 transition-colors duration-300">
                  Fast Shipping
                </span>
                <span className="text-minimal-gray-400 text-xs group-hover:text-blue-400 transition-colors duration-300">
                  3-5 Days
                </span>
              </div>
            </div>
          </div>

          {/* Mobile: Carousel */}
          <div className="md:hidden flex justify-center">
            <div className="relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-minimal-black/60 via-minimal-black/50 to-minimal-black/60 backdrop-blur-xl rounded-full border border-minimal-white/30 shadow-2xl w-[280px] h-[60px] overflow-hidden">
              {/* Free Delivery */}
              <div
                className={`absolute inset-0 flex items-center justify-center gap-3 cursor-pointer transition-opacity duration-700 ease-out ${
                  currentFeature === 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
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
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-minimal-white text-sm font-semibold">
                    Free Delivery
                  </span>
                  <span className="text-minimal-gray-400 text-xs">
                    Pan India
                  </span>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div
                className={`absolute inset-0 flex items-center justify-center gap-3 cursor-pointer transition-opacity duration-700 ease-out ${
                  currentFeature === 1 ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
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
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-minimal-white text-sm font-semibold">
                    Cash on Delivery
                  </span>
                  <span className="text-minimal-gray-400 text-xs">
                    Available
                  </span>
                </div>
              </div>

              {/* Fast Shipping */}
              <div
                className={`absolute inset-0 flex items-center justify-center gap-3 cursor-pointer transition-opacity duration-700 ease-out ${
                  currentFeature === 2 ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-minimal-white text-sm font-semibold">
                    Fast Shipping
                  </span>
                  <span className="text-minimal-gray-400 text-xs">
                    3-5 Days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex gap-3">
            {collections.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-minimal-white w-12"
                    : "bg-minimal-gray-600 w-4 hover:bg-minimal-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
