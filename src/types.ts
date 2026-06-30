export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  skinType?: 'Oily' | 'Dry' | 'Combination' | 'Sensitive' | 'Normal' | null;
  concerns?: string[]; // e.g., ['Acne', 'Pigmentation', 'Tan Removal', 'Dullness', 'Dryness', 'Anti-Aging', 'Dark Spots']
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Face Powders' | 'Herbal Powders' | 'Soaps' | 'Scrubs' | 'Mists & Toners' | 'Combo Packs';
  price: number;
  description: string;
  benefits: string[];
  ingredients: string[];
  usage: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  skinTypes: ('Oily' | 'Dry' | 'Combination' | 'Sensitive' | 'Normal')[];
  concerns: string[];
  stock: number;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  couponCode: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
  trackingNumber?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  category: 'Natural Beauty Tips' | 'DIY Face Packs' | 'Ingredient Benefits' | 'Skincare Routines';
  imageUrl: string;
  author: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
