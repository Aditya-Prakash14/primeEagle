import { Link } from 'react-router-dom'
import { ShoppingBag, Truck, Award, Users, Shirt, Star, ArrowRight, Check, Phone, Mail, MapPin, Shield, Zap, TrendingUp, Package, Clock, Target } from 'lucide-react'

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Navigation */}
      <nav className="bg-black border-b border-white/10 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg overflow-hidden">
                <img src="/logo.jpeg" alt="Prime Eagle" className="h-8 w-8 object-cover" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">Prime Eagle</span>
                <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-white text-black rounded">PREMIUM</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#products" className="text-white/80 hover:text-white transition-colors font-medium">Products</a>
              <a href="#features" className="text-white/80 hover:text-white transition-colors font-medium">Features</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors font-medium">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-white/80 hover:text-white transition-colors font-medium hidden sm:block">
                Sign In
              </Link>
              <Link to="/signup" className="bg-white hover:bg-gray-100 text-black font-semibold px-6 py-2.5 rounded-lg transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Startup Style */}
      <section className="relative bg-black py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Dot Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Main Heading */}
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                  Corporate Apparel,
                  <span className="block">Reimagined</span>
                </h1>
                <div className="h-1 w-20 bg-white"></div>
              </div>
              
              {/* Description */}
              <p className="text-xl text-white/70 leading-relaxed max-w-xl">
                Premium quality corporate uniforms and custom branding solutions. From design to delivery, we handle everything.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="group bg-white hover:bg-gray-100 text-black font-semibold px-8 py-4 rounded-lg inline-flex items-center justify-center transition-all">
                  Start Your Order
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="tel:+917307262985" className="bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-lg border border-white/20 hover:border-white/30 transition-all inline-flex items-center justify-center">
                  <Phone className="mr-2 h-5 w-5" />
                  +91 73072 62985
                </a>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative lg:h-[600px] h-[400px]">
              <div className="absolute inset-0 border-2 border-white/10 rounded-2xl overflow-hidden">
                <img 
                  src="/images/hero/home section.png" 
                  alt="Prime Eagle Products" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Strip */}
      <section className="py-12 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-black/40 mb-8 font-medium uppercase tracking-wider">Trusted by leading companies</p>
          <div className="flex justify-center items-center gap-12 opacity-30 flex-wrap">
            <div className="text-2xl font-bold text-black">COMPANY</div>
            <div className="text-2xl font-bold text-black">BRAND</div>
            <div className="text-2xl font-bold text-black">ENTERPRISE</div>
            <div className="text-2xl font-bold text-black">CORP</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Why Choose Prime Eagle</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto">Everything you need for corporate apparel, all in one place</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black text-white p-8 rounded-2xl">
              <div className="bg-white/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium Quality</h3>
              <p className="text-white/70 leading-relaxed">
                ISO certified manufacturing. 100% premium cotton, pre-shrunk fabric, color-fast guarantee.
              </p>
            </div>

            <div className="border-2 border-black p-8 rounded-2xl">
              <div className="bg-black w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Fast Delivery</h3>
              <p className="text-black/60 leading-relaxed">
                Ready stock of 10,000+ units. Bulk orders shipped within 48-72 hours nationwide.
              </p>
            </div>

            <div className="bg-black text-white p-8 rounded-2xl">
              <div className="bg-white/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Scale Ready</h3>
              <p className="text-white/70 leading-relaxed">
                50,000+ units monthly capacity. Serving enterprises across India with consistent quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Product Range</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">Premium corporate apparel designed for performance</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="relative h-80 bg-black overflow-hidden">
                <img 
                  src="/images/products/polo-t-shirt.png" 
                  alt="Corporate Polo T-Shirts"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-black">
                  BESTSELLER
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-3">Corporate Polo T-Shirts</h3>
                <p className="text-black/60 mb-6">
                  Premium cotton polo shirts with professional collar design. Perfect for corporate uniforms.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    100% Combed Cotton
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Custom Logo Embroidery
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    15+ Colors Available
                  </li>
                </ul>
                <Link to="/signup" className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg w-full text-center block transition-all">
                  Get Quote
                </Link>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="relative h-80 bg-black overflow-hidden">
                <img 
                  src="/images/products/hoodies.jpg" 
                  alt="Corporate Hoodies"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-3">Premium Hoodies</h3>
                <p className="text-black/60 mb-6">
                  Fleece hoodies perfect for winter uniforms and corporate events.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Premium Fleece Material
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Screen & Digital Printing
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Zip & Pullover Styles
                  </li>
                </ul>
                <Link to="/signup" className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg w-full text-center block transition-all">
                  Get Quote
                </Link>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="relative h-80 bg-black overflow-hidden">
                <img 
                  src="/images/products/lowerpants.png" 
                  alt="Track Pants"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-3">Track Pants & Lowers</h3>
                <p className="text-black/60 mb-6">
                  Comfortable lowers for sports teams and casual uniforms.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Cotton-Poly Blend
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Elastic Waistband
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    XS to 4XL Sizes
                  </li>
                </ul>
                <Link to="/signup" className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg w-full text-center block transition-all">
                  Get Quote
                </Link>
              </div>
            </div>

            {/* Product 4 */}
            <div className="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="relative h-80 bg-black overflow-hidden">
                <img 
                  src="/images/products/tshirt2.png" 
                  alt="Round Neck T-Shirts"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-green-500 px-3 py-1 rounded-full text-xs font-bold text-white">
                  NEW
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-3">Round Neck T-Shirts</h3>
                <p className="text-black/60 mb-6">
                  Classic round neck tees for casual corporate wear and events.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    100% Breathable Cotton
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Screen Printing Options
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    20+ Color Variants
                  </li>
                </ul>
                <Link to="/signup" className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg w-full text-center block transition-all">
                  Get Quote
                </Link>
              </div>
            </div>

            {/* Product 5 */}
            <div className="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="relative h-80 bg-black overflow-hidden">
                <img 
                  src="/images/products/p-hoodie.png" 
                  alt="Jackets"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-3">Corporate Jackets</h3>
                <p className="text-black/60 mb-6">
                  Professional jackets for outdoor teams and formal events.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Water-Resistant Fabric
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Multiple Pockets
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Windproof Design
                  </li>
                </ul>
                <Link to="/signup" className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg w-full text-center block transition-all">
                  Get Quote
                </Link>
              </div>
            </div>

            {/* Product 6 */}
            <div className="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="relative h-80 bg-black overflow-hidden">
                <img 
                  src="/images/products/lower2.png" 
                  alt="Sports Jersey"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-3">Sports Jersey</h3>
                <p className="text-black/60 mb-6">
                  Dri-fit sports jerseys for corporate sports teams and events.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Moisture-Wicking Fabric
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Sublimation Printing
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Custom Numbers & Names
                  </li>
                </ul>
                <Link to="/signup" className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg w-full text-center block transition-all">
                  Get Quote
                </Link>
              </div>
            </div>

            {/* Product 7 */}
            <div className="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="relative h-80 bg-black overflow-hidden">
                <img 
                  src="/images/products/lowerpants.png" 
                  alt="Formal Pants"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-3">Formal Pants</h3>
                <p className="text-black/60 mb-6">
                  Professional formal pants for corporate dress code compliance.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Wrinkle-Free Fabric
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Tailored Fit Options
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Black, Navy, Grey Colors
                  </li>
                </ul>
                <Link to="/signup" className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg w-full text-center block transition-all">
                  Get Quote
                </Link>
              </div>
            </div>

            {/* Product 8 */}
            <div className="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="relative h-80 bg-black overflow-hidden">
                <img 
                  src="/images/products/tshirt3.png" 
                  alt="Sweatshirts"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-3">Sweatshirts</h3>
                <p className="text-black/60 mb-6">
                  Cozy sweatshirts perfect for casual work environments.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Soft Cotton-Poly Blend
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Crew & Hooded Styles
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Embroidery & Print Ready
                  </li>
                </ul>
                <Link to="/signup" className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg w-full text-center block transition-all">
                  Get Quote
                </Link>
              </div>
            </div>

            {/* Product 9 */}
            <div className="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="relative h-80 bg-black overflow-hidden">
                <img 
                  src="/images/products/p-hoodie2.png" 
                  alt="Safety Vests"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-yellow-400 px-3 py-1 rounded-full text-xs font-bold text-black">
                  SAFETY
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-3">Safety Vests</h3>
                <p className="text-black/60 mb-6">
                  High-visibility safety vests for industrial and construction teams.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Reflective Tape
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Fluorescent Colors
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-black mr-2" />
                    Certified Standards
                  </li>
                </ul>
                <Link to="/signup" className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg w-full text-center block transition-all">
                  Get Quote
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/signup" className="bg-white text-black hover:bg-gray-100 font-bold py-4 px-10 rounded-lg inline-flex items-center transition-all border-2 border-white">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Client Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto">See what our clients say about us</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-black/80 mb-6 italic leading-relaxed">
                "Prime Eagle delivered 2000 polo t-shirts with perfect embroidery. Quality exceeded our expectations and delivery was on time."
              </p>
              <div className="flex items-center">
                <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                  RK
                </div>
                <div className="ml-4">
                  <div className="font-bold text-black">Rajesh Kumar</div>
                  <div className="text-sm text-black/60">HR Manager, Tech Solutions</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-black/80 mb-6 italic leading-relaxed">
                "Best quality hoodies we've ordered. The customization options are excellent and the team is very responsive."
              </p>
              <div className="flex items-center">
                <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                  PS
                </div>
                <div className="ml-4">
                  <div className="font-bold text-black">Priya Sharma</div>
                  <div className="text-sm text-black/60">Founder, Startup Inc</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-black/80 mb-6 italic leading-relaxed">
                "Consistent quality across all orders. We've been ordering for 2 years and never disappointed. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                  AM
                </div>
                <div className="ml-4">
                  <div className="font-bold text-black">Amit Mehta</div>
                  <div className="text-sm text-black/60">Operations Head, Retail Chain</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Applications Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Industries We Serve</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto">Customized solutions for every sector</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-2xl text-white hover:scale-105 transition-transform">
              <Target className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-3">IT Companies</h3>
              <p className="text-white/70 text-sm">Casual polos and hoodies for tech teams</p>
            </div>

            <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-2xl text-white hover:scale-105 transition-transform">
              <ShoppingBag className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-3">Retail Chains</h3>
              <p className="text-white/70 text-sm">Professional uniforms for staff</p>
            </div>

            <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-2xl text-white hover:scale-105 transition-transform">
              <Users className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-3">Hospitality</h3>
              <p className="text-white/70 text-sm">Elegant uniforms for hotels & restaurants</p>
            </div>

            <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-2xl text-white hover:scale-105 transition-transform">
              <Package className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-3">Logistics</h3>
              <p className="text-white/70 text-sm">Durable workwear for delivery teams</p>
            </div>

            <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-2xl text-white hover:scale-105 transition-transform">
              <Shield className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-3">Security</h3>
              <p className="text-white/70 text-sm">Professional security guard uniforms</p>
            </div>

            <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-2xl text-white hover:scale-105 transition-transform">
              <Award className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-3">Education</h3>
              <p className="text-white/70 text-sm">School uniforms and sports kits</p>
            </div>

            <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-2xl text-white hover:scale-105 transition-transform">
              <TrendingUp className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-3">Startups</h3>
              <p className="text-white/70 text-sm">Branded merch and team uniforms</p>
            </div>

            <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-2xl text-white hover:scale-105 transition-transform">
              <Truck className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-3">Manufacturing</h3>
              <p className="text-white/70 text-sm">Heavy-duty workwear & safety gear</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customization Showcase Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Customization Options</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto">Make it uniquely yours with our branding solutions</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="bg-black text-white w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Shirt className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Embroidery</h3>
              <p className="text-black/70 mb-6">
                Premium thread embroidery for logos and names. Long-lasting and professional finish.
              </p>
              <ul className="space-y-2 text-sm text-black/60">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-black" />
                  Multi-color options
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-black" />
                  3D puff embroidery
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-black" />
                  Chest, sleeve, back placement
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="bg-black text-white w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Screen Printing</h3>
              <p className="text-black/70 mb-6">
                High-quality screen printing for large designs. Perfect for bulk orders with complex graphics.
              </p>
              <ul className="space-y-2 text-sm text-black/60">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-black" />
                  Full-color printing
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-black" />
                  Photographic quality
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-black" />
                  Front & back prints
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="bg-black text-white w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Digital Printing</h3>
              <p className="text-black/70 mb-6">
                Latest DTG technology for vibrant, detailed prints. Ideal for small batches and complex designs.
              </p>
              <ul className="space-y-2 text-sm text-black/60">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-black" />
                  No minimum order
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-black" />
                  Unlimited colors
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-black" />
                  Quick turnaround
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 bg-black text-white p-12 rounded-2xl text-center">
            <h3 className="text-3xl font-bold mb-4">Free Design Consultation</h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Our design team will help you create the perfect branded apparel. From concept to delivery, we've got you covered.
            </p>
            <Link to="/signup" className="bg-white text-black hover:bg-gray-100 font-bold py-4 px-8 rounded-lg inline-flex items-center transition-all">
              Schedule Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">How It Works</h2>
            <p className="text-xl text-black/60">Simple process, exceptional results</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Choose Products</h3>
              <p className="text-black/60">Select from our range of premium corporate apparel</p>
            </div>

            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Customize</h3>
              <p className="text-black/60">Add your logo and branding with our design team</p>
            </div>

            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Approve</h3>
              <p className="text-black/60">Review samples and approve final design</p>
            </div>

            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Deliver</h3>
              <p className="text-black/60">Receive your order in 48-72 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-3xl mx-auto">
            Join 500+ companies trusting Prime Eagle for their uniform needs. Get your quote in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/signup" className="bg-white text-black hover:bg-gray-100 font-bold py-5 px-10 rounded-lg inline-flex items-center justify-center transition-all">
              Start Your Order
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
            <a href="tel:+917307262985" className="border-2 border-white text-white hover:bg-white hover:text-black font-bold py-5 px-10 rounded-lg inline-flex items-center justify-center transition-all">
              <Phone className="mr-2 h-5 w-5" />
              +91 73072 62985
            </a>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/70">
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Free Consultation
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Volume Discounts
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              24/7 Support
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black text-white/60 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <img src="/logo.jpeg" alt="Prime Eagle" className="h-10 w-10 object-cover rounded" />
                <div className="ml-3">
                  <span className="text-xl font-bold text-white block">Prime Eagle</span>
                  <span className="text-xs text-white/40">Manufacturing Cloth (Customise)</span>
                </div>
              </div>
              <p className="text-white/60 mb-6 leading-relaxed max-w-md">
                India's premier manufacturer of corporate apparel. ISO-certified quality and unmatched service excellence.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-white mr-3 mt-1 flex-shrink-0" />
                  <span className="text-sm">Gujarat, India</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-sm">+91 73072 62985</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-sm">sales@primeeagle.com</span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Products</h3>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">Polo T-Shirts</li>
                <li className="hover:text-white transition-colors cursor-pointer">Hoodies</li>
                <li className="hover:text-white transition-colors cursor-pointer">Track Pants</li>
                <li className="hover:text-white transition-colors cursor-pointer">Custom Branding</li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Company</h3>
              <ul className="space-y-3 text-sm mb-8">
                <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">Quality</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">
              <p className="text-white/40">&copy; 2025 Prime Eagle. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
