"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    in_stock: true,
  });
  // State for storing a file selected from the device
  const [imageFile, setImageFile] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  // Notification message state
  const [notification, setNotification] = useState("");

  // Function to upload image file to Cloudinary
  async function uploadImageToCloudinary(file) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(url, {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.secure_url) {
        return json.secure_url;
      }
      throw new Error("Cloudinary upload failed");
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  }

  // 1. Check if user is authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setSession(session);
      }
    });
  }, [router]);

  // 2. Fetch products and subscribe to real-time changes
  useEffect(() => {
    if (session) {
      fetchProducts();

      const channel = supabase
        .channel("products-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "products" },
          (payload) => {
            console.log("Change received!", payload);
            fetchProducts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
  }

  // 3. Add or Update product with Cloudinary integration and notifications
  async function handleSaveProduct(e) {
    e.preventDefault();
    const { name, description, price, image_url, in_stock } = formData;

    if (!name || !description || !price) {
      alert("Please fill in required fields (Name, Description, Price).");
      return;
    }

    try {
      // If a file is attached, upload it to Cloudinary first
      let finalImageURL = image_url;
      if (imageFile) {
        finalImageURL = await uploadImageToCloudinary(imageFile);
      }

      const productPayload = {
        name,
        description,
        price: parseFloat(price),
        image_url: finalImageURL,
        in_stock,
      };

      if (editingProductId) {
        // Update product
        const { error } = await supabase
          .from("products")
          .update(productPayload)
          .eq("id", editingProductId);
        if (error) throw error;
        setNotification("Product updated successfully!");
      } else {
        // Create product
        const { error } = await supabase
          .from("products")
          .insert([productPayload]);
        if (error) throw error;
        setNotification("Product added successfully!");
      }
      // Reset form and file state
      setFormData({
        name: "",
        description: "",
        price: "",
        image_url: "",
        in_stock: true,
      });
      setImageFile(null);
      setEditingProductId(null);
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  }

  // 4. Populate form for editing a product
  function handleEditProduct(product) {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url || "",
      in_stock: product.in_stock,
    });
    setImageFile(null);
  }

  // 5. Delete a product
  async function handleDeleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product:", error);
    }
  }

  // 6. Sign out
  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Admin Panel
          </h1>
          <button
            onClick={handleSignOut}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-300"
          >
            Sign Out
          </button>
        </div>

        {/* Notification Message */}
        {notification && (
          <div className="mb-6 p-4 text-center bg-green-100 text-green-800 rounded">
            {notification}
          </div>
        )}

        {/* Product Form */}
        <div className="bg-white shadow rounded p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {editingProductId ? "Edit Product" : "Add Product"}
          </h2>
          <form onSubmit={handleSaveProduct} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      image_url: e.target.value,
                    }))
                  }
                  placeholder="Or leave blank and choose a file below"
                />
              </div>
            </div>
            {/* File input for device image upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Upload Image (from device)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-400 border-gray-300 rounded"
                checked={formData.in_stock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    in_stock: e.target.checked,
                  }))
                }
              />
              <label htmlFor="inStock" className="text-gray-700 font-medium">
                In Stock
              </label>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
              >
                {editingProductId ? "Update" : "Add"} Product
              </button>
              {editingProductId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProductId(null);
                    setFormData({
                      name: "",
                      description: "",
                      price: "",
                      image_url: "",
                      in_stock: true,
                    });
                    setImageFile(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow border rounded p-4"
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
              )}
              <h2 className="text-xl font-semibold text-gray-800">
                {product.name}
              </h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="font-bold mt-2">₹{product.price}</p>
              <p
                className={`mt-1 font-medium ${
                  product.in_stock ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
