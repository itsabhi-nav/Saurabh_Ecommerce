"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [currentURL, setCurrentURL] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set current URL for product link reference
    setCurrentURL(window.location.href);

    // Fetch products asynchronously
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Navigation links
  const navLinks = [
    { label: "Home", href: "https://www.saurabhtrading.in" },
    { label: "About", href: "https://www.saurabhtrading.in/about" },
    { label: "Services", href: "https://www.saurabhtrading.in/service" },
    { label: "Shop Now", href: "https://www.shopping.saurabhtrading.in/" },
    { label: "Contact", href: "https://www.saurabhtrading.in/contact" },
    { label: "Admin Login", href: "/login" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Full-width sticky header */}
      <header className="sticky top-0 z-50 bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="https://www.saurabhtrading.in/"
              className="text-3xl font-extrabold text-gray-800 hover:text-blue-600 transition-colors"
            >
              Saurabh Trading
            </Link>
            {/* Optional tagline for larger screens */}
            <div className="hidden sm:block">
              <p className="text-sm text-gray-500">
                Quality Electronics & Gadgets
              </p>
            </div>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Hamburger for Mobile */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-gray-800 focus:outline-none"
            aria-label="Open Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Side Drawer Navigation */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Drawer */}
          <div className="bg-white w-64 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-gray-800 font-semibold">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-800 focus:outline-none"
                aria-label="Close Menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-800 text-lg hover:text-gray-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          {/* Overlay */}
          <div className="flex-grow" onClick={() => setMenuOpen(false)}></div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mt-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-8 text-gray-600">
            Loading products...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {products
              .filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((product) => {
                const isOutOfStock = !product.in_stock;
                // Use the Cloudinary URL directly without modification.
                const imageURL = product.image_url;

                const whatsappMessage = encodeURIComponent(`
🛒 *Product Inquiry*

📌 *Name:* ${product.name}
💰 *Price:* ₹${product.price}
📖 *Description:* ${product.description}
${product.image_url ? `🖼 *Image:* ${imageURL}` : ""}
🔗 *Product Link:* ${currentURL}
                `);
                return (
                  <div
                    key={product.id}
                    className="bg-white shadow rounded p-4 flex flex-col hover:shadow-lg transition-shadow"
                  >
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-contain mb-4 rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {product.name}
                      </h2>
                      <p className="text-gray-600 mt-2">
                        {product.description}
                      </p>
                      <p className="font-bold mt-2">₹{product.price}</p>
                      {isOutOfStock && (
                        <span className="inline-block bg-red-500 text-white px-2 py-1 mt-2 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <a
                      href={`https://wa.me/919234360028?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block mt-4 px-4 py-2 rounded text-white font-semibold text-center transition-colors duration-300 ${
                        isOutOfStock
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      style={{ pointerEvents: isOutOfStock ? "none" : "auto" }}
                    >
                      Buy Now
                    </a>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
