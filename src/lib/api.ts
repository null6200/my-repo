const API_BASE = '/api';

export interface Product {
  _id?: string;
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  texture_shot_url?: string;
  ph_level?: number;
  key_ingredients?: string;
  skin_type_recommendation?: string;
  inventory_status?: string;
  stock_quantity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  state: string;
  country: string;
  postal_code?: string;
  total_amount: number;
  order_status?: string;
  payment_status?: string;
  paystack_reference?: string;
  order_items: any[];
  created_at?: string;
  updated_at?: string;
}

class ApiClient {
  async getProducts(): Promise<{ items: Product[] }> {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
  }

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  }

  async getOrders(): Promise<{ items: Order[] }> {
    const response = await fetch(`${API_BASE}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  }
}

export const api = new ApiClient();

export function formatPrice(price: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
  }).format(price);
}
