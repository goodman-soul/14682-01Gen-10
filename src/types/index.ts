export interface SiteConfig {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  language: string;
  languageCode: string;
  themeColor: string;
  themeGradient: string;
  logistics: {
    enabled: boolean;
    providers: string[];
    estimatedDays: string;
    tips: string;
  };
  tax: {
    enabled: boolean;
    rate: number;
    description: string;
  };
  status: "active" | "inactive" | "configuring";
  missingConfigs: string[];
}

export interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Address {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface LogisticsInfo {
  provider: string;
  trackingNo: string;
  estimatedDelivery: string;
  status: string;
}

export interface TaxInfo {
  rate: number;
  amount: number;
  description: string;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderNo: string;
  siteId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: Address;
  logisticsInfo?: LogisticsInfo;
  taxInfo?: TaxInfo;
}

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  image: string;
  siteId: string;
  quantity: number;
  reserved: number;
  available: number;
  warehouse: string;
  lastUpdated: string;
  alertThreshold: number;
}

export type AdStatus = "active" | "paused" | "ended";

export interface AdCampaign {
  id: string;
  name: string;
  siteId: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  status: AdStatus;
  startDate: string;
  endDate: string;
}

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  inventoryAlerts: number;
  adSpent: number;
  orderGrowth: number;
  revenueGrowth: number;
}

export interface ConfigIssue {
  type: "logistics" | "tax" | "payment" | "other";
  severity: "warning" | "error";
  message: string;
  action?: string;
  actionLink?: string;
}
