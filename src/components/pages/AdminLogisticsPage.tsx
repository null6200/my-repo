import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, Truck, Plus, Edit, Trash2, Save } from 'lucide-react';
import { formatPrice } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LogisticsCompany {
  id: string;
  name: string;
  code: string;
}

interface PickupLocation {
  id: string;
  companyCode: string;
  state: string;
  locationName: string;
  address: string;
  price: number;
}

const COMPANIES: LogisticsCompany[] = [
  { id: '1', name: 'GUO Transport', code: 'GUO' },
  { id: '2', name: 'GIG Logistics', code: 'GIG' },
  { id: '3', name: 'ABC Transport', code: 'ABC' },
  { id: '4', name: 'PARK Logistics', code: 'PARK' }
];

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
];

export default function AdminLogisticsPage() {
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<PickupLocation | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  const [formData, setFormData] = useState({
    companyCode: '',
    state: '',
    locationName: '',
    address: '',
    price: 0
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/logistics/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations || []);
      }
    } catch (error) {
      console.error('Failed to load locations:', error);
      // Load sample data for now
      setLocations([
        { id: '1', companyCode: 'GUO', state: 'Lagos', locationName: 'Ikeja Terminal', address: '123 Ikeja Way', price: 2500 },
        { id: '2', companyCode: 'GUO', state: 'Lagos', locationName: 'Oshodi Hub', address: '45 Oshodi Road', price: 2500 },
        { id: '3', companyCode: 'GIG', state: 'Lagos', locationName: 'Ikeja Hub', address: '67 Allen Avenue', price: 2000 },
        { id: '4', companyCode: 'ABC', state: 'Lagos', locationName: 'Ojota Terminal', address: '89 Ikorodu Road', price: 1800 },
      ]);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLocation) {
      // Update existing location
      setLocations(prev => prev.map(loc => 
        loc.id === editingLocation.id 
          ? { ...loc, ...formData }
          : loc
      ));
    } else {
      // Add new location
      const newLocation: PickupLocation = {
        id: Date.now().toString(),
        ...formData
      };
      setLocations(prev => [...prev, newLocation]);
    }

    // Reset form
    setFormData({
      companyCode: '',
      state: '',
      locationName: '',
      address: '',
      price: 0
    });
    setShowForm(false);
    setEditingLocation(null);

    // TODO: Save to database
    alert('Location saved! (Database integration pending)');
  };

  const handleEdit = (location: PickupLocation) => {
    setEditingLocation(location);
    setFormData({
      companyCode: location.companyCode,
      state: location.state,
      locationName: location.locationName,
      address: location.address,
      price: location.price
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this location?')) {
      setLocations(prev => prev.filter(loc => loc.id !== id));
      // TODO: Delete from database
    }
  };

  const filteredLocations = locations.filter(loc => {
    const matchesCompany = selectedCompany === 'all' || loc.companyCode === selectedCompany;
    const matchesState = selectedState === 'all' || loc.state === selectedState;
    return matchesCompany && matchesState;
  });

  const getCompanyName = (code: string) => {
    return COMPANIES.find(c => c.code === code)?.name || code;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
              className="flex items-center gap-2 px-6 py-3 font-paragraph font-semibold text-secondary hover:text-accent-pink transition-colors"
            >
              <TrendingUp size={20} />
              Sales & Orders
            </Link>
            <Link
              to="/admin/logistics"
              className="flex items-center gap-2 px-6 py-3 font-paragraph font-semibold text-accent-pink border-b-2 border-accent-pink"
            >
              <Truck size={20} />
              Logistics Management
            </Link>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-3xl text-foreground mb-2">Logistics Management</h2>
              <p className="font-paragraph text-secondary">Manage pickup locations and shipping prices</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingLocation(null);
                setFormData({
                  companyCode: '',
                  state: '',
                  locationName: '',
                  address: '',
                  price: 0
                });
              }}
              className="bg-accent-pink text-white font-paragraph font-bold px-8 py-4 rounded-lg hover:bg-accent-purple transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Location
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-paragraph text-sm text-foreground mb-2 block">Filter by Company</label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent-pink"
                >
                  <option value="all">All Companies</option>
                  {COMPANIES.map(company => (
                    <option key={company.code} value={company.code}>{company.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-paragraph text-sm text-foreground mb-2 block">Filter by State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent-pink"
                >
                  <option value="all">All States</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Locations Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-pink"></div>
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="text-center py-20">
                <Truck className="w-16 h-16 text-secondary/40 mx-auto mb-4" />
                <p className="font-paragraph text-secondary">No pickup locations found</p>
                <p className="font-paragraph text-sm text-secondary mt-2">Add your first location to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Company</th>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">State</th>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Location Name</th>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Address</th>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Price</th>
                      <th className="px-6 py-4 text-left font-paragraph text-sm font-bold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLocations.map((location) => (
                      <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm font-semibold text-foreground">
                            {getCompanyName(location.companyCode)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm text-foreground">{location.state}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm font-medium text-foreground">{location.locationName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm text-secondary">{location.address}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm font-bold text-accent-pink">
                            {formatPrice(location.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(location)}
                              className="p-2 text-accent-pink hover:bg-accent-pink/10 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(location.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
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

      {/* Add/Edit Location Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-accent-pink to-accent-purple p-6 flex items-center justify-between">
              <h2 className="font-heading text-2xl text-white">
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingLocation(null);
                }}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <Trash2 size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="bg-accent-lavender/10 p-4 rounded-lg border-2 border-accent-pink/30">
                <label className="font-paragraph text-base font-bold text-accent-purple mb-2 block">
                  Logistics Company *
                </label>
                <select
                  required
                  value={formData.companyCode}
                  onChange={(e) => setFormData({ ...formData, companyCode: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-foreground font-paragraph focus:outline-none focus:border-accent-pink rounded-lg"
                >
                  <option value="">Select Company</option>
                  {COMPANIES.map(company => (
                    <option key={company.code} value={company.code}>{company.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-accent-lavender/10 p-4 rounded-lg border-2 border-accent-pink/30">
                <label className="font-paragraph text-base font-bold text-accent-purple mb-2 block">
                  State *
                </label>
                <select
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-foreground font-paragraph focus:outline-none focus:border-accent-pink rounded-lg"
                >
                  <option value="">Select State</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-paragraph text-sm text-foreground mb-2 block">
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  placeholder="e.g., Ikeja Terminal, Oshodi Hub"
                  className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-paragraph text-sm text-foreground mb-2 block">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g., 123 Main Street, Ikeja"
                  className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
                />
              </div>

              <div className="bg-accent-lavender/10 p-4 rounded-lg border-2 border-accent-pink/30">
                <label className="font-paragraph text-base font-bold text-accent-purple mb-2 block">
                  Shipping Price (₦) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="100"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 2500"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-foreground font-paragraph focus:outline-none focus:border-accent-pink rounded-lg"
                />
                <p className="mt-2 text-sm text-secondary">
                  Set the shipping cost for this location
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-accent-pink text-white font-paragraph font-bold px-8 py-4 rounded-lg hover:bg-accent-purple transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingLocation ? 'Update Location' : 'Add Location'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingLocation(null);
                  }}
                  className="px-8 py-4 border-2 border-gray-300 text-foreground font-paragraph font-medium rounded-lg hover:border-accent-pink hover:text-accent-pink transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
