import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import {
  User, LogOut, Menu, X, Home, Phone, Mail, Building,
  ShoppingBag, Package, Filter, Shirt, Palette, Search,
  ChevronRight, Bell, TrendingUp, Clock, CheckCircle, Star
} from 'lucide-react'

const WhatsAppIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, profile, signOut, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFabric, setSelectedFabric] = useState('all')
  const [selectedColor, setSelectedColor] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { fetchCategories(); fetchProducts() }, [])
  useEffect(() => { fetchProducts() }, [selectedCategory, selectedFabric, selectedColor])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      setCategories(data || [])
    } catch (e) { console.error(e) }
  }

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true)
      let q = supabase.from('products').select('*, category:categories(name)').eq('is_active', true)
      if (selectedCategory !== 'all') q = q.eq('category_id', selectedCategory)
      if (selectedFabric !== 'all') q = q.contains('specifications', { fabric: selectedFabric })
      if (selectedColor !== 'all') q = q.contains('specifications', { color: selectedColor })
      const { data, error } = await q.order('created_at', { ascending: false }).limit(12)
      if (error) throw error
      setProducts((data || []).map(p => ({ ...p, image_url: p.images?.[0] || null })))
    } catch (e) { console.error(e); setProducts([]) }
    finally { setLoadingProducts(false) }
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const fabricOptions = [
    { value: 'all', label: 'All Fabrics' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'polyester', label: 'Polyester' },
    { value: 'cotton-blend', label: 'Cotton Blend' },
    { value: 'dri-fit', label: 'Dri-Fit' },
    { value: 'linen', label: 'Linen' },
    { value: 'wool', label: 'Wool' },
  ]

  const colorOptions = [
    { value: 'all', label: 'All Colors', hex: null },
    { value: 'white', label: 'White', hex: '#FFFFFF' },
    { value: 'black', label: 'Black', hex: '#000000' },
    { value: 'navy', label: 'Navy', hex: '#001F3F' },
    { value: 'blue', label: 'Blue', hex: '#0074D9' },
    { value: 'red', label: 'Red', hex: '#FF4136' },
    { value: 'green', label: 'Green', hex: '#2ECC40' },
    { value: 'gray', label: 'Gray', hex: '#AAAAAA' },
    { value: 'yellow', label: 'Yellow', hex: '#FFDC00' },
    { value: 'orange', label: 'Orange', hex: '#FF851B' },
    { value: 'purple', label: 'Purple', hex: '#B10DC9' },
  ]

  const whatsappNumber = '917307262985'
  const openWhatsApp = (msg = 'Hi, I want to place a bulk order for corporate apparel from Prime Eagle.') =>
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank')

  const handleLogout = async () => { try { await signOut(); navigate('/') } catch (e) { console.error(e) } }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Recently'

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userInitial = userName.charAt(0).toUpperCase()
  const userEmail = user?.email || ''
  const memberSince = formatDate(user?.created_at)

  const navItems = [
    { id: 'products', label: 'Browse Products', icon: ShoppingBag },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'how-to-order', label: 'How to Order', icon: TrendingUp },
  ]

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 font-medium">Loading your dashboard…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Backdrop */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>

        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Prime Eagle" className="h-9 w-9 rounded-lg object-cover ring-2 ring-white/20" />
            <div>
              <p className="font-bold text-white leading-none">Prime Eagle</p>
              <p className="text-[11px] text-white/50 mt-0.5">Corporate Apparel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg flex-shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">{userName}</p>
              <p className="text-xs text-white/50 truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${activeTab === id ? 'bg-white text-gray-900 shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
              {activeTab === id && <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />}
            </button>
          ))}

          <div className="pt-3">
            <button onClick={() => openWhatsApp()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ backgroundColor: '#25D366' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#20b858'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#25D366'}>
              <WhatsAppIcon className="h-4 w-4 flex-shrink-0" />
              Order via WhatsApp
            </button>
          </div>

          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all">
            <Home className="h-4 w-4 flex-shrink-0" /> Back to Home
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <span>Dashboard</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-700 font-medium capitalize">
                  {activeTab === 'how-to-order' ? 'How to Order' : activeTab}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {userInitial}
                </div>
                <div className="hidden sm:block leading-none">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-400">Member since {memberSince}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          {/* ── PRODUCTS ── */}
          {activeTab === 'products' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Browse Products</h1>
                <p className="text-gray-500 mt-1">Explore our premium corporate apparel collection</p>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search products…" value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                  </div>
                  <button onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
                      ${showFilters ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                    <Filter className="h-4 w-4" /> Filters
                  </button>
                </div>

                {showFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Shirt className="h-3 w-3" /> Category
                      </label>
                      <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                        <option value="all">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Package className="h-3 w-3" /> Fabric
                      </label>
                      <select value={selectedFabric} onChange={e => setSelectedFabric(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                        {fabricOptions.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Palette className="h-3 w-3" /> Color
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map(c => (
                          <button key={c.value} onClick={() => setSelectedColor(c.value)} title={c.label}
                            className={`relative group transition-all rounded-lg ${selectedColor === c.value ? 'ring-2 ring-gray-900 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'}`}>
                            {c.hex
                              ? <div className="w-8 h-8 rounded-lg border border-gray-300" style={{ backgroundColor: c.hex }} />
                              : <div className="w-8 h-8 rounded-lg border border-gray-300 bg-gradient-to-br from-red-400 via-blue-400 to-green-400 flex items-center justify-center text-[9px] font-bold text-white">All</div>}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {c.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {(selectedCategory !== 'all' || selectedFabric !== 'all' || selectedColor !== 'all' || searchTerm) && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500">Active:</span>
                    {selectedCategory !== 'all' && <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-full">Category <button onClick={() => setSelectedCategory('all')}><X className="h-3 w-3" /></button></span>}
                    {selectedFabric !== 'all' && <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-full">{fabricOptions.find(f => f.value === selectedFabric)?.label} <button onClick={() => setSelectedFabric('all')}><X className="h-3 w-3" /></button></span>}
                    {selectedColor !== 'all' && <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-full">{colorOptions.find(c => c.value === selectedColor)?.label} <button onClick={() => setSelectedColor('all')}><X className="h-3 w-3" /></button></span>}
                    {searchTerm && <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-full">"{searchTerm}" <button onClick={() => setSearchTerm('')}><X className="h-3 w-3" /></button></span>}
                    <button onClick={() => { setSelectedCategory('all'); setSelectedFabric('all'); setSelectedColor('all'); setSearchTerm('') }} className="text-xs text-gray-500 hover:text-gray-900 underline">Clear all</button>
                  </div>
                )}
              </div>

              {/* Grid */}
              {loadingProducts ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                      <div className="h-52 bg-gray-200" />
                      <div className="p-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/2" /><div className="h-8 bg-gray-200 rounded mt-4" /></div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center" style={{ display: product.image_url ? 'none' : 'flex' }}>
                          <Package className="h-14 w-14 text-gray-300" />
                        </div>
                        {product.category && (
                          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                            {product.category.name}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 mb-1">{product.name}</h3>
                        <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">{product.description || 'Premium quality corporate apparel'}</p>
                        {(product.specifications?.fabric || product.specifications?.color) && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {product.specifications?.fabric && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full font-medium">{product.specifications.fabric}</span>}
                            {product.specifications?.color && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full font-medium">{product.specifications.color}</span>}
                          </div>
                        )}
                        <div className="flex items-end justify-between pt-2 border-t border-gray-100">
                          <div>
                            <p className="text-xl font-bold text-gray-900">₹{product.base_price}</p>
                            {product.min_order_quantity && <p className="text-[10px] text-gray-400 mt-0.5">MOQ: {product.min_order_quantity} units</p>}
                          </div>
                          <button onClick={() => openWhatsApp(`Hi, I'm interested in ordering "${product.name}". Can I get pricing and details?`)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold transition-all"
                            style={{ backgroundColor: '#25D366' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#20b858'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#25D366'}>
                            <WhatsAppIcon className="h-3.5 w-3.5" /> Inquire
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{searchTerm || selectedCategory !== 'all' ? 'No products match your filters' : 'No Products Yet'}</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">{searchTerm ? 'Try a different search term or clear your filters.' : 'Contact us to place a custom order.'}</p>
                  <button onClick={() => openWhatsApp()} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all"
                    style={{ backgroundColor: '#25D366' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#20b858'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#25D366'}>
                    <WhatsAppIcon className="h-4 w-4" /> Contact Us on WhatsApp
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 mt-1">Your account and contact information</p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-6 mb-6 text-white flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-xl flex-shrink-0">
                  {userInitial}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold">{userName}</h2>
                  <p className="text-white/60 text-sm mt-1">{userEmail}</p>
                  <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3 text-green-400" /> Active Account</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs font-medium"><Clock className="h-3 w-3" /> Member since {memberSince}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><User className="h-4 w-4 text-gray-400" /> Account Details</h3>
                  <div className="space-y-4">
                    {[
                      { icon: User, label: 'Full Name', value: userName },
                      { icon: Mail, label: 'Email Address', value: userEmail },
                      { icon: Phone, label: 'Phone', value: profile?.phone || user?.user_metadata?.phone || 'Not provided' },
                      { icon: Building, label: 'Company', value: profile?.company || user?.user_metadata?.company || 'Not provided' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">{label}</p>
                          <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /> Contact Support</h3>
                  <div className="space-y-3">
                    <a href="tel:+917307262985" className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="h-4 w-4 text-blue-600" /></div>
                      <div><p className="text-xs text-gray-400">Call Us</p><p className="text-sm font-bold text-gray-900">+91 73072 62985</p></div>
                    </a>
                    <a href="mailto:sales@primeeagle.in" className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                      <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="h-4 w-4 text-purple-600" /></div>
                      <div><p className="text-xs text-gray-400">Email Us</p><p className="text-sm font-bold text-gray-900">sales@primeeagle.in</p></div>
                    </a>
                    <button onClick={() => openWhatsApp()} className="w-full flex items-center gap-3 p-3.5 rounded-xl text-white transition-all"
                      style={{ backgroundColor: '#25D366' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#20b858'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#25D366'}>
                      <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"><WhatsAppIcon className="h-4 w-4" /></div>
                      <div className="text-left"><p className="text-xs text-white/70">WhatsApp</p><p className="text-sm font-bold">Chat with us now</p></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── HOW TO ORDER ── */}
          {activeTab === 'how-to-order' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">How to Place an Order</h1>
                <p className="text-gray-500 mt-1">Simple 4-step process to get your custom corporate apparel</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                {[
                  { step: 1, title: 'Browse Products', desc: 'Explore our premium catalogue. Find styles, fabrics, and colors that match your brand identity.', color: 'from-blue-500 to-indigo-600' },
                  { step: 2, title: 'Contact via WhatsApp', desc: "Click 'Order via WhatsApp'. Share the products you need, quantities, and any customization requirements.", color: 'from-green-500 to-emerald-600' },
                  { step: 3, title: 'Get Your Quote', desc: "We'll provide a detailed quote with pricing, delivery timeline, and customization options within 2 hours.", color: 'from-orange-500 to-amber-600' },
                  { step: 4, title: 'Confirm & Receive', desc: 'Approve the order, make payment, and receive your premium corporate apparel within 5–7 business days.', color: 'from-purple-500 to-violet-600' },
                ].map(({ step, title, desc, color }) => (
                  <div key={step} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-md`}>{step}</div>
                    <div><h3 className="font-bold text-gray-900 mb-1">{title}</h3><p className="text-sm text-gray-500 leading-relaxed">{desc}</p></div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-8 text-white text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#25D366' }}>
                  <WhatsAppIcon className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Ready to Order?</h2>
                <p className="text-white/60 mb-6 max-w-sm mx-auto text-sm">Get a free consultation and quote within 2 hours. Minimum order 50 units with bulk discounts available.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => openWhatsApp()} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white transition-all"
                    style={{ backgroundColor: '#25D366' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#20b858'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#25D366'}>
                    <WhatsAppIcon className="h-5 w-5" /> Start Order on WhatsApp
                  </button>
                  <button onClick={() => setActiveTab('products')} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-all">
                    <ShoppingBag className="h-5 w-5" /> Browse Products First
                  </button>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-white/50">
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-400" /> Free Consultation</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-400" /> Volume Discounts</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-400" /> 5–7 Day Delivery</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
