"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CatalogService, CatalogItemFields } from "@/services/catalog";
import { OrderService, OrderFields } from "@/services/orders";
import {
  LocalStorageClient,
  CheckoutFormData,
} from "@/data-sources/localStorage/client";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<CatalogItemFields | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("No product ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Fetching product for checkout:", productId);
        const productData = await CatalogService.getById(productId);
        console.log("✅ Product fetched for checkout:", productData);
        setProduct(productData);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Load saved form data on component mount
  useEffect(() => {
    const savedFormData = LocalStorageClient.getCheckoutDetails();
    if (savedFormData) {
      console.log("📋 Prefilling form with saved data");
      setFormData(savedFormData);
      setPrefilled(true);

      // Keep prefill indicator visible forever when form is prefilled
      // setTimeout(() => setPrefilled(false), 3000);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    // Save to localStorage on every change
    LocalStorageClient.saveCheckoutDetails(updatedFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) {
      setError("Product not found");
      return;
    }

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.pincode
    ) {
      setError("Please fill in all fields");
      return;
    }

    // Validate pincode is a valid number
    const pincodeNumber = parseInt(formData.pincode);
    if (
      isNaN(pincodeNumber) ||
      formData.pincode.length < 5 ||
      formData.pincode.length > 6
    ) {
      setError("Please enter a valid 5-6 digit pincode");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const orderData: OrderFields = {
        product_id: product.id,
        product_price: product.price,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_pincode: parseInt(formData.pincode),
      };

      console.log("📦 Creating order with OrderService:", orderData);

      // Use OrderService to create the order
      const createdOrder = await OrderService.create(orderData);

      console.log("✅ Order created successfully:", createdOrder);

      setSuccess(true);
    } catch (err) {
      console.error("❌ Error placing order:", err);
      setError("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-minimal-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-minimal-white text-xl mb-4">
            Loading checkout...
          </div>
          <div className="w-8 h-8 border-2 border-minimal-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-minimal-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-minimal-white mb-4">
            Checkout Error
          </h1>
          <p className="text-minimal-gray-400 mb-6">{error}</p>
          <a
            href="/"
            className="px-6 py-3 bg-minimal-white text-minimal-black font-semibold rounded-full hover:bg-minimal-gray-200 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-minimal-black flex items-center justify-center relative overflow-hidden">
        {/* Confetti particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full opacity-80 animate-[confettiFall_4s_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <div
              key={i + 20}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-80 animate-[confettiFall_4s_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
          {[...Array(15)].map((_, i) => (
            <div
              key={i + 40}
              className="absolute w-3 h-1 bg-blue-400 rounded-full opacity-80 animate-[confettiFall_4s_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center max-w-md mx-auto px-6 pb-32 lg:pb-6 relative z-10">
          <div className="relative">
            {/* Success icon with enhanced animation */}
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-[scaleInRotate_0.8s_ease-out_0.3s_forwards] transform scale-0">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  className="animate-[drawCheck_1.2s_ease-out_1s_forwards] opacity-0"
                  style={{
                    strokeDasharray: "30",
                    strokeDashoffset: "30",
                  }}
                />
              </svg>
            </div>

            {/* Celebration rings */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-2 border-green-400 rounded-full animate-[expandRing_1.2s_ease-out_1.2s_forwards] opacity-0"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-2 border-green-300 rounded-full animate-[expandRing_1.2s_ease-out_1.5s_forwards] opacity-0"></div>
          </div>
          <h1 className="text-3xl font-bold text-minimal-white mb-4">
            Order Placed!
          </h1>
          <p className="text-minimal-gray-400 mb-12">
            Nice Pick ! Your order is on the way.
            <br />
            We&apos;ll get in touch shortly.
          </p>

          {/* Desktop Continue Shopping Button */}
          <div className="hidden lg:block">
            <a
              href="/"
              className="w-full inline-block bg-minimal-white text-minimal-black font-bold py-5 px-8 rounded-full hover:bg-minimal-gray-200 transition-all text-lg shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </a>
          </div>
        </div>

        {/* Sticky Continue Shopping Button - Mobile Only */}
        <div className="fixed bottom-0 left-0 right-0 bg-minimal-black p-6 z-50 lg:hidden">
          <a
            href="/"
            className="w-full inline-block text-center bg-minimal-white text-minimal-black font-bold py-5 px-8 rounded-full hover:bg-minimal-gray-200 transition-all text-lg shadow-lg hover:shadow-xl"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  const hasDiscount =
    product?.pre_discount_price && product.pre_discount_price > product.price;
  const discountPercentage =
    hasDiscount && product?.pre_discount_price
      ? Math.round(
          ((product.pre_discount_price - product.price) /
            product.pre_discount_price) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-minimal-black">
      {/* Checkout Content */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 pb-32 lg:pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          {/* Order Summary */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-6 mb-4">
                <a
                  href={`/product/${product?.id}`}
                  className="w-12 h-12 bg-minimal-black/80 backdrop-blur-md border border-minimal-gray-700/50 rounded-full flex items-center justify-center text-minimal-white hover:bg-minimal-gray-800/80 hover:border-minimal-gray-600/50 transition-all duration-300 shadow-lg hover:shadow-xl"
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
                </a>
                <div>
                  <h2 className="text-3xl font-bold text-minimal-white mb-2">
                    Order Summary
                  </h2>
                  <p className="text-minimal-gray-400">
                    Review your order details before proceeding
                  </p>
                </div>
              </div>
            </div>

            {product && (
              <div className="bg-minimal-gray-900/50 rounded-2xl p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-minimal-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={product.image_link}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-minimal-white mb-2">
                      {product.title}
                    </h3>
                    <p className="text-minimal-gray-400 text-sm">
                      Product ID: {product.id}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-minimal-gray-400">
                      Product Price:
                    </span>
                    <div className="flex items-center gap-3">
                      {hasDiscount && (
                        <span className="text-minimal-gray-500 line-through text-lg">
                          ₹{product.pre_discount_price}
                        </span>
                      )}
                      <span className="text-minimal-white font-semibold">
                        ₹{product.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-minimal-gray-400">Delivery Fee:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-minimal-gray-500 line-through text-sm">
                        ₹99
                      </span>
                      <span className="text-green-400 font-semibold">FREE</span>
                    </div>
                  </div>

                  <div className="border-t border-minimal-gray-800 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-minimal-white font-semibold text-lg">
                        Total:
                      </span>
                      <span className="text-minimal-white font-bold text-2xl">
                        ₹{product.price}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Timeline */}
                  <div className="flex items-center gap-3 pt-4 border-t border-minimal-gray-800">
                    <svg
                      className="w-5 h-5 text-minimal-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-minimal-gray-400 font-semibold">
                      Delivery in 3-5 business days
                    </span>
                  </div>

                  {hasDiscount && (
                    <div className="text-center py-4 bg-green-900/20 rounded-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -translate-x-full animate-shimmer"></div>
                      <p className="text-green-400 font-semibold relative z-10">
                        You saved ₹{product.pre_discount_price! - product.price}{" "}
                        ({discountPercentage}%)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Checkout Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-minimal-white mb-2">
                Shipping Details
              </h2>
              <p className="text-minimal-gray-400">
                Please provide your delivery information
              </p>

              {/* Prefill indicator */}
              {prefilled && (
                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-blue-400 text-sm">
                      Form prefilled with your previous information
                    </p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-minimal-gray-300 text-sm font-medium mb-3"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-minimal-gray-800 text-minimal-white rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-minimal-white/20 transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-minimal-gray-300 text-sm font-medium mb-3"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-minimal-gray-800 text-minimal-white rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-minimal-white/20 transition-all"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-minimal-gray-300 text-sm font-medium mb-3"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-minimal-gray-800 text-minimal-white rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-minimal-white/20 transition-all"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-minimal-gray-300 text-sm font-medium mb-3"
                >
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-minimal-gray-800 text-minimal-white rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-minimal-white/20 transition-all resize-none"
                  placeholder="Enter your complete delivery address"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className="block text-minimal-gray-300 text-sm font-medium mb-3"
                >
                  Pincode *
                </label>
                <input
                  type="number"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full bg-minimal-gray-800 text-minimal-white rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-minimal-white/20 transition-all"
                  placeholder="Enter your 5-6 digit pincode"
                  minLength={5}
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-900/20 text-red-400 px-6 py-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Desktop Place Order Button */}
              <div className="hidden lg:block pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-minimal-white text-minimal-black font-bold py-3 px-8 rounded-full hover:bg-minimal-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-minimal-black border-t-transparent rounded-full animate-spin"></div>
                      Placing Order...
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span>Place Order</span>
                      <span className="text-xs text-minimal-gray-600 font-normal">
                        Cash on Delivery
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sticky Place Order Button - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-minimal-black border-t border-minimal-gray-800 p-6 z-50 lg:hidden">
        <div className="max-w-6xl mx-auto">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-minimal-white text-minimal-black font-bold py-3 px-8 rounded-full hover:bg-minimal-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl"
            onClick={handleSubmit}
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-minimal-black border-t-transparent rounded-full animate-spin"></div>
                Placing Order...
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-0.5">
                <span>Place Order</span>
                <span className="text-xs text-minimal-gray-600 font-normal">
                  Cash on Delivery
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
