import React, { useState, useEffect } from "react";
import { auth, db, handleFirestoreError, OperationType } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, setDoc, addDoc, deleteDoc, updateDoc, query, where, onSnapshot } from "firebase/firestore";
import { Product, UserProfile, WishlistItem, CartItem, Order, ShippingAddress } from "./types";
import { SAMPLE_PRODUCTS, SAMPLE_BLOGS } from "./lib/data";

// Sub-components
import Navbar from "./components/Navbar";
import SkinAnalyzer from "./components/SkinAnalyzer";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import CheckoutModal from "./components/CheckoutModal";
import Chatbot from "./components/Chatbot";
import AdminPanel from "./components/AdminPanel";
import CheckoutPage from "./components/CheckoutPage";
import Logo from "./components/Logo";

// Icons
import { Heart, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Leaf, Eye, Star, Clock, User, ClipboardList, RefreshCcw, X } from "lucide-react";

export default function App() {
  const [activePage, setActivePage] = useState<string>("shop");
  const [user, setUser] = useState<any>(null);
  const [userSkinProfile, setUserSkinProfile] = useState<UserProfile | null>(null);

  // Lists State
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Interaction modals toggles
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Sync / loading indicators
  const [productsLoading, setProductsLoading] = useState(false);

  // Authenticated state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create user document in firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserSkinProfile(docSnap.data() as UserProfile);
            // If skin profile is completed, show analyzer as active page
            if (docSnap.data().skinType) {
              setActivePage("analyzer");
            }
          } else {
            // Create initial empty profile
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              createdAt: new Date().toISOString(),
            };
            setDoc(userDocRef, newProfile).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`)
            );
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        });

        // Sync authenticated lists (Cart, Wishlist, Orders)
        syncAuthenticatedLists(currentUser.uid);
      } else {
        setUserSkinProfile(null);
        setCart([]);
        setWishlist([]);
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync products from Firestore dynamically on load
  useEffect(() => {
    fetchProductsFromFirestore();
  }, []);

  const fetchProductsFromFirestore = async () => {
    setProductsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const list: Product[] = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data() as Product);
      });
      if (list.length > 0) {
        setProducts(list);
      }
    } catch (err) {
      console.warn("Could not load products from Firestore, using default local catalog. Error: ", err);
    } finally {
      setProductsLoading(false);
    }
  };

  const syncAuthenticatedLists = (uid: string) => {
    // 1. Cart snap
    const cartQuery = query(collection(db, "cart"), where("userId", "==", uid));
    onSnapshot(cartQuery, (snap) => {
      const items: CartItem[] = [];
      snap.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as CartItem);
      });
      setCart(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "cart");
    });

    // 2. Wishlist snap
    const wishlistQuery = query(collection(db, "wishlist"), where("userId", "==", uid));
    onSnapshot(wishlistQuery, (snap) => {
      const items: WishlistItem[] = [];
      snap.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as WishlistItem);
      });
      setWishlist(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "wishlist");
    });

    // 3. Orders snap
    // If admin is logged in, load ALL orders to manage! Otherwise only user's orders.
    const isAdmin = auth.currentUser?.email === "ishhsharma06@gmail.com";
    const ordersQuery = isAdmin 
      ? query(collection(db, "orders"))
      : query(collection(db, "orders"), where("userId", "==", uid));

    onSnapshot(ordersQuery, (snap) => {
      const items: Order[] = [];
      snap.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      // Sort orders by newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "orders");
    });
  };

  // 1. Add to Cart Operation
  const handleAddToCart = async (product: Product, quantity = 1) => {
    if (!user) {
      // Fallback local state warning
      alert("Please login first to add items to your shopping cart!");
      return;
    }

    try {
      // Check if item exists in cart
      const existingItem = cart.find((item) => item.productId === product.id);
      if (existingItem) {
        // Update quantity
        const docRef = doc(db, "cart", existingItem.id);
        await updateDoc(docRef, { quantity: existingItem.quantity + quantity });
      } else {
        // Add new item
        const payload = {
          userId: user.uid,
          productId: product.id,
          quantity,
          addedAt: new Date().toISOString(),
        };
        await addDoc(collection(db, "cart"), payload);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "cart");
    }
  };

  const handleUpdateCartQuantity = async (cartId: string, quantity: number) => {
    try {
      await updateDoc(doc(db, "cart", cartId), { quantity });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "cart");
    }
  };

  const handleRemoveCartItem = async (cartId: string) => {
    try {
      await deleteDoc(doc(db, "cart", cartId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `cart/${cartId}`);
    }
  };

  // 2. Add to Wishlist Operation
  const handleAddToWishlist = async (product: Product) => {
    if (!user) {
      alert("Please login first to save products to your wishlist!");
      return;
    }

    try {
      const existingItem = wishlist.find((item) => item.productId === product.id);
      if (existingItem) {
        // Remove from wishlist
        await deleteDoc(doc(db, "wishlist", existingItem.id));
      } else {
        // Add to wishlist
        const payload = {
          userId: user.uid,
          productId: product.id,
          addedAt: new Date().toISOString(),
        };
        await addDoc(collection(db, "wishlist"), payload);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "wishlist");
    }
  };

  // 3. Save skin profile
  const handleSaveSkinProfile = async (profile: { skinType: string; concerns: string[] }) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), profile);
      alert("Skin profile analyzed and updated successfully!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  // 4. Place order
  const handlePlaceOrder = async (orderDetails: {
    items: any[];
    totalAmount: number;
    discountAmount: number;
    couponCode: string;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
  }) => {
    if (!user) return null;

    try {
      const trackingNumber = `PD-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const orderPayload: Order = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: user.uid,
        items: orderDetails.items,
        totalAmount: orderDetails.totalAmount,
        discountAmount: orderDetails.discountAmount,
        couponCode: orderDetails.couponCode,
        status: "Processing",
        shippingAddress: orderDetails.shippingAddress,
        paymentMethod: orderDetails.paymentMethod,
        createdAt: new Date().toISOString(),
        trackingNumber,
      };

      // 1. Write to orders
      await setDoc(doc(db, "orders", orderPayload.id), orderPayload);

      // 2. Clear user's cart
      for (const item of cart) {
        await deleteDoc(doc(db, "cart", item.id));
      }

      // 3. Sync stock levels in background (reduce stock counts)
      for (const item of orderDetails.items) {
        const prodMatch = products.find((p) => p.id === item.productId);
        if (prodMatch) {
          const newStock = Math.max(0, prodMatch.stock - item.quantity);
          await updateDoc(doc(db, "products", prodMatch.id), { stock: newStock });
        }
      }

      fetchProductsFromFirestore();
      return trackingNumber;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "orders");
      return null;
    }
  };

  // Format cart list with details
  const formattedCartItems = cart.map((cartItem) => {
    const matchedProduct = products.find((p) => p.id === cartItem.productId) || SAMPLE_PRODUCTS.find((p) => p.id === cartItem.productId)!;
    return {
      product: matchedProduct,
      quantity: cartItem.quantity,
      cartId: cartItem.id,
    };
  });

  const wishlistProductIds = wishlist.map((item) => item.productId);

  // Filters for Shop Page Catalog
  const categoriesList = ["All", "Face Powders", "Herbal Powders", "Soaps", "Scrubs", "Mists & Toners", "Combo Packs"];

  const filteredShopProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 flex flex-col justify-between selection:bg-emerald-800 selection:text-white">
      
      {/* Navbar Container */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openCart={() => setCheckoutOpen(true)}
        openWishlist={() => setWishlistOpen(true)}
      />

      {/* Main Orchestration Board */}
      <main className="flex-1">
        {/* SHOP PAGE */}
        {activePage === "shop" && (
          <div className="animate-fade-in">
            {/* HERO HERO SECTION */}
            <div className="relative bg-stone-100/90 py-24 px-4 sm:px-6 lg:px-8 text-stone-800 text-center overflow-hidden border-b border-stone-200">
              <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                <span className="inline-flex items-center space-x-1.5 bg-emerald-100/50 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-emerald-200/40">
                  <Leaf className="h-4 w-4 text-emerald-700" />
                  <span>100% Certified Chemical-Free & Herbal Beauty</span>
                </span>
                <h1 className="text-4xl sm:text-6xl font-serif font-semibold tracking-tight text-stone-900 leading-[1.15]">
                  Authentic Skin Alchemy from <br />
                  <span className="text-emerald-800 italic">Pure Organic Herbs</span>
                </h1>
                <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
                  Discover therapeutic Ayurvedic powder blends, steam-distilled mists, and hand-milled soaps tailored precisely to your unique biology.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setActivePage("analyzer")}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-emerald-850/10 flex items-center space-x-2.5 mx-auto active:scale-95 transition-all"
                  >
                    <Sparkles className="h-4.5 w-4.5" />
                    <span>Take Skin Diagnostic Quiz</span>
                  </button>
                </div>
              </div>

              {/* Decorative Subtle Blur Spheres */}
              <div className="absolute -top-12 -left-12 bg-emerald-200/20 rounded-full h-72 w-72 blur-3xl" />
              <div className="absolute -bottom-12 -right-12 bg-emerald-100/20 rounded-full h-72 w-72 blur-3xl" />
            </div>

            {/* CATALOG VIEWS CONTAINER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-200 pb-5 mb-8 space-y-4 md:space-y-0">
                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs font-semibold px-4 py-2 rounded-full transition-all border ${
                        selectedCategory === cat
                          ? "bg-emerald-800 border-emerald-800 text-white shadow-md shadow-emerald-800/10 font-bold"
                          : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <p className="text-xs font-medium text-stone-500 font-mono">
                  Showing {filteredShopProducts.length} high-quality organic formulations
                </p>
              </div>

              {/* Product Grid */}
              {filteredShopProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredShopProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      isWishlisted={wishlistProductIds.includes(p.id)}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      onViewDetail={(prod) => setSelectedDetailProduct(prod)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center bg-white border border-stone-150 rounded-2xl py-16 px-4">
                  <div className="h-14 w-14 bg-stone-50 text-stone-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-stone-850">No products match your search.</h3>
                  <p className="text-stone-500 text-xs mt-1">Try refining your keyword query or category selection.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SKIN DIAGNOSTIC ANALYZER PAGE */}
        {activePage === "analyzer" && (
          <SkinAnalyzer
            user={user}
            userSkinProfile={userSkinProfile}
            onSaveProfile={handleSaveSkinProfile}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onViewProductDetail={(p) => setSelectedDetailProduct(p)}
            onNavigateToShop={() => setActivePage("shop")}
          />
        )}

        {/* EDUCATIONAL HUBS / BLOGS PAGE */}
        {activePage === "blogs" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">Learn Pure Skincare</span>
              <h1 className="text-3xl font-sans font-extrabold text-stone-800 tracking-tight">Skincare Recipes & Tutorials</h1>
              <p className="text-stone-500 text-sm max-w-lg mx-auto">Read step-by-step Ayurvedic face packs recipes written by certified estheticians.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              {SAMPLE_BLOGS.map((blog) => (
                <article key={blog.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-stone-900 text-white text-[9px] font-bold px-2.5 py-1 rounded">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1 text-[10px] text-stone-400 font-mono">
                        <Clock className="h-3 w-3" />
                        <span>{blog.createdAt}</span>
                        <span>•</span>
                        <span>{blog.author.split(" ")[0]}</span>
                      </div>
                      <h3 className="font-sans font-bold text-stone-850 text-base leading-snug">{blog.title}</h3>
                      <p className="text-stone-500 text-xs leading-relaxed line-clamp-3 whitespace-pre-line">{blog.content}</p>
                    </div>

                    <button
                      onClick={() => alert(`Full tutorial text:\n\n${blog.content}`)}
                      className="text-xs text-emerald-800 font-bold flex items-center space-x-1 hover:text-emerald-700 pt-2 border-t border-stone-100"
                    >
                      <span>Read Full Recipe Guide</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ORDER HISTORY PAGE */}
        {activePage === "orders" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-sans font-bold text-stone-800 tracking-tight">Your Order History</h1>
              <p className="text-stone-500 text-xs">View placed orders, fulfillment tracking numbers, and delivery states.</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white border border-stone-150 rounded-2xl py-12 px-4 text-center">
                <ClipboardList className="h-12 w-12 text-stone-300 mx-auto mb-3 animate-pulse" />
                <p className="text-stone-500 text-sm">No transaction history logs found.</p>
                <button onClick={() => setActivePage("shop")} className="mt-4 bg-emerald-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow">
                  Browse Skincare Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-stone-100 pb-3 gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-stone-400 font-bold uppercase font-mono">{o.createdAt.split("T")[0]}</span>
                        <h3 className="text-sm font-bold text-stone-800 font-mono flex items-center">
                          Order ID: <span className="text-emerald-800 ml-1">{o.id}</span>
                        </h3>
                      </div>
                      <div className="flex items-center space-x-3">
                        {o.trackingNumber && (
                          <span className="text-[10px] bg-stone-50 text-stone-600 border px-2 py-0.5 rounded font-mono">
                            Track: {o.trackingNumber}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          o.status === "Delivered" ? "bg-green-50 text-green-700 border border-green-200" :
                          o.status === "Shipped" ? "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse" :
                          "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {o.status}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-stone-50">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 text-xs text-stone-600">
                          <div className="flex items-center space-x-3">
                            <img src={item.imageUrl} alt={item.name} className="h-10 w-10 object-cover rounded border" />
                            <div>
                              <p className="font-semibold text-stone-800 line-clamp-1">{item.name}</p>
                              <p className="text-stone-400 text-[10px]">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-bold font-mono text-stone-800">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-stone-100 pt-3 flex flex-col sm:flex-row sm:justify-between text-xs text-stone-500 gap-2">
                      <p>
                        Shipped to: <span className="font-medium text-stone-700">{o.shippingAddress.fullName}</span>, {o.shippingAddress.city}
                      </p>
                      <p className="font-bold text-emerald-800 text-sm font-mono text-right">
                        Grand Total: ₹{o.totalAmount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* OPERATIONS ADMIN PANEL PAGE */}
        {activePage === "admin" && (
          <AdminPanel
            products={products}
            orders={orders}
            onRefreshProducts={fetchProductsFromFirestore}
            onRefreshOrders={() => syncAuthenticatedLists(user?.uid)}
          />
        )}

        {/* SECURE CHECKOUT PAGE */}
        {activePage === "checkout" && (
          <CheckoutPage
            cartItems={formattedCartItems}
            user={user}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onPlaceOrder={handlePlaceOrder}
            onNavigateToShop={() => setActivePage("shop")}
            onNavigateToOrders={() => setActivePage("orders")}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-stone-900 text-stone-400 py-10 px-4 sm:px-6 lg:px-8 border-t border-stone-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-stone-800 pb-8 mb-8 text-xs">
          <div className="space-y-3 flex flex-col items-start">
            <Logo size="md" showSlogan={true} theme="dark" className="!items-start" />
            <p className="text-stone-400 leading-relaxed max-w-sm">
              We specialize in bringing uncompromised Ayurvedic wellness and organic face packs straight to your daily beauty routine. Certified clean chemical-free.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Shop Categories</h4>
            <ul className="space-y-1.5">
              <li><button onClick={() => { setActivePage("shop"); setSelectedCategory("Face Powders"); }} className="hover:text-emerald-400">Face Powders</button></li>
              <li><button onClick={() => { setActivePage("shop"); setSelectedCategory("Herbal Powders"); }} className="hover:text-emerald-400">Herbal Powders</button></li>
              <li><button onClick={() => { setActivePage("shop"); setSelectedCategory("Soaps"); }} className="hover:text-emerald-400">Handcrafted Soaps</button></li>
              <li><button onClick={() => { setActivePage("shop"); setSelectedCategory("Combo Packs"); }} className="hover:text-emerald-400">Synergy Combo Packs</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Support Node</h4>
            <p className="leading-relaxed">
              Email: purelydiya@skincare.com <br />
              Hours: 10:00 AM - 6:00 PM IST <br />
              Secure checkout verified with Razorpay, Cash on Delivery, and Stripe.
            </p>
          </div>
        </div>
        <p className="text-center text-[11px] text-stone-600">
          © {new Date().getFullYear()} Purely Diya Inc. Manufactured in small-batch organic labs.
        </p>
      </footer>

      {/* Floating Chatbot Bubble */}
      <Chatbot user={user} userSkinProfile={userSkinProfile} />

      {/* Overlay Drawer: Wishlist Sidebar */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity" onClick={() => setWishlistOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col justify-between">
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <span className="font-bold text-stone-850 text-sm flex items-center space-x-1">
                <Heart className="h-4.5 w-4.5 text-rose-500 fill-current animate-pulse" />
                <span>Saved Wishlist ({wishlist.length} Items)</span>
              </span>
              <button onClick={() => setWishlistOpen(false)} className="p-1 hover:bg-stone-200 rounded-full text-stone-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {wishlist.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <Heart className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Your wishlist is empty.</p>
                </div>
              ) : (
                wishlist.map((item) => {
                  const product = products.find((p) => p.id === item.productId) || SAMPLE_PRODUCTS.find((p) => p.id === item.productId)!;
                  return (
                    <div key={item.id} className="flex items-center justify-between border-b pb-3 border-stone-50 text-xs">
                      <div className="flex items-center space-x-3">
                        <img src={product.imageUrl} alt={product.name} className="h-12 w-12 object-cover rounded border" />
                        <div>
                          <h4 className="font-bold text-stone-800 line-clamp-1">{product.name}</h4>
                          <p className="text-emerald-800 font-bold font-mono">₹{product.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => { handleAddToCart(product); setWishlistOpen(false); }}
                          className="bg-stone-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full"
                        >
                          Add
                        </button>
                        <button onClick={() => handleAddToWishlist(product)} className="text-rose-500 text-[10px] hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Overlay Modal */}
      {selectedDetailProduct && (
        <ProductDetailModal
          product={selectedDetailProduct}
          user={user}
          onClose={() => setSelectedDetailProduct(null)}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          isWishlisted={wishlistProductIds.includes(selectedDetailProduct.id)}
          onViewProductDetail={(p) => setSelectedDetailProduct(p)}
        />
      )}

      {/* Cart & Checkout Modal Overlay */}
      {checkoutOpen && (
        <CheckoutModal
          cartItems={formattedCartItems}
          user={user}
          onClose={() => setCheckoutOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onPlaceOrder={handlePlaceOrder}
          onProceedToCheckoutPage={() => {
            setCheckoutOpen(false);
            setActivePage("checkout");
          }}
        />
      )}

    </div>
  );
}
