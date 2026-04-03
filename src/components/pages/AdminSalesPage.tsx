import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, DollarSign, ShoppingBag, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/api';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingCost: number;
  logistics: string;
  pickupLocation: string;
  state: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  createdAt: string;
}

export default function AdminSalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
    setIsLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        loadOrders();
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus;
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter(o => o.status === 'Pending').length,
    deliveredOrders: orders.filter(o => o.status === 'Delivered').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full py-12">
        <div className="max-w-[120rem] mx-auto px-8">
          <div className="mb-8">
            <h1 className="font-heading text-4xl text-foreground mb-2">Admin Dashboard</h1>
            <p className="font-paragraph text-secondary">Manage your store</p>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <Link
              to="/admin"
              className="flex items-center gap-2 px-6 py-3 font-paragraph font-semibold text-secondary hover:text-accent-pink transition-colors"
            >
              <Package size={20} />
              Products
            </Link>
            <Link
              to="/admin/sales"
              className="flex items-center gap-2 px-6 py-3 font-paragraph font-semibold text-accent-pink border-b-2 border-accent-pink"
            >
              <TrendingUp size={20} />
              Sales & Orders
            </Link>
            <Link
              to="/admin/logistics"
              className="flex items-center gap-2 px-6 py-3 font-paragraph font-semibold text-secondary hover:text-accent-pink transition-colors"
            >
              <Truck size={20} />
              Logistics Management
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="font-heading text-3xl text-foreground mb-2">Sales & Orders</h2>
            <p className="font-paragraph text-secondary">Manage and track all customer orders</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-paragraph text-sm text-secondary">Total Orders</span>
                <ShoppingBag className="w-5 h-5 text-accent-pink" />
              </div>
              <p className="font-heading text-3xl text-foreground">{stats.totalOrders}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-paragraph text-sm text-secondary">Total Revenue</span>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="font-heading text-3xl text-foreground">{formatPrice(stats.totalRevenue)}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-paragraph text-sm text-secondary">Pending</span>
                <Package className="w-5 h-5 text-orange-500" />
              </div>
              <p className="font-heading text-3xl text-foreground">{stats.pendingOrders}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-paragraph text-sm text-secondary">Delivered</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="font-heading text-3xl text-foreground">{stats.deliveredOrders}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-paragraph text-sm text-foreground mb-2 block">Search Orders</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by order number, name, or email..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent-pink"
                />
              </div>

              <div>
                <label className="font-paragraph text-sm text-foreground mb-2 block">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent-pink"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-pink"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-secondary/40 mx-auto mb-4" />
                <p className="font-paragraph text-secondary">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Order #</th>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Customer</th>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Items</th>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Total</th>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Logistics</th>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Status</th>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Date</th>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm font-semibold text-accent-pink">
                            {order.orderNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-paragraph text-sm font-medium text-foreground">{order.customerName}</p>
                            <p className="font-paragraph text-xs text-secondary">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm text-foreground">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm font-bold text-foreground">
                            {formatPrice(order.total)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-paragraph text-sm text-foreground">{order.logistics}</p>
                            <p className="font-paragraph text-xs text-secondary">{order.pickupLocation}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-300' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                              'bg-gray-100 text-gray-800 border-gray-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm text-secondary">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="font-paragraph text-sm text-accent-pink hover:text-accent-purple font-semibold">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
