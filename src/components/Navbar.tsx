import React, { useState } from "react";
import { Search, ShoppingBag, Heart, User, Sparkles, Leaf, LogOut, Menu, X, ShieldAlert } from "lucide-react";
import Logo from "./Logo";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  cartCount: number;
  wishlistCount: number;
  user: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openCart: () => void;
  openWishlist: () => void;
}

export default function Navbar({
  activePage,
  setActivePage,
  cartCount,
  wishlistCount,
  user,
  searchQuery,
  setSearchQuery,
  openCart,
  openWishlist,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowProfileDropdown(false);
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const isAdmin = user && user.email === "ishhsharma06@gmail.com";

  return (
    <nav id="app-navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 cursor-pointer h-full py-1" onClick={() => { setActivePage("shop"); setMobileMenuOpen(false); }}>
            <Logo size="sm" showSlogan={true} className="scale-[0.8] origin-left sm:scale-100" />
          </div>

          {/* Search bar (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type="text"
                placeholder="Search herbal powder, soap, scrub..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-stone-200 rounded-full bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 focus:bg-white text-sm transition-all"
              />
            </div>
          </div>

          {/* Navigation Items (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setActivePage("analyzer")}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activePage === "analyzer"
                  ? "bg-emerald-800 text-white shadow-md shadow-emerald-800/20"
                  : "text-emerald-800 hover:bg-emerald-50 bg-emerald-50/50"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Skin Analyzer Quiz</span>
            </button>

            <button
              onClick={() => setActivePage("shop")}
              className={`text-sm font-medium px-1 py-2 border-b-2 transition-all ${
                activePage === "shop"
                  ? "border-emerald-800 text-emerald-800 font-semibold"
                  : "border-transparent text-stone-600 hover:text-emerald-800 hover:border-emerald-800/30"
              }`}
            >
              Shop Catalog
            </button>

            <button
              onClick={() => setActivePage("blogs")}
              className={`text-sm font-medium px-1 py-2 border-b-2 transition-all ${
                activePage === "blogs"
                  ? "border-emerald-800 text-emerald-800 font-semibold"
                  : "border-transparent text-stone-600 hover:text-emerald-800 hover:border-emerald-800/30"
              }`}
            >
              skincare DIY & Blogs
            </button>

            {isAdmin && (
              <button
                onClick={() => setActivePage("admin")}
                className={`flex items-center space-x-1.5 text-sm font-medium px-3 py-1.5 rounded-md border transition-all ${
                  activePage === "admin"
                    ? "bg-amber-50 border-amber-300 text-amber-800 font-semibold"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* Icons Bar */}
            <div className="flex items-center space-x-4 border-l border-stone-100 pl-6">
              {/* Wishlist Icon */}
              <button onClick={openWishlist} className="relative p-2 text-stone-600 hover:text-emerald-800 transition-colors">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <button onClick={openCart} className="relative p-2 text-stone-600 hover:text-emerald-800 transition-colors">
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-emerald-800 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile / Auth Dropdown */}
              <div className="relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 p-1 rounded-full border border-stone-200"
                    >
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || "User"} className="h-8 w-8 rounded-full referrer-policy='no-referrer'" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                    </button>

                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-stone-50">
                          <p className="text-sm font-semibold text-stone-800 truncate">{user.displayName || "Customer"}</p>
                          <p className="text-xs text-stone-500 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => { setActivePage("orders"); setShowProfileDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                        >
                          Order History
                        </button>
                        <button
                          onClick={() => { setActivePage("analyzer"); setShowProfileDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                        >
                          My Skin Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center space-x-1.5 transition-colors border-t border-stone-50 mt-1"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Wishlist Icon */}
            <button onClick={openWishlist} className="relative p-2 text-stone-600">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button onClick={openCart} className="relative p-2 text-stone-600">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-emerald-800 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-600 hover:text-emerald-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
          {/* Search bar (Mobile) */}
          <div className="relative w-full my-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-4 py-2 border border-stone-200 rounded-full bg-stone-50 text-stone-800 placeholder-stone-400 text-sm focus:outline-none"
            />
          </div>

          <button
            onClick={() => { setActivePage("analyzer"); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-800 text-white py-2.5 rounded-full text-sm font-medium shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>Skin Analyzer Quiz</span>
          </button>

          <button
            onClick={() => { setActivePage("shop"); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activePage === "shop" ? "bg-emerald-50 text-emerald-800" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            Shop Catalog
          </button>

          <button
            onClick={() => { setActivePage("blogs"); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activePage === "blogs" ? "bg-emerald-50 text-emerald-800" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            Skincare DIY & Blogs
          </button>

          {isAdmin && (
            <button
              onClick={() => { setActivePage("admin"); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                activePage === "admin" ? "bg-amber-50 border-amber-200 text-amber-800" : "border-stone-100 text-stone-600 hover:bg-stone-50"
              }`}
            >
              Admin Panel
            </button>
          )}

          {user ? (
            <div className="border-t border-stone-100 pt-3 space-y-2">
              <div className="flex items-center space-x-3 px-3 py-1.5">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-stone-800 truncate">{user.displayName || "Customer"}</p>
                  <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => { setActivePage("orders"); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50"
              >
                Order History
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
              className="w-full bg-stone-900 text-white py-2.5 rounded-full text-sm font-medium shadow-sm text-center flex items-center justify-center space-x-1.5"
            >
              <User className="h-4 w-4" />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
