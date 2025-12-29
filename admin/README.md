# LE Corporate - Admin Panel

Admin dashboard for managing products and content for LE Corporate e-commerce platform.

## Features

- 🔐 Secure admin authentication
- 📦 Product management (Add, Edit, Delete)
- 🖼️ Image upload support
- 🏷️ Category management
- 🔍 Product search
- ✅ Product activation toggle
- 📊 Real-time updates with Supabase

## Setup

1. Install dependencies:
```bash
npm install
```

2. The admin panel uses the same Supabase instance as the main app (`.env` file already configured)

3. Start the development server:
```bash
npm run dev
```

The admin panel will run on `http://localhost:5175`

## Admin Login

Use your Supabase admin credentials to login:
- Email: Your admin email
- Password: Your admin password

## Tech Stack

- React 18
- React Router DOM
- Supabase (Backend & Auth)
- Tailwind CSS
- Lucide React (Icons)
- Vite (Build tool)

## File Structure

```
admin/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
└── package.json
```

## Features Details

### Product Management
- Add new products with details (name, description, price, MOQ, category)
- Upload product images via URL
- Edit existing products
- Delete products (with confirmation)
- Toggle product active/inactive status
- Search products by name

### Authentication
- Secure login with Supabase auth
- Protected routes
- Session management
- Auto-redirect for unauthorized access

## Database Schema

Products are stored in the `products` table with the following structure:
- `id` (UUID)
- `name` (text)
- `description` (text)
- `category_id` (UUID, foreign key)
- `base_price` (numeric)
- `moq` (integer) - Minimum Order Quantity
- `image_url` (text)
- `is_active` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)
