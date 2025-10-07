export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  retailPrice: number;
  wholesalePrice: number;
  minimumWholesaleQuantity: number;
  image: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  benefits: string[];
  ingredients: string[];
  createdAt: Date;
  updatedAt: Date;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  priceType: 'retail' | 'wholesale';
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  subTotal: number;
  tax: number;
  shippingFee: number;
  discount?: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  notes?: string;
}

export interface AdminSettings {
  storeHours: { open: string; close: string; days: string[] } | null;
  days: string[];
  privacyPolicy: string | number | readonly string[] | undefined;
  shippingPolicy: string | number | readonly string[] | undefined;
  returnPolicy: string | number | readonly string[] | undefined;
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  whatsappNumber: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  minimumOrderAmount: number;
  invoiceNotes: string;
}

export interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
  topProducts: Array<{
    product: Product;
    orderCount: number;
    revenue: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
}