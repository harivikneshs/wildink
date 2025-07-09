"use client";

import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
  className?: string;
}

export function Header({
  showBackButton = false,
  backUrl = "/",
  backText = "Back",
  className = "",
}: HeaderProps) {
  return (
    <header
      className={`bg-minimal-black/80 backdrop-blur-md border-b border-minimal-gray-800/50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
        {showBackButton ? (
          <Link
            href={backUrl}
            className="text-minimal-white hover:text-minimal-gray-300 transition-colors inline-flex items-center gap-2"
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
            {backText}
          </Link>
        ) : (
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="WildInk"
              width={180}
              height={60}
              className="h-12 sm:h-14 md:h-16 w-auto"
              priority
            />
          </Link>
        )}

        {/* Logo on the right when showing back button */}
        {showBackButton && (
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="WildInk"
              width={180}
              height={60}
              className="h-12 sm:h-14 md:h-16 w-auto"
              priority
            />
          </Link>
        )}
      </div>
    </header>
  );
}
