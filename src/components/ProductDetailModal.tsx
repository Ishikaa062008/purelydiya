import React, { useState, useEffect } from "react";
import { X, Star, Heart, ShoppingCart, Award, ShieldCheck, HelpCircle, Send } from "lucide-react";
import { Product, Review } from "../types";
import { SAMPLE_PRODUCTS } from "../lib/data";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

interface ProductDetailModalProps {
  product: Product;
  user: any;
  onClose: () => void;
  onAddToCart: (p: Product, quantity?: number) => void;
  onAddToWishlist: (p: Product) => void;
  isWishlisted: boolean;
  onViewProductDetail: (p: Product) => void;
}

export default function ProductDetailModal({
  product,
  user,
  onClose,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  onViewProductDetail,
}: ProductDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients" | "usage" | "reviews">("benefits");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch reviews from firestore
  const fetchReviews = async () => {
    try {
      const q = query(collection(db, "reviews"), where("productId", "==", product.id));
      const querySnapshot = await getDocs(q);
      const fetched: Review[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Review);
      });

      // If no custom reviews in Firestore, seed some beautiful mock ones!
      if (fetched.length === 0) {
        const mockReviews: Review[] = [
          {
            id: "mock-1",
            productId: product.id,
            userId: "u1",
            userName: "Prerna Sharma",
            rating: 5,
            comment: `This ${product.name} is absolutely magic! It resolved my hyperpigmentation within 2 weeks of disciplined use. High-quality packaging too.`,
            createdAt: "2026-06-20",
          },
          {
            id: "mock-2",
            productId: product.id,
            userId: "u2",
            userName: "Ananya Patel",
            rating: 4,
            comment: "Completely organic and natural texture. Skin feels clean, and hydrated. The natural fragrance of Kannauj roses is wonderful.",
            createdAt: "2026-06-25",
          },
        ];
        setReviews(mockReviews);
      } else {
        setReviews(fetched);
      }
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    }
  };

  useEffect(() => {
    fetchReviews();
    setQuantity(1);
    setActiveTab("benefits");
  }, [product]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to write a review!");
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const reviewPayload = {
        productId: product.id,
        userId: user.uid,
        userName: user.displayName || "Verified Buyer",
        rating: newRating,
        comment: newComment,
        createdAt: new Date().toISOString().split("T")[0],
      };

      await addDoc(collection(db, "reviews"), reviewPayload);
      setNewComment("");
      setNewRating(5);
      await fetchReviews();
    } catch (error) {
      console.error("Error writing review: ", error);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Get related products (same category or same skin type compatibility)
  const relatedProducts = SAMPLE_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.skinTypes.some((t) => product.skinTypes.includes(t)))
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-100 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur text-stone-700 hover:text-stone-900 hover:bg-white p-2 rounded-full border border-stone-100 transition-colors shadow-sm"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Product Image Display */}
        <div className="w-full md:w-1/2 bg-stone-50 p-6 flex items-center justify-center relative border-r border-stone-100 overflow-hidden min-h-[300px]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full max-h-[450px] object-cover rounded-2xl shadow-md"
          />
          <div className="absolute bottom-10 left-6 right-6 flex justify-between">
            <div className="bg-white/90 backdrop-blur-sm border border-stone-200/50 text-emerald-800 text-xs font-semibold py-1.5 px-3 rounded-full flex items-center space-x-1">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Organic & Clean</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-stone-200/50 text-stone-700 text-xs font-semibold py-1.5 px-3 rounded-full flex items-center space-x-1">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Ayurvedic Lab Certified</span>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details & Interaction Tabs */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-[85vh]">
          <div>
            <span className="text-xs font-bold tracking-wider text-stone-400 uppercase">{product.category}</span>
            <h2 className="font-sans font-bold text-2xl text-stone-800 mt-1 leading-tight">{product.name}</h2>
            
            {/* Rating summary */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : ""}`} />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-600 font-mono">({product.rating} / 5.0)</span>
              <span className="text-stone-300">|</span>
              <span className="text-xs text-stone-500 font-medium cursor-pointer" onClick={() => setActiveTab("reviews")}>
                {reviews.length} Verified customer reviews
              </span>
            </div>

            {/* Price Box */}
            <div className="mt-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Standard Selling Price</span>
                <p className="font-sans font-black text-2xl text-emerald-800">₹{product.price}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/50 px-2 py-1 rounded">Tax Included</span>
                <p className="text-[10px] text-stone-400 mt-1">Free Shipping on ₹499+</p>
              </div>
            </div>

            {/* Skin compatibility pill-tags */}
            <div className="mt-4">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">Skin Compatibility:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {product.skinTypes.map((type) => (
                  <span key={type} className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100/50 px-2.5 py-0.5 rounded-full">
                    ✓ {type} Skin
                  </span>
                ))}
              </div>
            </div>

            {/* Detail Tabs */}
            <div className="mt-6">
              <div className="flex border-b border-stone-100">
                {(["benefits", "ingredients", "usage", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 text-center py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                      activeTab === tab
                        ? "border-emerald-800 text-emerald-800 font-bold"
                        : "border-transparent text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="py-4 text-sm text-stone-600 leading-relaxed min-h-[140px] max-h-[220px] overflow-y-auto">
                {activeTab === "benefits" && (
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs">
                        <span className="text-emerald-700 font-bold flex-shrink-0 mt-0.5">🍃</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "ingredients" && (
                  <div className="space-y-2 text-xs bg-stone-50 rounded-xl p-3 border border-stone-100">
                    <p className="font-semibold text-stone-700">Fully Biodegradable & Safe Formulation:</p>
                    <p className="italic text-stone-600">{product.ingredients.join(", ")}</p>
                    <p className="text-[10px] text-stone-400 leading-snug">Zero Parabens. Zero Sulfates. No synthetic coloring or added perfumes.</p>
                  </div>
                )}

                {activeTab === "usage" && (
                  <div className="text-xs space-y-2">
                    <p className="font-semibold text-stone-700">Directives for use:</p>
                    <p className="text-stone-600 bg-stone-50 border border-stone-100 rounded-xl p-3">{product.usage}</p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {/* Review submit form */}
                    {user ? (
                      <form onSubmit={handleAddReview} className="border-b border-stone-100 pb-4 mb-2">
                        <p className="text-xs font-bold text-stone-700 mb-1">Leave a Review:</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs text-stone-500">Rating:</span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setNewRating(star)}
                                className="focus:outline-none"
                              >
                                <Star className={`h-4 w-4 ${star <= newRating ? "text-amber-500 fill-current" : "text-stone-300"}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Share your experience with this organic product..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full text-xs border border-stone-200 bg-stone-50 pl-3 pr-10 py-2 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:bg-white"
                          />
                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="absolute right-2 top-1.5 text-emerald-800 hover:text-emerald-700 disabled:text-stone-400"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="bg-stone-50 border rounded-xl p-3 text-center text-xs text-stone-500 mb-2">
                        Please sign up or login with your Google account to leave reviews.
                      </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-3">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="border-b border-stone-50 pb-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-stone-800">{rev.userName}</span>
                            <span className="text-[10px] text-stone-400 font-mono">{rev.createdAt}</span>
                          </div>
                          <div className="flex text-amber-500 my-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < rev.rating ? "fill-current" : ""}`} />
                            ))}
                          </div>
                          <p className="text-stone-600 leading-relaxed italic">"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lower Panel: Quantity Selector & Add to Cart */}
          <div className="border-t border-stone-100 pt-5 mt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">Purchase Quantity:</span>
              <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 overflow-hidden">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                  className="px-3 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm font-bold text-stone-800 font-mono">{quantity}</span>
                <button
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-stone-600 hover:bg-stone-100 font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => onAddToWishlist(product)}
                className={`flex-shrink-0 p-3 rounded-full border transition-all ${
                  isWishlisted
                    ? "bg-rose-50 border-rose-100 text-rose-600"
                    : "border-stone-200 text-stone-400 hover:bg-stone-50"
                }`}
              >
                <Heart className="h-5 w-5 fill-current" />
              </button>
              
              <button
                disabled={product.stock === 0}
                onClick={() => { onAddToCart(product, quantity); onClose(); }}
                className={`flex-1 text-white py-3 px-6 rounded-full font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.98] ${
                  product.stock === 0
                    ? "bg-stone-300 cursor-not-allowed"
                    : "bg-emerald-800 hover:bg-emerald-700 shadow-emerald-800/20"
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{product.stock === 0 ? "Out of Stock" : "Add to Shopping Cart"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
