import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default:
      "WildInk - Buy Posters Online | Fashion & Streetwear for Men & Women",
    template: "%s | WildInk",
  },
  description:
    "Buy posters online at WildInk. Shop trendy streetwear, hoodies, t-shirts for men and women. Best prices, free delivery, cash on delivery. Order now for unique fashion and artistic posters.",
  keywords: [
    "buy posters online",
    "posters for sale",
    "wall posters",
    "artistic posters",
    "fashion posters",
    "online shopping",
    "buy clothes online",
    "streetwear online",
    "hoodies for men",
    "hoodies for women",
    "t-shirts online",
    "fashion for men",
    "fashion for women",
    "trendy clothes",
    "best prices",
    "free delivery",
    "cash on delivery",
    "order online",
    "shop online",
    "online store",
    "fashion store",
    "poster store",
    "India online shopping",
    "buy online",
    "online fashion",
  ],
  authors: [{ name: "WildInk" }],
  creator: "WildInk",
  publisher: "WildInk",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://wildinktees.store"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wildinktees.store",
    title:
      "WildInk - Buy Posters Online | Fashion & Streetwear for Men & Women",
    description:
      "Buy posters online at WildInk. Shop trendy streetwear, hoodies, t-shirts for men and women. Best prices, free delivery, cash on delivery. Order now!",
    siteName: "WildInk",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "WildInk - Buy Posters Online & Fashion Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "WildInk - Buy Posters Online | Fashion & Streetwear for Men & Women",
    description:
      "Buy posters online at WildInk. Shop trendy streetwear, hoodies, t-shirts for men and women. Best prices, free delivery, cash on delivery. Order now!",
    images: ["/logo.png"],
    creator: "@wildink",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Script
          id="clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ot712t4qfd");
            `,
          }}
        />
      </body>
    </html>
  );
}
