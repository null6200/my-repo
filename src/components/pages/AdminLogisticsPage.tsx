import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, Truck, Plus, Edit, Trash2, Save, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/api';

interface LogisticsCompany {
  id: number;
  name: string;
  code: string;
  base_price: number;
  is_active: boolean;
}

interface PickupLocation {
  id: number;
  company_id: number;
  company_code: string;
  company_name: string;
  state: string;
  location_name: string;
  address: string;
  is_active: boolean;
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
];

export default function AdminLogisticsPage() {
  const [companies, setCompanies] = useState<LogisticsCompany[]>([]);
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<PickupLocation | null>(null);
  const [editingCompany, setEditingCompany] = useState<LogisticsCompany | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  const [locationFormData, setLocationFormData] = useState({
    company_id: 0,
    state: '',
    location_name: '',
    address: ''
  });

  const [priceFormData, setPriceFormData] = useState({
    base_price: 0
  });

  useEffect(() => {
    loadCompanies();
    loadLocations();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await fetch('/api/logistics/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies || []);
      }
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  };

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
    }
    setIsLoading(false);
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingLocation ? 'PUT' : 'POST';
      const body = editingLocation 
        ? { ...locationFormData, id: editingLocation.id }
        : locationFormData;

      const response = await fetch('/api/logistics/locations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await loadLocations();
        setShowLocationForm(false);
        setEditingLocation(null);
        setLocationFormData({ company_id: 0, state: '', location_name: '', address: '' });
        alert(editingLocation ? 'Location updated!' : 'Location added!');
      } else {
        alert('Failed to save location');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Error saving location');
    }
  };

  const handlePriceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCompany) return;

    try {
      const response = await fetch('/api/logistics/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCompany.id,
          name: editingCompany.name,
          code: editingCompany.code,
          base_price: priceFormData.base_price,
          is_active: editingCompany.is_active
        })
      });

      if (response.ok) {
        await loadCompanies();
        setShowPriceModal(false);
        setEditingCompany(null);
        alert('Price updated successfully!');
      } else {
        alert('Failed to update price');
      }
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Error updating price');
    }
  };

  const handleEditLocation = (location: PickupLocation) => {
    setEditingLocation(location);
    setLocationFormData({
      company_id: location.company_id,
      state: location.state,
      location_name: location.location_name,
      address: location.address
    });
    setShowLocationForm(true);
  };

  const handleEditPrice = (company: LogisticsCompany) => {
    setEditingCompany(company);
    setPriceFormData({ base_price: company.base_price });
    setShowPriceModal(true);
  };

  const handleDeleteLocation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const response = await fetch('/api/logistics/locations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        await loadLocations();
        alert('Location deleted!');
      } else {
        alert('Failed to delete location');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Error deleting location');
    }
  };

  const filteredLocations = locations.filter(loc => {
    const matchesCompany = selectedCompany === 'all' || loc.company_code === selectedCompany;
    const matchesState = selectedState === 'all' || loc.state === selectedState;
    return matchesCompany && matchesState;
  });

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
                setShowLocationForm(true);
                setEditingLocation(null);
                setLocationFormData({ company_id: 0, state: '', location_name: '', address: '' });
              }}
              className="bg-accent-pink text-white font-paragraph font-bold px-8 py-4 rounded-lg hover:bg-accent-purple transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Location
            </button>
          </div>

          {/* Companies Price Management */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
            <h3 className="font-heading text-xl text-foreground mb-4">Logistics Companies & Prices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {companies.map(company => (
                <div key={company.id} className="bg-gradient-to-br from-accent-lavender/20 to-accent-pink/10 p-4 rounded-lg border-2 border-accent-pink/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-paragraph font-bold text-foreground">{company.name}</h4>
                      <p className="text-sm text-secondary">{company.code}</p>
                    </div>
                    <button
                      onClick={() => handleEditPrice(company)}
                      className="p-2 text-accent-pink hover:bg-accent-pink/10 rounded transition-colors"
                      title="Edit Price"
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-accent-pink/20">
                    <p className="text-xs text-secondary mb-1">Base Price:</p>
                    <p className="font-heading text-2xl text-accent-pink font-bold">
                      {formatPrice(company.base_price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
                  {companies.map(company => (
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
                            {location.company_name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm text-foreground">{location.state}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm font-medium text-foreground">{location.location_name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm text-secondary">{location.address}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-paragraph text-sm font-bold text-accent-pink">
                            {formatPrice(companies.find(c => c.id === location.company_id)?.base_price || 0)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditLocation(location)}
                              className="p-2 text-accent-pink hover:bg-accent-pink/10 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteLocation(location.id)}
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

      {/* Edit Price Modal */}
      {showPriceModal && editingCompany && (
        <div className="fixed inset-0 bg-foreground/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-accent-pink to-accent-purple p-6">
              <h2 className="font-heading text-2xl text-white">Edit {editingCompany.name} Price</h2>
            </div>

            <form onSubmit={handlePriceSubmit} className="p-6 space-y-6">
              <div className="bg-accent-lavender/10 p-4 rounded-lg border-2 border-accent-pink/30">
                <label className="font-paragraph text-base font-bold text-accent-purple mb-2 block">
                  Base Price (₦) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="100"
                  value={priceFormData.base_price}
                  onChange={(e) => setPriceFormData({ base_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-foreground font-paragraph focus:outline-none focus:border-accent-pink rounded-lg text-xl font-bold"
                />
                <p className="mt-2 text-sm text-secondary">
                  This price applies to ALL {editingCompany.name} locations
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-accent-pink text-white font-paragraph font-bold px-8 py-4 rounded-lg hover:bg-accent-purple transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Update Price
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPriceModal(false);
                    setEditingCompany(null);
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

      {/* Add/Edit Location Modal */}
      {showLocationForm && (
        <div className="fixed inset-0 bg-foreground/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-accent-pink to-accent-purple p-6 flex items-center justify-between">
              <h2 className="font-heading text-2xl text-white">
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </h2>
              <button
                onClick={() => {
                  setShowLocationForm(false);
                  setEditingLocation(null);
                }}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLocationSubmit} className="p-6 space-y-6">
              <div className="bg-accent-lavender/10 p-4 rounded-lg border-2 border-accent-pink/30">
                <label className="font-paragraph text-base font-bold text-accent-purple mb-2 block">
                  Logistics Company *
                </label>
                <select
                  required
                  value={locationFormData.company_id}
                  onChange={(e) => setLocationFormData({ ...locationFormData, company_id: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-foreground font-paragraph focus:outline-none focus:border-accent-pink rounded-lg"
                >
                  <option value="0">Select Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-accent-lavender/10 p-4 rounded-lg border-2 border-accent-pink/30">
                <label className="font-paragraph text-base font-bold text-accent-purple mb-2 block">
                  State *
                </label>
                <select
                  required
                  value={locationFormData.state}
                  onChange={(e) => setLocationFormData({ ...locationFormData, state: e.target.value })}
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
                  value={locationFormData.location_name}
                  onChange={(e) => setLocationFormData({ ...locationFormData, location_name: e.target.value })}
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
                  value={locationFormData.address}
                  onChange={(e) => setLocationFormData({ ...locationFormData, address: e.target.value })}
                  placeholder="e.g., 123 Main Street, Ikeja"
                  className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
                />
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
                    setShowLocationForm(false);
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
    </div>
  );
}
