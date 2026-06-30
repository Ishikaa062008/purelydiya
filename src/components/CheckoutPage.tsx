import React, { useState } from "react";
import { ShoppingBag, ArrowLeft, ShieldCheck, Ticket, CreditCard, Landmark, Wallet, CheckCircle2, ChevronRight, Truck, Trash2, Plus, Minus, AlertCircle, RefreshCcw } from "lucide-react";
import { Product, CartItem, ShippingAddress } from "../types";

interface CheckoutPageProps {
  cartItems: { product: Product; quantity: number; cartId: string }[];
  user: any;
  onUpdateQuantity: (cartId: string, q: number) => void;
  onRemoveItem: (cartId: string) => void;
  onPlaceOrder: (orderDetails: {
    items: any[];
    totalAmount: number;
    discountAmount: number;
    couponCode: string;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
  }) => Promise<string | null>;
  onNavigateToShop: () => void;
  onNavigateToOrders: () => void;
}

export default function CheckoutPage({
  cartItems,
  user,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onNavigateToShop,
  onNavigateToOrders,
}: CheckoutPageProps) {
  const [step, setStep] = useState<"details" | "success">("details");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [orderTrackingNumber, setOrderTrackingNumber] = useState<string | null>(null);

  // Shipping form fields
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.displayName || "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  // Payment options
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const [placingOrderLoader, setPlacingOrderLoader] = useState(false);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (couponDiscountPercent / 100));
  const shippingFee = subtotal >= 499 || subtotal === 0 ? 0 : 50;
  const grandTotal = subtotal - discountAmount + shippingFee;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "PURE20") {
      setAppliedCoupon("PURE20");
      setCouponDiscountPercent(20);
      setCouponCode("");
    } else if (code === "NATURAL15") {
      setAppliedCoupon("NATURAL15");
      setCouponDiscountPercent(15);
      setCouponCode("");
    } else {
      alert("Invalid coupon code. Try 'PURE20' (20% off) or 'NATURAL15' (15% off).");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponDiscountPercent(0);
  };

  // Form validator
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!shippingAddress.fullName.trim()) errors.fullName = "Full name is required";
    if (!shippingAddress.addressLine.trim()) errors.addressLine = "Complete delivery address is required";
    if (!shippingAddress.city.trim()) errors.city = "City name is required";
    if (!shippingAddress.state.trim()) errors.state = "State is required";
    if (!shippingAddress.postalCode.trim()) {
      errors.postalCode = "PIN Code is required";
    } else if (!/^\d{6}$/.test(shippingAddress.postalCode.trim())) {
      errors.postalCode = "Invalid PIN code format (6 digits)";
    }
    if (!shippingAddress.phone.trim()) {
      errors.phone = "Active phone number is required";
    } else if (!/^\d{10}$/.test(shippingAddress.phone.trim().replace(/[^0-9]/g, ""))) {
      errors.phone = "Invalid phone number format (10 digits)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceSecureOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please log in using Google to complete your secure checkout.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add some products before checking out.");
      return;
    }

    if (!validateForm()) {
      // scroll to errors
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    setPlacingOrderLoader(true);
    try {
      const formattedItems = cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
      }));

      const trackingNum = await onPlaceOrder({
        items: formattedItems,
        totalAmount: grandTotal,
        discountAmount,
        couponCode: appliedCoupon,
        shippingAddress,
        paymentMethod,
      });

      if (trackingNum) {
        setOrderTrackingNumber(trackingNum);
        setStep("success");
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Something went wrong while processing your transaction. Please try again.");
    } finally {
      setPlacingOrderLoader(false);
    }
  };

  if (step === "success") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-fade-in space-y-8">
        <div className="h-20 w-20 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="h-10 w-10 text-emerald-700 animate-pulse" />
        </div>
        
        <div className="space-y-3">
          <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ★ Transaction Confirmed ★
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">Your Ayurvedic Alchemy is Preparing!</h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
            Thank you for ordering with Purely Diya! We are hand-packing your chemical-free custom blends using fresh organic herbs.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4 max-w-md mx-auto text-left">
          <div className="flex justify-between items-center text-xs border-b pb-3 border-stone-100">
            <span className="text-stone-400 font-semibold uppercase">Tracking Number</span>
            <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{orderTrackingNumber}</span>
          </div>
          
          <div className="text-xs space-y-1.5 text-stone-600">
            <p><strong>Deliver to:</strong> {shippingAddress.fullName}</p>
            <p className="line-clamp-1"><strong>Address:</strong> {shippingAddress.addressLine}, {shippingAddress.city}</p>
            <p><strong>Payment Mode:</strong> {paymentMethod} (Securely Authenticated)</p>
            <p className="pt-2 border-t border-stone-100 font-bold text-stone-800">
              Total Charge: ₹{grandTotal}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
          <button
            onClick={onNavigateToOrders}
            className="w-full sm:w-auto bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs tracking-wide px-6 py-3.5 rounded-full shadow transition-all"
          >
            Track Order History
          </button>
          <button
            onClick={onNavigateToShop}
            className="w-full sm:w-auto bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-bold text-xs tracking-wide px-6 py-3.5 rounded-full shadow-sm transition-all"
          >
            Back to Organic Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in font-sans">
      {/* Back to Shop Navigation Row */}
      <div className="mb-8">
        <button
          onClick={onNavigateToShop}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-stone-500 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Pure Catalog</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: Shipping details & secure payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white border border-stone-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-[10px] text-emerald-800 font-bold tracking-widest uppercase">Step 1 of 2</span>
              <h2 className="text-xl font-serif font-bold text-stone-900 mt-1">Delivery Address Information</h2>
              <p className="text-stone-400 text-xs mt-0.5">Please provide your active shipping contact details below.</p>
            </div>

            <form onSubmit={handlePlaceSecureOrder} className="space-y-4 text-xs text-stone-600">
              <div>
                <label className="block font-bold text-stone-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your first and last name"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs transition-all ${
                    formErrors.fullName ? "border-rose-400 focus:ring-rose-400" : "border-stone-200"
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-[10px] text-rose-500 mt-1 flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{formErrors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-500 uppercase mb-1">Delivery Address</label>
                <input
                  type="text"
                  placeholder="Apartment, suite, unit, building, street address"
                  value={shippingAddress.addressLine}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                  className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs transition-all ${
                    formErrors.addressLine ? "border-rose-400 focus:ring-rose-400" : "border-stone-200"
                  }`}
                />
                {formErrors.addressLine && (
                  <p className="text-[10px] text-rose-500 mt-1 flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{formErrors.addressLine}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-500 uppercase mb-1">City</label>
                  <input
                    type="text"
                    placeholder="E.g., Mumbai"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs transition-all ${
                      formErrors.city ? "border-rose-400 focus:ring-rose-400" : "border-stone-200"
                    }`}
                  />
                  {formErrors.city && (
                    <p className="text-[10px] text-rose-500 mt-1 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{formErrors.city}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-stone-500 uppercase mb-1">State / Province</label>
                  <input
                    type="text"
                    placeholder="E.g., Maharashtra"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs transition-all ${
                      formErrors.state ? "border-rose-400 focus:ring-rose-400" : "border-stone-200"
                    }`}
                  />
                  {formErrors.state && (
                    <p className="text-[10px] text-rose-500 mt-1 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{formErrors.state}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-500 uppercase mb-1">PIN Code (6 Digits)</label>
                  <input
                    type="text"
                    placeholder="400001"
                    maxLength={6}
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs font-mono transition-all ${
                      formErrors.postalCode ? "border-rose-400 focus:ring-rose-400" : "border-stone-200"
                    }`}
                  />
                  {formErrors.postalCode && (
                    <p className="text-[10px] text-rose-500 mt-1 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{formErrors.postalCode}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-stone-500 uppercase mb-1">Phone Number (10 Digits)</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={15}
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs font-mono transition-all ${
                      formErrors.phone ? "border-rose-400 focus:ring-rose-400" : "border-stone-200"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-[10px] text-rose-500 mt-1 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{formErrors.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Step 2: Payment options */}
          <div className="bg-white border border-stone-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-[10px] text-emerald-800 font-bold tracking-widest uppercase">Step 2 of 2</span>
              <h2 className="text-xl font-serif font-bold text-stone-900 mt-1">Select Payment Gateway</h2>
              <p className="text-stone-400 text-xs mt-0.5">Choose your preferred secure payment method.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("UPI")}
                className={`p-4 border rounded-2xl flex flex-col items-center space-y-2 text-center transition-all ${
                  paymentMethod === "UPI"
                    ? "border-emerald-800 bg-emerald-50/20 text-emerald-800 font-bold"
                    : "border-stone-200 bg-white hover:bg-stone-50 text-stone-600"
                }`}
              >
                <Landmark className="h-5 w-5" />
                <span className="text-xs">UPI/Instant Net</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("Credit Card")}
                className={`p-4 border rounded-2xl flex flex-col items-center space-y-2 text-center transition-all ${
                  paymentMethod === "Credit Card"
                    ? "border-emerald-800 bg-emerald-50/20 text-emerald-800 font-bold"
                    : "border-stone-200 bg-white hover:bg-stone-50 text-stone-600"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs">Credit/Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("Cash on Delivery")}
                className={`p-4 border rounded-2xl flex flex-col items-center space-y-2 text-center transition-all ${
                  paymentMethod === "Cash on Delivery"
                    ? "border-emerald-800 bg-emerald-50/20 text-emerald-800 font-bold"
                    : "border-stone-200 bg-white hover:bg-stone-50 text-stone-600"
                }`}
              >
                <Truck className="h-5 w-5" />
                <span className="text-xs">Cash on Delivery</span>
              </button>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 flex items-start space-x-3 text-stone-500">
              <ShieldCheck className="h-5 w-5 text-emerald-800 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-stone-700">Encrypted Security Standard</p>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  Transactions are safely powered by certified payment handlers (Razorpay & Stripe). No sensitive payment details are retained on our servers.
                </p>
              </div>
            </div>

            {/* Secure Order Trigger Button */}
            <div className="pt-4">
              <button
                onClick={handlePlaceSecureOrder}
                disabled={placingOrderLoader}
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold tracking-wide py-4 rounded-xl shadow-md flex items-center justify-center space-x-2.5 transition-all text-sm active:scale-98"
              >
                {placingOrderLoader ? (
                  <>
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    <span>Configuring Secure Hand-pack Batch...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4.5 w-4.5" />
                    <span>Place Secure Order • ₹{grandTotal}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Review Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-150 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-3 flex justify-between items-center">
              <h3 className="font-sans font-bold text-stone-900 text-sm uppercase tracking-wide">Review Order Items</h3>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono">
                {cartItems.length} Products
              </span>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-10 text-stone-400 space-y-2">
                <ShoppingBag className="h-8 w-8 mx-auto opacity-35" />
                <p className="text-xs">Your shopping cart is currently empty.</p>
                <button
                  onClick={onNavigateToShop}
                  className="text-xs font-bold text-emerald-800 underline"
                >
                  Browse our organic catalog
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-50 max-h-[280px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex items-center justify-between py-3 text-xs">
                    <div className="flex items-center space-x-3 max-w-[70%]">
                      <img src={item.product.imageUrl} alt={item.product.name} className="h-12 w-12 object-cover rounded-xl border border-stone-100" />
                      <div>
                        <h4 className="font-bold text-stone-850 truncate line-clamp-1" title={item.product.name}>
                          {item.product.name}
                        </h4>
                        <p className="text-stone-400 text-[10px] font-medium font-mono">₹{item.product.price} / item</p>
                        
                        {/* Inline quantity adjuster */}
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            onClick={() => onUpdateQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                            className="bg-stone-50 hover:bg-stone-100 text-stone-600 rounded p-0.5 border"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-mono font-bold text-stone-700 text-[11px]">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                            className="bg-stone-50 hover:bg-stone-100 text-stone-600 rounded p-0.5 border"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <span className="font-bold font-mono text-stone-800 text-right">
                        ₹{item.product.price * item.quantity}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.cartId)}
                        className="text-stone-400 hover:text-rose-500 p-1 rounded-full transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Promo coupon code entry */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Apply Promo Coupon</label>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-[11px]">
                  <span className="text-emerald-800 font-bold flex items-center space-x-1">
                    <Ticket className="h-4 w-4" />
                    <span>{appliedCoupon} Loaded ({couponDiscountPercent}% Discount)</span>
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-stone-400 hover:text-rose-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Try PURE20 or NATURAL15"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 focus:outline-none text-stone-850 text-xs font-mono"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs px-4 rounded-xl transition-all"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Price breakdown invoice card */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between items-center text-stone-600">
                <span>Basket Subtotal</span>
                <span className="font-mono font-medium">₹{subtotal}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-800 font-medium">
                  <span>Coupon Deduction</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-stone-600">
                <span>Delivery Charge</span>
                <span className="font-mono">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-800 font-bold">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              {shippingFee > 0 && (
                <p className="text-[9px] text-stone-400">
                  💡 Shop for ₹{499 - subtotal} more to qualify for <strong>FREE Delivery</strong>!
                </p>
              )}

              <div className="border-t border-stone-200 pt-2.5 mt-1 flex justify-between items-center font-bold text-stone-900 text-sm">
                <span>Grand Total</span>
                <span className="font-mono text-emerald-800 text-base">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
