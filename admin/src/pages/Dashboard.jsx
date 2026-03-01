import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import {
  LayoutDashboard, Package, Tag, Users, ShoppingBag,
  Plus, LogOut, Search, Edit, Trash2, X, Upload,
  Save, AlertCircle, CheckCircle, ChevronDown,
  TrendingUp, Eye, EyeOff, RefreshCw, Phone, Mail,
  Building2, Calendar, DollarSign, Activity
} from 'lucide-react'

// ─── helpers ────────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-800',
  confirmed:  'bg-blue-100  text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100   text-red-800',
}

const PAY_COLORS = {
  pending:  'bg-yellow-100 text-yellow-800',
  paid:     'bg-green-100  text-green-800',
  failed:   'bg-red-100    text-red-800',
  refunded: 'bg-gray-100   text-gray-700',
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'
}

// ─── main component ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate   = useNavigate()
  const { user, signOut } = useAuth()

  const [tab, setTab]         = useState('overview')
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })

  // data
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [users,      setUsers]      = useState([])
  const [orders,     setOrders]     = useState([])
  const [stats,      setStats]      = useState({ products:0, active:0, users:0, orders:0, revenue:0 })

  // loading
  const [loadingProducts,   setLoadingProducts]   = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingUsers,      setLoadingUsers]      = useState(false)
  const [loadingOrders,     setLoadingOrders]     = useState(false)

  // product modal
  const [productModal,    setProductModal]    = useState(false)
  const [editingProduct,  setEditingProduct]  = useState(null)
  const [productSearch,   setProductSearch]   = useState('')
  const [imageFile,       setImageFile]       = useState(null)
  const [imagePreview,    setImagePreview]    = useState('')
  const [uploading,       setUploading]       = useState(false)
  const [productForm, setProductForm] = useState({
    name:'', description:'', category_id:'', base_price:'', moq:'', image_url:'', is_active:true
  })

  // category modal
  const [categoryModal,   setCategoryModal]   = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryForm,    setCategoryForm]    = useState({ name:'', description:'' })

  // user detail modal
  const [userModal,        setUserModal]        = useState(false)
  const [selectedUser,     setSelectedUser]     = useState(null)
  const [userSearch,       setUserSearch]       = useState('')
  const [updatingRole,     setUpdatingRole]     = useState(false)

  // order detail modal
  const [orderModal,       setOrderModal]       = useState(false)
  const [selectedOrder,    setSelectedOrder]    = useState(null)
  const [orderSearch,      setOrderSearch]      = useState('')
  const [updatingStatus,   setUpdatingStatus]   = useState(false)

  // ── load on tab change ───────────────────────────────────────────────────
  useEffect(() => {
    if (tab === 'overview')   fetchAll()
    if (tab === 'products')   fetchProducts()
    if (tab === 'categories') fetchCategories()
    if (tab === 'users')      fetchUsers()
    if (tab === 'orders')     fetchOrders()
  }, [tab])

  // ── notification ─────────────────────────────────────────────────────────
  const notify = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3500)
  }

  // ── fetch helpers ─────────────────────────────────────────────────────────
  const fetchAll = async () => {
    const [p, c, u, o] = await Promise.all([
      supabase.from('products').select('id, is_active, base_price'),
      supabase.from('categories').select('id'),
      supabase.from('profiles').select('id'),
      supabase.from('orders').select('id, total'),
    ])
    const prods    = p.data || []
    const ords     = o.data || []
    setStats({
      products:  prods.length,
      active:    prods.filter(x => x.is_active).length,
      users:     (u.data || []).length,
      orders:    ords.length,
      revenue:   ords.reduce((s, x) => s + parseFloat(x.total || 0), 0),
    })
  }

  const fetchProducts = async () => {
    setLoadingProducts(true)
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .order('created_at', { ascending: false })
    if (error) notify('error', 'Failed to load products')
    setProducts((data || []).map(p => ({ ...p, image_url: p.images?.[0] || null })))
    setLoadingProducts(false)
  }

  const fetchCategories = async () => {
    setLoadingCategories(true)
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) notify('error', 'Failed to load categories')
    setCategories(data || [])
    setLoadingCategories(false)
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) notify('error', 'Failed to load users')
    setUsers(data || [])
    setLoadingUsers(false)
  }

  const fetchOrders = async () => {
    setLoadingOrders(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) notify('error', 'Failed to load orders')
    setOrders(data || [])
    setLoadingOrders(false)
  }

  // ── product CRUD ──────────────────────────────────────────────────────────
  const uploadImage = async (file) => {
    const ext      = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).slice(2)}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(`products/${fileName}`, file, { cacheControl:'3600', upsert:false })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(`products/${fileName}`)
    return publicUrl
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { notify('error', 'Image must be < 5 MB'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      setUploading(true)
      let imageUrl = productForm.image_url
      if (imageFile) imageUrl = await uploadImage(imageFile)
      const slug = editingProduct ? editingProduct.slug : generateSlug(productForm.name)
      const data = {
        name: productForm.name, slug,
        description: productForm.description,
        category_id: productForm.category_id || null,
        base_price: parseFloat(productForm.base_price),
        min_order_quantity: parseInt(productForm.moq) || 1,
        images: imageUrl ? [imageUrl] : [],
        is_active: productForm.is_active,
      }
      const { error } = editingProduct
        ? await supabase.from('products').update(data).eq('id', editingProduct.id)
        : await supabase.from('products').insert([data])
      if (error) throw error
      notify('success', editingProduct ? 'Product updated!' : 'Product added!')
      setProductModal(false)
      setEditingProduct(null)
      resetProductForm()
      fetchProducts()
    } catch (err) {
      notify('error', err.message || 'Failed to save product')
    } finally {
      setUploading(false)
    }
  }

  const handleEditProduct = (p) => {
    setEditingProduct(p)
    setProductForm({ name:p.name, description:p.description||'', category_id:p.category_id||'', base_price:p.base_price, moq:p.min_order_quantity||'', image_url:p.image_url||'', is_active:p.is_active })
    setImagePreview(p.image_url || p.images?.[0] || '')
    setImageFile(null)
    setProductModal(true)
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { notify('error', 'Failed to delete'); return }
    notify('success', 'Product deleted!')
    fetchProducts()
  }

  const resetProductForm = () => {
    setProductForm({ name:'', description:'', category_id:'', base_price:'', moq:'', image_url:'', is_active:true })
    setImageFile(null); setImagePreview('')
  }

  const toggleProductActive = async (p) => {
    const { error } = await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id)
    if (error) { notify('error', 'Failed to update'); return }
    fetchProducts()
  }

  // ── category CRUD ─────────────────────────────────────────────────────────
  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    const slug = editingCategory ? editingCategory.slug : generateSlug(categoryForm.name)
    const data = { name: categoryForm.name, slug, description: categoryForm.description }
    const { error } = editingCategory
      ? await supabase.from('categories').update(data).eq('id', editingCategory.id)
      : await supabase.from('categories').insert([data])
    if (error) { notify('error', error.message || 'Failed to save'); return }
    notify('success', editingCategory ? 'Category updated!' : 'Category added!')
    setCategoryModal(false); setEditingCategory(null)
    setCategoryForm({ name:'', description:'' })
    fetchCategories()
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category? Products linked to it will be uncategorised.')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) { notify('error', 'Failed to delete'); return }
    notify('success', 'Category deleted!')
    fetchCategories()
  }

  // ── user management ───────────────────────────────────────────────────────
  const handleRoleChange = async (userId, newRole) => {
    setUpdatingRole(true)
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    setUpdatingRole(false)
    if (error) { notify('error', 'Failed to update role'); return }
    notify('success', `Role changed to ${newRole}`)
    fetchUsers()
    if (selectedUser?.id === userId) setSelectedUser(prev => ({ ...prev, role: newRole }))
  }

  // ── order management ──────────────────────────────────────────────────────
  const handleOrderStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(true)
    const { error } = await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId)
    setUpdatingStatus(false)
    if (error) { notify('error', 'Failed to update status'); return }
    notify('success', `Order status → ${newStatus}`)
    fetchOrders()
    if (selectedOrder?.id === orderId) setSelectedOrder(prev => ({ ...prev, status: newStatus }))
  }

  const handleLogout = async () => { await signOut(); navigate('/login') }

  // ── filtered lists ────────────────────────────────────────────────────────
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
  const filteredUsers    = users.filter(u => (u.full_name||'').toLowerCase().includes(userSearch.toLowerCase()) || (u.email||'').toLowerCase().includes(userSearch.toLowerCase()))
  const filteredOrders   = orders.filter(o => (o.order_number||'').toLowerCase().includes(orderSearch.toLowerCase()) || (o.customer_name||'').toLowerCase().includes(orderSearch.toLowerCase()))

  // ── nav items ─────────────────────────────────────────────────────────────
  const navItems = [
    { id:'overview',   label:'Overview',   icon: LayoutDashboard },
    { id:'products',   label:'Products',   icon: Package },
    { id:'categories', label:'Categories', icon: Tag },
    { id:'users',      label:'Users',      icon: Users },
    { id:'orders',     label:'Orders',     icon: ShoppingBag },
  ]

  // ════════════════════ RENDER ═════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ── Notification toast ─────────────────────────────────────────── */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border-2 ${notification.type==='success' ? 'bg-black border-white text-white' : 'bg-white border-red-500 text-red-700'}`}>
            {notification.type==='success' ? <CheckCircle className="h-5 w-5 shrink-0"/> : <AlertCircle className="h-5 w-5 shrink-0"/>}
            <p className="font-medium text-sm">{notification.message}</p>
          </div>
        </div>
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0 min-h-screen">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg overflow-hidden">
              <img src="/logo.jpeg" alt="Prime Eagle" className="h-8 w-8 object-cover" />
            </div>
            <div>
              <h1 className="text-base font-bold">Prime Eagle</h1>
              <span className="text-xs text-white/50">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${tab===id ? 'bg-white text-gray-900' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/40 mb-3 truncate">{user?.email}</p>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors">
            <LogOut className="h-4 w-4" />Logout
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{navItems.find(n=>n.id===tab)?.label}</h2>
            <p className="text-sm text-gray-500">Prime Eagle Admin • {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</p>
          </div>
          <button onClick={() => { if(tab==='overview') fetchAll(); if(tab==='products') fetchProducts(); if(tab==='categories') fetchCategories(); if(tab==='users') fetchUsers(); if(tab==='orders') fetchOrders() }}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh">
            <RefreshCw className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8">

          {/* ══════════════ OVERVIEW TAB ══════════════════════════════════ */}
          {tab === 'overview' && (
            <div className="space-y-8">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label:'Total Products', value: stats.products,  icon: Package,       color:'bg-blue-500' },
                  { label:'Active Products',value: stats.active,    icon: Activity,      color:'bg-green-500' },
                  { label:'Total Users',     value: stats.users,    icon: Users,         color:'bg-purple-500' },
                  { label:'Total Orders',    value: stats.orders,   icon: ShoppingBag,   color:'bg-orange-500' },
                  { label:'Revenue (₹)',     value: `₹${stats.revenue.toLocaleString('en-IN',{maximumFractionDigits:0})}`, icon: DollarSign, color:'bg-emerald-500' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Quick access */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent orders */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                    <button onClick={() => setTab('orders')} className="text-sm text-blue-600 hover:underline">View all</button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {orders.slice(0,5).map(o => (
                      <div key={o.id} className="px-6 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{o.order_number}</p>
                          <p className="text-xs text-gray-500">{o.customer_name}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS[o.status]||'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="px-6 py-4 text-sm text-gray-400">No orders yet</p>}
                  </div>
                </div>

                {/* Recent users */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Recent Users</h3>
                    <button onClick={() => setTab('users')} className="text-sm text-blue-600 hover:underline">View all</button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {users.slice(0,5).map(u => (
                      <div key={u.id} className="px-6 py-3 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {(u.full_name||u.email||'?')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{u.full_name || '—'}</p>
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.role==='admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                      </div>
                    ))}
                    {users.length === 0 && <p className="px-6 py-4 text-sm text-gray-400">No users yet</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ PRODUCTS TAB ══════════════════════════════════ */}
          {tab === 'products' && (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" placeholder="Search products…" value={productSearch} onChange={e=>setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm" />
                </div>
                <button onClick={() => { setEditingProduct(null); resetProductForm(); setProductModal(true) }}
                  className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Plus className="h-4 w-4" />Add Product
                </button>
              </div>

              {loadingProducts ? (
                <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"/></div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3"/>
                  <p className="text-gray-500">{productSearch ? 'No results found' : 'No products yet'}</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="bg-white rounded-xl border-2 border-gray-200 hover:border-black transition-all overflow-hidden group">
                      <div className="relative h-44 bg-gray-100 flex items-center justify-center">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}} />
                        ) : <Package className="h-12 w-12 text-gray-300"/>}
                        <div className="absolute top-2 left-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {p.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        {p.category && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mb-2 inline-block">{p.category.name}</span>}
                        <h3 className="font-bold text-gray-900 text-sm truncate mb-1">{p.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.description || 'No description'}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-gray-900">₹{p.base_price}</span>
                          <span className="text-xs text-gray-400">MOQ: {p.min_order_quantity}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditProduct(p)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors">
                            <Edit className="h-3.5 w-3.5"/>Edit
                          </button>
                          <button onClick={() => toggleProductActive(p)} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${p.is_active ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700' : 'bg-green-50 hover:bg-green-100 text-green-700'}`}>
                            {p.is_active ? <EyeOff className="h-3.5 w-3.5"/> : <Eye className="h-3.5 w-3.5"/>}
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                            <Trash2 className="h-3.5 w-3.5"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ CATEGORIES TAB ════════════════════════════════ */}
          {tab === 'categories' && (
            <div>
              <div className="mb-6 flex justify-end">
                <button onClick={() => { setEditingCategory(null); setCategoryForm({ name:'', description:'' }); setCategoryModal(true) }}
                  className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Plus className="h-4 w-4"/>Add Category
                </button>
              </div>

              {loadingCategories ? (
                <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"/></div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Name','Slug','Description','Created','Actions'].map(h=>(
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {categories.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No categories yet</td></tr>
                      )}
                      {categories.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900 text-sm">{c.name}</td>
                          <td className="px-6 py-4 text-xs text-gray-500 font-mono">{c.slug}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{c.description || '—'}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{formatDate(c.created_at)}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => { setEditingCategory(c); setCategoryForm({ name:c.name, description:c.description||'' }); setCategoryModal(true) }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">
                                <Edit className="h-3.5 w-3.5"/>Edit
                              </button>
                              <button onClick={() => handleDeleteCategory(c.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium">
                                <Trash2 className="h-3.5 w-3.5"/>Delete
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
          )}

          {/* ══════════════ USERS TAB ═════════════════════════════════════ */}
          {tab === 'users' && (
            <div>
              <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <input type="text" placeholder="Search by name or email…" value={userSearch} onChange={e=>setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"/>
              </div>

              {loadingUsers ? (
                <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"/></div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['User','Email','Phone','Company','Role','Joined','Actions'].map(h=>(
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.length === 0 && (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No users found</td></tr>
                      )}
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {(u.full_name||u.email||'?')[0].toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{u.full_name || '—'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{u.email || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{u.phone || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{u.company || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.role==='admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(u.created_at)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => { setSelectedUser(u); setUserModal(true) }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">
                                <Eye className="h-3.5 w-3.5"/>View
                              </button>
                              <select value={u.role} disabled={updatingRole} onChange={e => handleRoleChange(u.id, e.target.value)}
                                className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-black">
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ══════════════ ORDERS TAB ════════════════════════════════════ */}
          {tab === 'orders' && (
            <div>
              <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <input type="text" placeholder="Search by order # or customer…" value={orderSearch} onChange={e=>setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"/>
              </div>

              {loadingOrders ? (
                <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"/></div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Order #','Customer','Phone','Total','Status','Payment','Date','Actions'].map(h=>(
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.length === 0 && (
                        <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No orders found</td></tr>
                      )}
                      {filteredOrders.map(o => (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{o.order_number}</td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-gray-900">{o.customer_name}</p>
                            <p className="text-xs text-gray-500">{o.customer_email}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{o.customer_phone || '—'}</td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{parseFloat(o.total||0).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[o.status]||'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PAY_COLORS[o.payment_status]||'bg-gray-100 text-gray-700'}`}>{o.payment_status}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(o.created_at)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => { setSelectedOrder(o); setOrderModal(true) }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">
                                <Eye className="h-3.5 w-3.5"/>View
                              </button>
                              <select value={o.status} disabled={updatingStatus} onChange={e => handleOrderStatusChange(o.id, e.target.value)}
                                className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-black">
                                {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ══════════ PRODUCT MODAL ════════════════════════════════════════ */}
      {productModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-black">
            <div className="sticky top-0 bg-black px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-bold text-white">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => { setProductModal(false); setEditingProduct(null); resetProductForm() }} className="text-white/60 hover:text-white">
                <X className="h-6 w-6"/>
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input type="text" value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm" placeholder="Premium Corporate T-Shirt"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})} rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm" placeholder="Product details…"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={productForm.category_id} onChange={e=>setProductForm({...productForm,category_id:e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm">
                    <option value="">Select Category</option>
                    {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹) *</label>
                  <input type="number" value={productForm.base_price} onChange={e=>setProductForm({...productForm,base_price:e.target.value})} required min="0" step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm" placeholder="499"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Quantity (MOQ)</label>
                <input type="number" value={productForm.moq} onChange={e=>setProductForm({...productForm,moq:e.target.value})} min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm" placeholder="50"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                {imagePreview && (
                  <div className="relative mb-3 w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover"/>
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); setProductForm({...productForm,image_url:''}) }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full">
                      <X className="h-3.5 w-3.5"/>
                    </button>
                  </div>
                )}
                <input type="file" id="img-upload" accept="image/*" onChange={handleImageChange} className="hidden"/>
                <label htmlFor="img-upload" className="flex items-center justify-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg cursor-pointer text-sm transition-colors">
                  <Upload className="h-4 w-4"/>{imageFile ? 'Change Image' : 'Upload Image'}
                </label>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5 MB</p>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_active" checked={productForm.is_active} onChange={e=>setProductForm({...productForm,is_active:e.target.checked})}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"/>
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active (visible to customers)</label>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={() => { setProductModal(false); setEditingProduct(null); resetProductForm() }}
                  className="flex-1 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm">Cancel</button>
                <button type="submit" disabled={uploading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg font-medium text-sm disabled:opacity-50">
                  {uploading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"/>Saving…</> : <><Save className="h-4 w-4"/>{editingProduct ? 'Update' : 'Add Product'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ CATEGORY MODAL ═══════════════════════════════════════ */}
      {categoryModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-black">
            <div className="bg-black px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-bold text-white">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => { setCategoryModal(false); setEditingCategory(null) }} className="text-white/60 hover:text-white"><X className="h-6 w-6"/></button>
            </div>
            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={categoryForm.name} onChange={e=>setCategoryForm({...categoryForm,name:e.target.value})} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm" placeholder="T-Shirts"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={categoryForm.description} onChange={e=>setCategoryForm({...categoryForm,description:e.target.value})} rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm" placeholder="Category description…"/>
              </div>
              <div className="flex gap-3 pt-2 border-t">
                <button type="button" onClick={() => { setCategoryModal(false); setEditingCategory(null) }}
                  className="flex-1 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm">Cancel</button>
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg font-medium text-sm">
                  <Save className="h-4 w-4"/>{editingCategory ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ USER DETAIL MODAL ════════════════════════════════════ */}
      {userModal && selectedUser && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-black">
            <div className="bg-black px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-bold text-white">User Details</h2>
              <button onClick={() => setUserModal(false)} className="text-white/60 hover:text-white"><X className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {(selectedUser.full_name||selectedUser.email||'?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedUser.full_name || '—'}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${selectedUser.role==='admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{selectedUser.role}</span>
                </div>
              </div>
              {[
                { icon: Mail,      label:'Email',   value: selectedUser.email },
                { icon: Phone,     label:'Phone',   value: selectedUser.phone },
                { icon: Building2, label:'Company', value: selectedUser.company },
                { icon: Calendar,  label:'Joined',  value: formatDate(selectedUser.created_at) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <Icon className="h-4 w-4 text-gray-400 shrink-0"/>
                  <span className="text-sm text-gray-500 w-20">{label}</span>
                  <span className="text-sm font-medium text-gray-900 flex-1">{value || '—'}</span>
                </div>
              ))}
              <div className="pt-2 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">Change Role</label>
                <select value={selectedUser.role} disabled={updatingRole} onChange={e => handleRoleChange(selectedUser.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black">
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ ORDER DETAIL MODAL ═══════════════════════════════════ */}
      {orderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-black">
            <div className="sticky top-0 bg-black px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-bold text-white">Order: {selectedOrder.order_number}</h2>
              <button onClick={() => setOrderModal(false)} className="text-white/60 hover:text-white"><X className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status badges */}
              <div className="flex gap-3">
                <span className={`text-sm px-3 py-1 rounded-full font-semibold ${STATUS_COLORS[selectedOrder.status]||'bg-gray-100'}`}>{selectedOrder.status}</span>
                <span className={`text-sm px-3 py-1 rounded-full font-semibold ${PAY_COLORS[selectedOrder.payment_status]||'bg-gray-100'}`}>{selectedOrder.payment_status}</span>
              </div>

              {/* Customer info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Customer</h3>
                {[
                  { label:'Name',    value: selectedOrder.customer_name },
                  { label:'Email',   value: selectedOrder.customer_email },
                  { label:'Phone',   value: selectedOrder.customer_phone },
                  { label:'Company', value: selectedOrder.company_name },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">{value || '—'}</span>
                  </div>
                ))}
              </div>

              {/* Financials */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Financials</h3>
                {[
                  { label:'Subtotal', value:`₹${parseFloat(selectedOrder.subtotal||0).toLocaleString('en-IN')}` },
                  { label:'Tax',      value:`₹${parseFloat(selectedOrder.tax||0).toLocaleString('en-IN')}` },
                  { label:'Shipping', value:`₹${parseFloat(selectedOrder.shipping_cost||0).toLocaleString('en-IN')}` },
                  { label:'Discount', value:`-₹${parseFloat(selectedOrder.discount||0).toLocaleString('en-IN')}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span><span>₹{parseFloat(selectedOrder.total||0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Customer Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Update status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Order Status</label>
                <select value={selectedOrder.status} disabled={updatingStatus} onChange={e => handleOrderStatusChange(selectedOrder.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black">
                  {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <p className="text-xs text-gray-400">Ordered: {formatDate(selectedOrder.created_at)}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
