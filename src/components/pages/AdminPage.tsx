import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, X, Package, TrendingUp, Truck } from 'lucide-react';
import { SkincareProducts } from '@/entities';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ImageUpload } from '@/components/ui/image-upload';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminPage() {
  const [products, setProducts] = useState<SkincareProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SkincareProducts | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const result = await api.getProducts();
      setProducts(result.items || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  const handleEdit = (product: SkincareProducts) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="w-full py-12">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="mb-8">
            <h1 className="font-heading text-4xl text-foreground mb-2">Admin Dashboard</h1>
            <p className="font-paragraph text-secondary">Manage your store</p>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <Link
              to="/admin"
              className="flex items-center gap-2 px-6 py-3 font-paragraph font-semibold text-accent-pink border-b-2 border-accent-pink"
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
              className="flex items-center gap-2 px-6 py-3 font-paragraph font-semibold text-secondary hover:text-accent-pink transition-colors"
            >
              <Truck size={20} />
              Logistics Management
            </Link>
          </div>

          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl text-foreground mb-2">
                Product Catalog
              </h2>
              <p className="font-paragraph text-secondary">
                Manage your products and inventory
              </p>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="bg-accent-pink text-white font-paragraph font-bold px-8 py-4 rounded-lg hover:bg-accent-purple transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : products.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 gap-6"
              >
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-background border border-secondary/20 p-6 hover:border-primary transition-colors"
                  >
                    <div className="flex gap-6">
                      {product.itemImage && (
                        <div className="w-32 h-32 bg-primary/10 flex-shrink-0">
                          <img
                            src={product.itemImage}
                            alt={product.itemName || 'Product'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-heading text-2xl text-foreground">
                              {product.itemName}
                            </h3>
                            <p className="font-paragraph text-sm text-secondary mt-1">
                              ₦{typeof product.itemPrice === 'number' ? product.itemPrice.toFixed(2) : parseFloat(product.itemPrice || '0').toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 hover:bg-primary/20 transition-colors"
                              aria-label="Edit product"
                            >
                              <Edit className="w-5 h-5 text-foreground" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 hover:bg-destructive/10 transition-colors"
                              aria-label="Delete product"
                            >
                              <Trash2 className="w-5 h-5 text-destructive" />
                            </button>
                          </div>
                        </div>
                        
                        {product.itemDescription && (
                          <p className="font-paragraph text-sm text-secondary line-clamp-2">
                            {product.itemDescription}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 pt-2">
                          {product.stockQuantity !== undefined && (
                            <span className="font-paragraph text-xs font-semibold bg-accent-pink/10 text-accent-pink px-3 py-1 rounded">
                              Stock: {product.stockQuantity} units
                            </span>
                          )}
                          {product.phLevel !== undefined && product.phLevel !== null && (
                            <span className="font-paragraph text-xs text-secondary">
                              pH: {product.phLevel}
                            </span>
                          )}
                          {product.skinTypeRecommendation && (
                            <span className="font-paragraph text-xs text-secondary">
                              {product.skinTypeRecommendation}
                            </span>
                          )}
                          {product.inventoryStatus && (
                            <span className="font-paragraph text-xs bg-accent-gold/20 text-foreground px-2 py-1">
                              {product.inventoryStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <p className="font-paragraph text-lg text-secondary mb-6">
                  No products yet. Add your first product to get started.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-primary text-primary-foreground font-paragraph font-medium px-6 py-3 hover:opacity-90 transition-opacity"
                >
                  Add Product
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          onSave={loadProducts}
        />
      )}

      <Footer />
    </div>
  );
}

interface ProductFormProps {
  product: SkincareProducts | null;
  onClose: () => void;
  onSave: () => void;
}

function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState({
    itemName: product?.itemName || '',
    itemPrice: product?.itemPrice || 0,
    category: product?.itemDescription?.toLowerCase().includes('serum') ? 'Serums' :
              product?.itemDescription?.toLowerCase().includes('sunscreen') ? 'Sunscreen' :
              product?.itemDescription?.toLowerCase().includes('body wash') ? 'Body Wash' :
              product?.itemDescription?.toLowerCase().includes('face') ? 'Face' :
              product?.itemDescription?.toLowerCase().includes('lotion') ? 'Body Lotions' : '',
    itemImage: product?.itemImage || '',
    itemDescription: product?.itemDescription || '',
    phLevel: product?.phLevel || 0,
    keyIngredients: product?.keyIngredients || '',
    skinTypeRecommendation: product?.skinTypeRecommendation || '',
    textureShot: product?.textureShot || '',
    inventoryStatus: product?.inventoryStatus || 'In Stock',
    stockQuantity: product?.stockQuantity || 0
  });
  const [isSaving, setIsSaving] = useState(false);

  // Parse existing skin types from comma-separated string
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(
    product?.skinTypeRecommendation 
      ? product.skinTypeRecommendation.split(',').map(s => s.trim())
      : []
  );

  const skinTypeOptions = ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'];

  const handleSkinTypeToggle = (skinType: string) => {
    setSelectedSkinTypes(prev => 
      prev.includes(skinType)
        ? prev.filter(t => t !== skinType)
        : [...prev, skinType]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Map form data to API expected format
      const productData = {
        name: formData.itemName,
        price: formData.itemPrice,
        description: `${formData.category} - ${formData.itemDescription}`,
        image_url: formData.itemImage,
        texture_shot_url: formData.textureShot,
        ph_level: formData.phLevel,
        key_ingredients: formData.keyIngredients,
        skin_type_recommendation: selectedSkinTypes.join(', '),
        inventory_status: formData.inventoryStatus,
        stock_quantity: formData.stockQuantity,
      };

      if (product) {
        await api.updateProduct(product._id, productData);
      } else {
        await api.createProduct(productData);
      }

      setIsSaving(false);
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-3xl p-6 my-4 rounded-xl shadow-2xl max-h-[95vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-3 border-b-2 border-accent-pink">
          <h2 className="font-heading text-2xl text-accent-purple">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent-pink/10 rounded-full transition-colors"
            aria-label="Close form"
          >
            <X className="w-6 h-6 text-accent-pink" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name & Price - Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent-lavender/10 p-3 rounded-lg border border-accent-pink/30">
              <label className="font-paragraph text-sm font-bold text-accent-purple mb-1 block">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-foreground font-paragraph text-sm focus:outline-none focus:border-accent-pink rounded"
                placeholder="Enter product name"
              />
            </div>

            <div className="bg-accent-lavender/10 p-3 rounded-lg border border-accent-pink/30">
              <label className="font-paragraph text-sm font-bold text-accent-purple mb-1 block">
                Price (₦) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.itemPrice}
                onChange={(e) => setFormData({ ...formData, itemPrice: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-foreground font-paragraph text-sm focus:outline-none focus:border-accent-pink rounded"
                placeholder="e.g., 12500"
              />
            </div>
          </div>

          {/* Category & Stock - Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent-lavender/10 p-3 rounded-lg border border-accent-pink/30">
              <label className="font-paragraph text-sm font-bold text-accent-purple mb-1 block">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-foreground font-paragraph text-sm focus:outline-none focus:border-accent-pink rounded"
              >
                <option value="">Select a category</option>
                <option value="Serums">Serums</option>
                <option value="Sunscreen">Sunscreen</option>
                <option value="Body Wash">Body Wash</option>
                <option value="Face">Face</option>
                <option value="Body Lotions">Body Lotions</option>
                <option value="Oils & Serums">Oils & Serums</option>
                <option value="Treatments">Treatments</option>
              </select>
            </div>

            <div className="bg-accent-lavender/10 p-3 rounded-lg border border-accent-pink/30">
              <label className="font-paragraph text-sm font-bold text-accent-purple mb-1 block">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-foreground font-paragraph text-sm focus:outline-none focus:border-accent-pink rounded"
                placeholder="e.g., 50"
              />
            </div>
          </div>

          <div>
            <ImageUpload
              label="Product Image"
              value={formData.itemImage}
              onChange={(url) => setFormData({ ...formData, itemImage: url })}
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground mb-2 block">
              Description
            </label>
            <textarea
              value={formData.itemDescription}
              onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-paragraph text-sm text-foreground mb-2 block">
                pH Level
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.phLevel}
                onChange={(e) => setFormData({ ...formData, phLevel: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-foreground mb-2 block">
                Inventory Status
              </label>
              <select
                value={formData.inventoryStatus}
                onChange={(e) => setFormData({ ...formData, inventoryStatus: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
              >
                <option value="In Stock">In Stock</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-paragraph text-sm text-foreground mb-2 block">
              Key Ingredients
            </label>
            <input
              type="text"
              value={formData.keyIngredients}
              onChange={(e) => setFormData({ ...formData, keyIngredients: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
              placeholder="e.g., Hyaluronic Acid, Niacinamide, Vitamin C"
            />
          </div>

          <div className="bg-accent-lavender/10 p-4 rounded-lg border-2 border-accent-pink/30">
            <label className="font-paragraph text-base font-bold text-accent-purple mb-3 block">
              Skin Type Recommendation
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skinTypeOptions.map((skinType) => (
                <label
                  key={skinType}
                  className="flex items-center gap-2 bg-white p-3 rounded-lg border-2 border-gray-200 hover:border-accent-pink cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSkinTypes.includes(skinType)}
                    onChange={() => handleSkinTypeToggle(skinType)}
                    className="w-5 h-5 text-accent-pink border-gray-300 rounded focus:ring-accent-pink focus:ring-2"
                  />
                  <span className="font-paragraph text-sm font-medium text-foreground">
                    {skinType}
                  </span>
                </label>
              ))}
            </div>
            {selectedSkinTypes.length > 0 && (
              <p className="mt-3 text-sm text-secondary">
                Selected: {selectedSkinTypes.join(', ')}
              </p>
            )}
          </div>

          <div>
            <ImageUpload
              label="Texture Shot (Optional)"
              value={formData.textureShot}
              onChange={(url) => setFormData({ ...formData, textureShot: url })}
            />
          </div>

          <div className="flex gap-4 pt-6 border-t border-secondary/20 mt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-accent-pink text-white font-paragraph font-bold px-8 py-4 rounded-lg hover:bg-accent-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSaving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-foreground border-2 border-gray-300 font-paragraph font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
