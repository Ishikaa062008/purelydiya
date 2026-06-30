import React from "react";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string | number;
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (p: Product, quantity?: number) => any;
  onAddToWishlist: (p: Product) => any;
  onViewDetail: (p: Product) => any;
}

export default function ProductCard({
  product,
  isWishlisted,
  onAddToCart,
  onAddToWishlist,
  onViewDetail,
}: ProductCardProps) {
  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-full"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-stone-50 cursor-pointer" onClick={() => onViewDetail(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Hover quick action overlays */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetail(product); }}
            className="bg-white text-stone-800 p-2.5 rounded-full shadow hover:bg-emerald-800 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300"
            title="View Details"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Wishlist Heart Overlay */}
        <button
          onClick={(e) => { e.stopPropagation(); onAddToWishlist(product); }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow border transition-all ${
            isWishlisted
              ? "bg-rose-50 border-rose-100 text-rose-600"
              : "bg-white/90 border-transparent text-stone-400 hover:text-rose-600 hover:bg-white"
          }`}
        >
          <Heart className="h-4 w-4 fill-current" />
        </button>

        {/* Match / Stock indicators */}
        {product.stock <= 5 && (
          <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow uppercase tracking-wider">
            Only {product.stock} Left!
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
            <span>{product.category}</span>
            <span className="text-emerald-800 flex items-center space-x-1 font-mono">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{product.rating}</span>
            </span>
          </div>

          <h3
            onClick={() => onViewDetail(product)}
            className="font-sans font-semibold text-stone-800 text-sm sm:text-base leading-tight hover:text-emerald-800 cursor-pointer transition-colors line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 h-8">
            {product.description}
          </p>

          {/* Skin Type Badge Tags */}
          <div className="flex flex-wrap gap-1 pt-1 h-10 overflow-hidden">
            {product.skinTypes.map((type) => (
              <span
                key={type}
                className="text-[9px] font-medium bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing Actions Box */}
        <div className="flex items-center justify-between mt-4 border-t border-stone-50 pt-3">
          <div className="flex flex-col">
            <span className="text-stone-400 text-[10px] uppercase font-semibold">Price</span>
            <span className="font-sans font-bold text-lg text-emerald-800">₹{product.price}</span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm hover:shadow active:scale-95"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
