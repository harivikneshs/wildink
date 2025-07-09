export interface AirtableRecord<T = any> {
  id: string;
  createdTime: string;
  fields: T;
}

export interface AirtableResponse<T = any> {
  records: AirtableRecord<T>[];
  offset?: string;
}

export interface AirtableError {
  error: {
    type: string;
    message: string;
  };
}

// Product types
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  isNew: boolean;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

// Order types
export interface Order {
  id: string;
  customerId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// Customer types
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}
