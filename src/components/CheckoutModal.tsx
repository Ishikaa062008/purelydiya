import React, { useState } from "react";
import { X, ShoppingBag, ArrowRight, ShieldCheck, Ticket, CreditCard, Landmark, Wallet, CheckCircle2, ChevronRight, Truck } from "lucide-react";
import { Product, CartItem, ShippingAddress } from "../types";

interface CheckoutModalProps {
  cartItems: { product: Product; quantity: number; cartId: string }[];
  user: any;
  onClose: () => void;
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
  onProceedToCheckoutPage?: () => void;
}

export default function CheckoutModal({
  cartItems,
  user,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onProceedToCheckoutPage,
}: CheckoutModalProps) {
  const [step, setStep] = useState<"cart" | "shipping" | "payment" | "success">("cart");
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

  // Payment mock options
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const [placingOrderLoader, setPlacingOrderLoader] = useState(false);

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
      alert("Invalid coupon code. Try PURE20 or NATURAL15.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponDiscountPercent(0);
  };

  const handleNextToShipping = () => {
    if (!user) {
      alert("Please login first to proceed with the checkout!");
      return;
    }
    setStep("shipping");
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shippingAddress.fullName ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      alert("Please fill in all the shipping address fields!");
      return;
    }
    setStep("payment");
  };

  const handleCompletePayment = async () => {
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
      console.error(err);
    } finally {
      setPlacingOrderLoader(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-emerald-800" />
            <h2 className="font-sans font-bold text-lg text-stone-800">
              {step === "cart" && "Your Shopping Cart"}
              {step === "shipping" && "Shipping Address Information"}
              {step === "payment" && "Confirm Secure Payment"}
              {step === "success" && "Order Placed Successfully!"}
            </h2>
          </div>
          {step !== "success" && (
            <button onClick={onClose} className="p-1.5 hover:bg-stone-200 rounded-full text-stone-500">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Cart Items */}
          {step === "cart" && (
            <div className="space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 bg-stone-50 text-stone-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <p className="text-stone-500 text-sm">Your shopping cart is currently empty.</p>
                  <button onClick={onClose} className="mt-4 bg-emerald-800 text-white px-5 py-2 rounded-full text-xs font-semibold">
                    Go Back to Shop
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.cartId} className="flex items-center justify-between border-b border-stone-100 pb-4">
                      <div className="flex items-center space-x-3">
                        <img src={item.product.imageUrl} alt={item.product.name} className="h-14 w-14 object-cover rounded-lg border border-stone-100" />
                        <div>
                          <h4 className="font-semibold text-stone-800 text-xs sm:text-sm line-clamp-1">{item.product.name}</h4>
                          <p className="text-stone-400 text-xs font-mono">₹{item.product.price} each</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Quantity adjuster */}
                        <div className="flex items-center border border-stone-200 rounded-full overflow-hidden text-xs bg-stone-50">
                          <button
                            disabled={item.quantity <= 1}
                            onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                            className="px-2.5 py-1 hover:bg-stone-100 disabled:opacity-35"
                          >
                            -
                          </button>
                          <span className="px-2 font-bold text-stone-800 font-mono">{item.quantity}</span>
                          <button
                            disabled={item.quantity >= item.product.stock}
                            onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                            className="px-2.5 py-1 hover:bg-stone-100"
                          >
                            +
                          </button>
                        </div>

                        {/* Total price & remove */}
                        <div className="text-right">
                          <p className="font-bold text-stone-800 text-sm font-mono">₹{item.product.price * item.quantity}</p>
                          <button onClick={() => onRemoveItem(item.cartId)} className="text-[10px] text-rose-500 hover:underline">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Coupon Codes Panel */}
                  <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 mt-6">
                    <div className="flex items-center space-x-2 text-xs font-bold text-stone-700 uppercase mb-3">
                      <Ticket className="h-4 w-4 text-emerald-800" />
                      <span>Have a discount coupon?</span>
                    </div>

                    {appliedCoupon ? (
                      <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                        <div>
                          <span className="text-xs font-bold text-emerald-800">Coupon {appliedCoupon} Applied!</span>
                          <p className="text-[10px] text-emerald-600">Enjoy {couponDiscountPercent}% discount on your entire cart items.</p>
                        </div>
                        <button onClick={handleRemoveCoupon} className="text-xs text-rose-500 font-bold hover:underline">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Try 'PURE20' or 'NATURAL15'"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800 placeholder-stone-400 uppercase font-mono"
                        />
                        <button onClick={handleApplyCoupon} className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-xl">
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Shipping Info Form */}
          {step === "shipping" && (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Full Delivery Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Address Line</label>
                <input
                  type="text"
                  required
                  placeholder="Street address, apartment, flat number..."
                  value={shippingAddress.addressLine}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800 text-stone-800"
                  />
                </div>
              </div>

              <button type="submit" id="btn-submit-shipping" className="hidden" />
            </form>
          )}

          {/* Step 3: Secure Payment Gate Mock */}
          {step === "payment" && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Select Payment Mode:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  <div
                    onClick={() => setPaymentMethod("UPI")}
                    className={`border rounded-xl p-4 cursor-pointer flex items-center space-x-3 transition-all ${
                      paymentMethod === "UPI"
                        ? "border-emerald-800 bg-emerald-50/40 ring-1 ring-emerald-800"
                        : "border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <Landmark className="h-5 w-5 text-emerald-800" />
                    <div>
                      <p className="font-semibold text-xs text-stone-800">BHIM / UPI</p>
                      <p className="text-[10px] text-stone-400">GPay, PhonePe</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("Card")}
                    className={`border rounded-xl p-4 cursor-pointer flex items-center space-x-3 transition-all ${
                      paymentMethod === "Card"
                        ? "border-emerald-800 bg-emerald-50/40 ring-1 ring-emerald-800"
                        : "border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-emerald-800" />
                    <div>
                      <p className="font-semibold text-xs text-stone-800">Cards</p>
                      <p className="text-[10px] text-stone-400">Visa, Mastercard</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("Cash")}
                    className={`border rounded-xl p-4 cursor-pointer flex items-center space-x-3 transition-all ${
                      paymentMethod === "Cash"
                        ? "border-emerald-800 bg-emerald-50/40 ring-1 ring-emerald-800"
                        : "border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <Wallet className="h-5 w-5 text-emerald-800" />
                    <div>
                      <p className="font-semibold text-xs text-stone-800">COD</p>
                      <p className="text-[10px] text-stone-400">Cash on delivery</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure checkout info */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-start space-x-3">
                <ShieldCheck className="h-5 w-5 text-emerald-800 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-stone-800 uppercase tracking-wide">SSL Encypted Payment Node</h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                    We accept secure payments powered by Razorpay and Stripe. Your credentials are fully protected. Refund guarantee valid up to 15 days from delivery.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success confirmation screen */}
          {step === "success" && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="h-16 w-16 text-emerald-800 mx-auto animate-bounce" />
              <div className="space-y-1">
                <h3 className="font-sans font-black text-xl text-stone-800">Thank you for your Order!</h3>
                <p className="text-xs text-stone-500">Your order has been logged and is under processing.</p>
              </div>

              <div className="bg-stone-50 border rounded-2xl p-5 max-w-sm mx-auto text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-500">Tracking ID:</span>
                  <span className="font-mono font-bold text-emerald-800">{orderTrackingNumber}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-500">Shipped to:</span>
                  <span className="text-stone-700 font-medium truncate max-w-[200px]">{shippingAddress.fullName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-500">Payment Mode:</span>
                  <span className="text-stone-700 font-medium">{paymentMethod}</span>
                </div>
                <div className="flex justify-between text-xs border-t border-stone-100 pt-2 font-bold text-stone-800">
                  <span>Grand Total:</span>
                  <span className="font-mono">₹{grandTotal}</span>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={onClose}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Summary Footer */}
        {step !== "success" && cartItems.length > 0 && (
          <div className="bg-stone-50 border-t border-stone-150 p-6 space-y-4">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Cart Subtotal ({cartItems.length} items):</span>
                <span className="font-mono">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon discount:</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="flex items-center space-x-1">
                  <Truck className="h-3.5 w-3.5 text-stone-400" />
                  <span>Delivery Charges:</span>
                </span>
                <span className="font-mono">{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 text-stone-800 font-extrabold text-sm sm:text-base">
                <span>Grand Total:</span>
                <span className="font-mono text-emerald-800">₹{grandTotal}</span>
              </div>
            </div>

            {/* Stepper controls */}
            <div className="flex justify-between pt-2">
              {step === "cart" && (
                <button
                  onClick={() => {
                    if (onProceedToCheckoutPage) {
                      onProceedToCheckoutPage();
                    } else {
                      handleNextToShipping();
                    }
                  }}
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white py-3.5 rounded-full text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-800/10 active:scale-95 transition-all"
                >
                  <span>Proceed to Secure Checkout Page</span>
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              )}

              {step === "shipping" && (
                <div className="flex w-full space-x-3">
                  <button onClick={() => setStep("cart")} className="px-5 py-3 border border-stone-200 bg-white hover:bg-stone-50 rounded-full text-stone-600 text-xs font-semibold">
                    Back
                  </button>
                  <button
                    onClick={() => {
                      const hiddenBtn = document.getElementById("btn-submit-shipping");
                      if (hiddenBtn) hiddenBtn.click();
                    }}
                    className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white py-3 rounded-full text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <span>Proceed to Payment</span>
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              )}

              {step === "payment" && (
                <div className="flex w-full space-x-3">
                  <button onClick={() => setStep("shipping")} className="px-5 py-3 border border-stone-200 bg-white hover:bg-stone-50 rounded-full text-stone-600 text-xs font-semibold">
                    Back
                  </button>
                  <button
                    disabled={placingOrderLoader}
                    onClick={handleCompletePayment}
                    className="flex-1 bg-stone-900 hover:bg-stone-850 text-white py-3 rounded-full text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    <span>{placingOrderLoader ? "Processing secure payment..." : "Complete Secure Checkout"}</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
