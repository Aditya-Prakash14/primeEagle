import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  User,
  LogOut, 
  Menu, 
  X, 
  Home, 
  Phone,
  Mail,
  Building,
  MessageCircle,
  ShoppingBag,
  Star,
  Package,
  Filter,
  Shirt,
  Palette,
  Search
} from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, profile, signOut, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFabric, setSelectedFabric] = useState('all')
  const [selectedColor, setSelectedColor] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch products and categories from Supabase
  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, selectedFabric, selectedColor])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true)
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('is_active', true)

      // Apply category filter
      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory)
      }

      // Apply fabric filter (using specifications jsonb)
      if (selectedFabric !== 'all') {
        query = query.contains('specifications', { fabric: selectedFabric })
      }

      // Apply color filter (using specifications jsonb)
      if (selectedColor !== 'all') {
        query = query.contains('specifications', { color: selectedColor })
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(12)

      if (error) throw error
      // Map images array to image_url for display
      const productsWithImages = (data || []).map(product => ({
        ...product,
        image_url: product.images?.[0] || null
      }))
      setProducts(productsWithImages)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }

  // Filter products by search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Available fabric options
  const fabricOptions = [
    { value: 'all', label: 'All Fabrics' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'polyester', label: 'Polyester' },
    { value: 'cotton-blend', label: 'Cotton Blend' },
    { value: 'dri-fit', label: 'Dri-Fit' },
    { value: 'linen', label: 'Linen' },
    { value: 'wool', label: 'Wool' }
  ]

  // Available color options
  const colorOptions = [
    { value: 'all', label: 'All Colors', hex: null },
    { value: 'white', label: 'White', hex: '#FFFFFF' },
    { value: 'black', label: 'Black', hex: '#000000' },
    { value: 'navy', label: 'Navy Blue', hex: '#001F3F' },
    { value: 'blue', label: 'Blue', hex: '#0074D9' },
    { value: 'red', label: 'Red', hex: '#FF4136' },
    { value: 'green', label: 'Green', hex: '#2ECC40' },
    { value: 'gray', label: 'Gray', hex: '#AAAAAA' },
    { value: 'yellow', label: 'Yellow', hex: '#FFDC00' },
    { value: 'orange', label: 'Orange', hex: '#FF851B' },
    { value: 'purple', label: 'Purple', hex: '#B10DC9' },
    { value: 'pink', label: 'Pink', hex: '#F012BE' },
    { value: 'brown', label: 'Brown', hex: '#8B4513' }
  ]

  const whatsappNumber = '917307262985'
  const whatsappMessage = encodeURIComponent('Hi, I want to place a bulk order for corporate apparel from LE Corporate.')

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleWhatsAppContact = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank')
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  // Get user data from auth context
  const userData = {
    name: profile?.full_name || user?.user_metadata?.full_name || 'User',
    email: user?.email || 'user@company.com',
    company: profile?.company || user?.user_metadata?.company || 'Your Company',
    phone: profile?.phone || user?.user_metadata?.phone || 'Not provided',
    memberSince: formatDate(user?.created_at)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-black to-gray-800">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg overflow-hidden">
              <img src="/logo.jpeg" alt="LE Corporate" className="h-6 w-6 object-cover rounded" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">LE Corporate</span>
              <p className="text-xs text-white/80 -mt-0.5">My Account</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">{userData.name}</p>
              <p className="text-xs text-gray-600">{userData.company}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2 px-4 py-6">
          <button
            onClick={handleWhatsAppContact}
            className="w-full flex items-center px-4 py-4 rounded-lg transition-all font-medium bg-green-600 hover:bg-green-700 text-white shadow-lg animate-pulse"
          >
            <MessageCircle className="h-5 w-5 mr-3" />
            Order via WhatsApp
          </button>
          
          <Link
            to="/"
            className="w-full flex items-center px-4 py-3 rounded-lg transition-all font-medium text-gray-700 hover:bg-gray-100"
          >
            <Home className="h-5 w-5 mr-3" />
            Continue Shopping
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <span className="text-sm text-gray-600">Welcome back,</span>
                <p className="font-semibold text-gray-900">{userData.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {userData.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Profile Section */}
          <div>
            {/* Product Showcase Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Products</h2>
                  <p className="text-gray-600">Browse our premium corporate apparel collection</p>
                </div>
                <Link 
                  to="/" 
                  className="text-black hover:text-gray-700 font-medium flex items-center gap-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  View All
                </Link>
              </div>

              {/* Filters and Search */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Bar */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Filter Toggle Button (Mobile) */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Filter className="h-5 w-5" />
                    Filters
                  </button>
                </div>

                {/* Filter Options */}
                <div className={`${showFilters ? 'block' : 'hidden'} lg:block mt-4 pt-4 border-t`}>
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Shirt className="h-4 w-4 mr-2" />
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Fabric Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        Fabric Type
                      </label>
                      <select
                        value={selectedFabric}
                        onChange={(e) => setSelectedFabric(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        {fabricOptions.map((fabric) => (
                          <option key={fabric.value} value={fabric.value}>
                            {fabric.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Color Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        Color
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={`relative group ${
                              selectedColor === color.value
                                ? 'ring-2 ring-black ring-offset-2'
                                : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                            } rounded-lg transition-all`}
                            title={color.label}
                          >
                            {color.hex ? (
                              <div
                                className="w-10 h-10 rounded-lg border-2 border-gray-300"
                                style={{ backgroundColor: color.hex }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg border-2 border-gray-300 bg-gradient-to-br from-red-400 via-blue-400 to-green-400 flex items-center justify-center text-xs font-bold text-white">
                                All
                              </div>
                            )}
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {color.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {(selectedCategory !== 'all' || selectedFabric !== 'all' || selectedColor !== 'all' || searchTerm) && (
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-600">Active filters:</span>
                      {selectedCategory !== 'all' && (
                        <span className="px-3 py-1 bg-black text-white text-sm rounded-full flex items-center gap-1">
                          Category
                          <button onClick={() => setSelectedCategory('all')} className="ml-1">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {selectedFabric !== 'all' && (
                        <span className="px-3 py-1 bg-black text-white text-sm rounded-full flex items-center gap-1">
                          {fabricOptions.find(f => f.value === selectedFabric)?.label}
                          <button onClick={() => setSelectedFabric('all')} className="ml-1">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {selectedColor !== 'all' && (
                        <span className="px-3 py-1 bg-black text-white text-sm rounded-full flex items-center gap-1">
                          {colorOptions.find(c => c.value === selectedColor)?.label}
                          <button onClick={() => setSelectedColor('all')} className="ml-1">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {searchTerm && (
                        <span className="px-3 py-1 bg-black text-white text-sm rounded-full flex items-center gap-1">
                          Search: "{searchTerm}"
                          <button onClick={() => setSearchTerm('')} className="ml-1">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedCategory('all')
                          setSelectedFabric('all')
                          setSelectedColor('all')
                          setSearchTerm('')
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 underline"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {loadingProducts ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        {(product.image_url || product.images?.[0]) ? (
                          <img
                            src={product.image_url || product.images?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ display: product.image_url ? 'none' : 'flex' }}
                        >
                          <Package className="h-16 w-16 text-gray-400" />
                        </div>
                        {product.category && (
                          <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {product.category.name}
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description || 'Premium quality corporate apparel'}
                        </p>
                        {/* Fabric and Color Info */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.specifications?.fabric && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {product.specifications.fabric}
                            </span>
                          )}
                          {product.specifications?.color && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
                              <Palette className="h-3 w-3" />
                              {product.specifications.color}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{product.base_price}
                            </span>
                            {product.min_order_quantity && (
                              <p className="text-xs text-gray-500 mt-1">MOQ: {product.min_order_quantity} units</p>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              const message = encodeURIComponent(
                                `Hi, I'm interested in ${product.name}. Can you provide more details?`
                              )
                              window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Inquire
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm || selectedCategory !== 'all' || selectedFabric !== 'all' || selectedColor !== 'all'
                      ? 'No products match your filters'
                      : 'No Products Available'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || selectedCategory !== 'all' || selectedFabric !== 'all' || selectedColor !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Products will be displayed here once uploaded by admin.'}
                  </p>
                  <button
                    onClick={handleWhatsAppContact}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 font-medium"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Contact Us for Custom Orders
                  </button>
                </div>
              )}
            </div>

            {/* Profile Information Section */}
            <div className="mt-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Information</h2>
                <p className="text-gray-600">Your account details</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        Full Name
                      </label>
                      <p className="text-gray-900 font-semibold">{userData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        Email Address
                      </label>
                      <p className="text-gray-900">{userData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        Phone Number
                      </label>
                      <p className="text-gray-900">{userData.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Building className="h-4 w-4 mr-2 text-gray-400" />
                        Company
                      </label>
                      <p className="text-gray-900">{userData.company}</p>
                    </div>
                  </div>
                </div>

                {/* How to Order */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">How to Place an Order</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Click "Order via WhatsApp"</p>
                        <p className="text-sm text-gray-600">Connect with us directly on WhatsApp</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Share your requirements</p>
                        <p className="text-sm text-gray-600">Tell us about products, quantity, and customization</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Get instant quote</p>
                        <p className="text-sm text-gray-600">We'll provide pricing and delivery timeline</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        4
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Confirm & Receive</p>
                        <p className="text-sm text-gray-600">Approve order and get delivery in 48-72 hours</p>
                      </div>
                    </div>

                    <button
                      onClick={handleWhatsAppContact}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Start Order on WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Info Card */}
              <div className="mt-6 bg-gradient-to-r from-black to-gray-800 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Need Help?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-5 w-5" />
                      <span className="font-semibold">Call Us</span>
                    </div>
                    <a href="tel:+917307262985" className="text-white/80 hover:text-white">
                      +91 73072 62985
                    </a>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-5 w-5" />
                      <span className="font-semibold">Email Us</span>
                    </div>
                  <a href="mailto:sales@primeeagle.com" className="text-white/80 hover:text-white">
                    sales@primeeagle.com
                    </a>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-semibold">WhatsApp</span>
                    </div>
                    <button onClick={handleWhatsAppContact} className="text-white/80 hover:text-white">
                      Chat with us now
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Member Since:</span>
                    <p className="font-semibold text-gray-900">{userData.memberSince}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Account Status:</span>
                    <p className="font-semibold text-green-600">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
