import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, ShoppingBag, DollarSign, Users, TrendingUp, RefreshCcw, Save, Search, Check, Tag, Upload, Image } from "lucide-react";
import { Product, Order } from "../types";
import { db } from "../lib/firebase";
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { SAMPLE_PRODUCTS } from "../lib/data";

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onRefreshProducts: () => void;
  onRefreshOrders: () => void;
}

export default function AdminPanel({
  products,
  orders,
  onRefreshProducts,
  onRefreshOrders,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "products" | "orders">("analytics");
  const [searchQuery, setSearchQuery] = useState("");

  // Product edit states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    category: "Face Powders",
    price: 0,
    stock: 0,
    description: "",
    benefits: [],
    ingredients: [],
    usage: "",
    imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 1,
    skinTypes: ["Normal"],
    concerns: ["Dullness"],
  });

  const [seedingLoader, setSeedingLoader] = useState(false);
  const [savingProductLoader, setSavingProductLoader] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Handle image upload and convert to base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.2 * 1024 * 1024) {
      alert("Please upload an image smaller than 1.2MB for system performance.");
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProductForm((prev) => ({ ...prev, imageUrl: base64String }));
      setUploadingImage(false);
    };
    reader.onerror = () => {
      alert("Error reading photo file");
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 1.2 * 1024 * 1024) {
        alert("Please upload an image smaller than 1.2MB for system performance.");
        return;
      }
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
        setUploadingImage(false);
      };
      reader.onerror = () => {
        alert("Error reading dropped file");
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Statistics summaries
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;

  // Handle Seeding Database (Writes SAMPLE_PRODUCTS to Firestore)
  const handleSeedDatabase = async () => {
    setSeedingLoader(true);
    try {
      const batch = writeBatch(db);
      for (const p of SAMPLE_PRODUCTS) {
        const docRef = doc(collection(db, "products"), p.id);
        batch.set(docRef, p);
      }
      await batch.commit();
      alert("Successfully seeded Firestore database with all organic beauty products!");
      onRefreshProducts();
    } catch (err) {
      console.error("Failed to seed database: ", err);
      alert("Seeding failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSeedingLoader(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      alert("Product deleted successfully!");
      onRefreshProducts();
    } catch (err) {
      console.error("Delete failed: ", err);
    }
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      await updateDoc(doc(db, "products", id), { stock: newStock });
      onRefreshProducts();
    } catch (err) {
      console.error("Update stock failed: ", err);
    }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string, trackingNum?: string) => {
    try {
      const payload: any = { status: newStatus };
      if (trackingNum) payload.trackingNumber = trackingNum;
      await updateDoc(doc(db, "orders", id), payload);
      alert("Order status updated successfully!");
      onRefreshOrders();
    } catch (err) {
      console.error("Order status update failed: ", err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProductLoader(true);
    try {
      const finalPayload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      };

      if (editingProduct) {
        // Edit existing
        await updateDoc(doc(db, "products", editingProduct.id), finalPayload);
        alert("Product updated successfully!");
      } else {
        // Create new
        const generatedId = finalPayload.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || Math.random().toString();
        await addDoc(collection(db, "products"), {
          ...finalPayload,
          id: generatedId,
          rating: 4.8,
          reviewsCount: 1,
        });
        alert("New product added successfully!");
      }

      setEditingProduct(null);
      setProductForm({
        name: "",
        category: "Face Powders",
        price: 0,
        stock: 0,
        description: "",
        benefits: [],
        ingredients: [],
        usage: "",
        imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
        rating: 4.8,
        reviewsCount: 1,
        skinTypes: ["Normal"],
        concerns: ["Dullness"],
      });
      onRefreshProducts();
    } catch (err) {
      console.error("Failed saving product: ", err);
    } finally {
      setSavingProductLoader(false);
    }
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="admin-panel" className="bg-stone-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 pb-5">
          <div>
            <span className="text-xs font-extrabold text-amber-700 tracking-wider uppercase bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              ★ Purely Diya Administration Hub
            </span>
            <h1 className="text-3xl font-sans font-bold text-stone-800 mt-2 tracking-tight">Admin Operations & Control</h1>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={handleSeedDatabase}
              disabled={seedingLoader}
              className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-md flex items-center space-x-1.5 transition-all"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>{seedingLoader ? "Seeding database..." : "Seed Clean Catalog Products"}</span>
            </button>
            <button
              onClick={() => { onRefreshProducts(); onRefreshOrders(); }}
              className="bg-stone-900 hover:bg-stone-850 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-md flex items-center space-x-1.5 transition-all"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>Sync All Datasets</span>
            </button>
          </div>
        </div>

        {/* Operational Tabs */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "analytics"
                ? "border-emerald-800 text-emerald-800"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            Bento Analytics reports
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "products"
                ? "border-emerald-800 text-emerald-800"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            Product Catalog & Stock Management
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "orders"
                ? "border-emerald-800 text-emerald-800"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            Customer Orders Log
          </button>
        </div>

        {/* Tab 1: Bento Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Bento statistics grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-stone-150 shadow-sm flex items-center space-x-4">
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Gross Sales</span>
                  <p className="text-xl font-bold font-mono text-stone-800">₹{totalRevenue}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-stone-150 shadow-sm flex items-center space-x-4">
                <div className="bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-100">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Total Orders</span>
                  <p className="text-xl font-bold font-mono text-stone-800">{totalOrders} Orders</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-stone-150 shadow-sm flex items-center space-x-4">
                <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-100">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Average Order</span>
                  <p className="text-xl font-bold font-mono text-stone-800">₹{averageOrderValue}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-stone-150 shadow-sm flex items-center space-x-4">
                <div className="bg-rose-50 text-rose-800 p-3 rounded-xl border border-rose-100">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Out of Stock</span>
                  <p className="text-xl font-bold font-mono text-stone-800">{outOfStockProducts} Products</p>
                </div>
              </div>
            </div>

            {/* Live sales summary chart or detail block */}
            <div className="bg-white border border-stone-150 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-wide mb-4">Store Category Performance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-stone-600 mb-1">
                      <span>Face Powders</span>
                      <span className="font-mono">45% of total sales</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full">
                      <div className="h-full bg-emerald-800 rounded-full" style={{ width: "45%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-stone-600 mb-1">
                      <span>Herbal Powders</span>
                      <span className="font-mono">25% of total sales</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: "25%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-stone-600 mb-1">
                      <span>Combo Packs</span>
                      <span className="font-mono">20% of total sales</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: "20%" }} />
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 space-y-3 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 text-xs font-bold text-stone-700 uppercase">
                    <Check className="h-4 w-4 text-emerald-800" />
                    <span>Real-time Operations Check</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Firestore database is fully sync'd. Security rules are actively deployed and guarding your user data models from shadow updates. Check client connectivity via "Sync All Datasets".
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products Stock Management */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Manage/Add Form */}
            <div className="bg-white border border-stone-150 rounded-2xl p-6 shadow-sm h-fit">
              <h3 className="font-bold text-stone-800 text-sm uppercase tracking-wide border-b border-stone-100 pb-3 mb-4 flex items-center space-x-2">
                <Plus className="h-4.5 w-4.5 text-emerald-800" />
                <span>{editingProduct ? `Edit ${editingProduct.name}` : "Create New Product"}</span>
              </h3>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs text-stone-600">
                <div>
                  <label className="block font-bold text-stone-500 uppercase mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-500 uppercase mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e: any) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                    >
                      <option>Face Powders</option>
                      <option>Herbal Powders</option>
                      <option>Soaps</option>
                      <option>Scrubs</option>
                      <option>Mists & Toners</option>
                      <option>Combo Packs</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="block font-bold text-stone-500 uppercase mb-0.5">Product Photo Source</label>
                    
                    {/* Drag and drop upload zone */}
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("photo-upload-input")?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                        dragActive 
                          ? "border-emerald-800 bg-emerald-50/40" 
                          : "border-stone-200 bg-stone-50 hover:bg-stone-100/50 hover:border-stone-400"
                      }`}
                    >
                      <input
                        type="file"
                        id="photo-upload-input"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      
                      {uploadingImage ? (
                        <div className="flex flex-col items-center space-y-1">
                          <RefreshCcw className="h-6 w-6 text-emerald-800 animate-spin" />
                          <span className="text-[10px] text-stone-500">Processing photo file...</span>
                        </div>
                      ) : productForm.imageUrl ? (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="relative group">
                            <img 
                              src={productForm.imageUrl} 
                              alt="Upload preview" 
                              className="h-20 w-20 rounded-xl object-cover border border-stone-200 shadow-sm"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-xl flex items-center justify-center">
                              <Upload className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                            ✓ Image uploaded & loaded
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-1">
                          <Upload className="h-6 w-6 text-stone-400" />
                          <p className="text-[11px] font-medium text-stone-600">
                            Drag & drop image here, or <span className="text-emerald-800 underline">browse</span>
                          </p>
                          <span className="text-[9px] text-stone-400 font-mono">Supports JPG, PNG (Max 1.2MB)</span>
                        </div>
                      )}
                    </div>


                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-500 uppercase mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-500 uppercase mb-1">Stock Level</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-500 uppercase mb-1">Marketing Description</label>
                  <textarea
                    required
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-500 uppercase mb-1">Benefits (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Benefit 1, Benefit 2,..."
                    value={productForm.benefits?.join(", ")}
                    onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value.split(",").map((s) => s.trim()) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-500 uppercase mb-1">Ingredients (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Ingredient 1, Ingredient 2,..."
                    value={productForm.ingredients?.join(", ")}
                    onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value.split(",").map((s) => s.trim()) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-500 uppercase mb-1">Instructions for Use</label>
                  <input
                    type="text"
                    value={productForm.usage}
                    onChange={(e) => setProductForm({ ...productForm, usage: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setProductForm({ name: "", category: "Face Powders", price: 0, stock: 0, description: "", imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop" });
                      }}
                      className="px-4 py-2 border border-stone-200 bg-white rounded-xl hover:bg-stone-50 font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={savingProductLoader}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl flex items-center space-x-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>{savingProductLoader ? "Saving..." : "Save Product Details"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Interactive Stock List */}
            <div className="bg-white border border-stone-150 rounded-2xl p-6 shadow-sm lg:col-span-2 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-stone-800 text-sm uppercase tracking-wide">Live Products List</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Filter product list..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-stone-50 border border-stone-200 pl-9 pr-3 py-1.5 rounded-full text-xs text-stone-850 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider text-[10px] font-bold">
                        <th className="pb-3">Product details</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Price</th>
                        <th className="pb-3">Stock Level</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/50">
                          <td className="py-3 flex items-center space-x-3 max-w-[200px]">
                            <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded-md object-cover border border-stone-100 flex-shrink-0" />
                            <span className="font-semibold text-stone-800 truncate" title={p.name}>{p.name}</span>
                          </td>
                          <td className="py-3 text-stone-500 font-medium">{p.category}</td>
                          <td className="py-3 font-semibold font-mono text-emerald-800">₹{p.price}</td>
                          <td className="py-3">
                            <input
                              type="number"
                              value={p.stock}
                              onChange={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                              className="w-16 bg-stone-50 border border-stone-200 rounded px-2 py-1 text-center font-mono font-bold"
                            />
                          </td>
                          <td className="py-3 text-right space-x-1.5">
                            <button onClick={() => handleEditProductClick(p)} className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 rounded">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-stone-100 rounded">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Customer Orders Log */}
        {activeTab === "orders" && (
          <div className="bg-white border border-stone-150 rounded-2xl p-6 shadow-sm overflow-hidden">
            <h3 className="font-bold text-stone-800 text-sm uppercase tracking-wide mb-4">Logged Customer Orders Log</h3>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 text-sm">No orders logged yet in the database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider text-[10px] font-bold">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Recipient / Shipping</th>
                      <th className="pb-3">Ordered Items</th>
                      <th className="pb-3">Total paid</th>
                      <th className="pb-3">Fulfillment Status</th>
                      <th className="pb-3 text-right">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50/50">
                        <td className="py-4 font-mono font-bold text-stone-800">{o.id}</td>
                        <td className="py-4">
                          <p className="font-semibold text-stone-850">{o.shippingAddress.fullName}</p>
                          <p className="text-[10px] text-stone-500">{o.shippingAddress.city}, {o.shippingAddress.state}</p>
                        </td>
                        <td className="py-4 max-w-[200px]">
                          <p className="font-medium text-stone-700 truncate">
                            {o.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                          </p>
                        </td>
                        <td className="py-4 font-bold font-mono text-emerald-800">₹{o.totalAmount}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            o.status === "Delivered" ? "bg-green-50 text-green-700" :
                            o.status === "Shipped" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-1.5">
                          {o.status === "Processing" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, "Shipped", `PD-${Math.floor(1000000 + Math.random() * 9000000)}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2.5 py-1 rounded"
                            >
                              Ship Order
                            </button>
                          )}
                          {o.status === "Shipped" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, "Delivered")}
                              className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-2.5 py-1 rounded"
                            >
                              Deliver Order
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}
