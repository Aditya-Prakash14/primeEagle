# Prime Eagle - Corporate Apparel E-Commerce Platform

![Prime Eagle Logo](public/logo.jpeg)

A modern e-commerce platform for corporate apparel with custom branding solutions. Built with React, Vite, and Supabase.

## Features

- 🛍️ Product showcase with advanced filtering (fabric, color, category, search)
- 👤 User authentication and profile management
- 🎨 Product customization options (embroidery, screen printing, digital printing)
- 📱 WhatsApp integration for easy ordering
- 🔐 Secure admin panel for product management
- 📸 Supabase storage integration for product images
- 🎯 Industry-specific solutions showcase
- ⭐ Customer testimonials
- 📦 9+ product categories

## Tech Stack

- **Frontend**: React 18.3, Vite 5.4
- **Routing**: React Router DOM 6.21
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database, Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clodithigbrand
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5174`

### Admin Panel

The admin panel is located in the `/admin` folder:

```bash
cd admin
npm install
npm run dev
```

Admin panel runs on `http://localhost:5176`

## Project Structure

```
clodithigbrand/
├── public/              # Static assets
│   ├── images/         # Product and hero images
│   ├── icons/          # App icons
│   └── logo.jpeg       # Brand logo
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts (Auth)
│   ├── lib/           # Utilities and Supabase client
│   └── pages/         # Page components
│       ├── LandingPage.jsx
│       ├── Login.jsx
│       ├── SignUp.jsx
│       └── Dashboard.jsx
├── admin/             # Admin panel (separate app)
└── ...config files
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Deploy**
   - Click "Deploy"
   - Your site will be live at `your-project.vercel.app`

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## Database Schema

The application uses Supabase with the following main tables:

- `profiles` - User profiles
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `cart` - Shopping cart items
- `reviews` - Product reviews

## Features in Detail

### Customer Features
- Browse products with multiple filters
- Search functionality
- WhatsApp integration for quick orders
- User dashboard with profile management
- Product inquiry system

### Admin Features
- Product CRUD operations
- Image upload to Supabase storage
- Product specifications management
- Category management
- Order tracking

## Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Support

- WhatsApp: +91 73072 62985
- Email: sales@primeeagle.com

## License

Private - All rights reserved © 2025 Prime Eagle

---

Built with ❤️ for Prime Eagle Corporate Apparel
