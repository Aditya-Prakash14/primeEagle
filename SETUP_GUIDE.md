# LE Corporate - Complete Setup Guide

## Project Structure

```
clodithigbrand/
├── admin/              # Admin Panel (Port 5175)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   ├── contexts/
│   │   └── lib/
│   └── package.json
│
└── (main website)      # Customer Website (Port 5174)
    ├── src/
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── Login.jsx
    │   │   ├── SignUp.jsx
    │   │   └── Dashboard.jsx
    └── package.json
```

## Running Both Applications

### Main Customer Website
```bash
# Terminal 1
cd /Users/adityaprakash/Desktop/clodithigbrand
npm run dev
# Runs on: http://localhost:5174
```

### Admin Panel
```bash
# Terminal 2
cd /Users/adityaprakash/Desktop/clodithigbrand/admin
npm run dev
# Runs on: http://localhost:5175
```

## Admin Panel Features

### ✅ What's Included:

1. **Secure Authentication**
   - Admin login with Supabase
   - Protected routes
   - Session management

2. **Product Management**
   - ➕ Add new products
   - ✏️ Edit existing products
   - 🗑️ Delete products
   - 🔍 Search products
   - 🖼️ Image URL support
   - 🏷️ Category assignment
   - 💰 Pricing and MOQ setup
   - ✅ Toggle active/inactive status

3. **User Interface**
   - Clean, modern dashboard
   - Responsive design
   - Real-time notifications
   - Modal forms for add/edit
   - Product grid with images
   - Search functionality

## Database Connection

Both applications connect to the same Supabase instance:
- URL: `https://chewjrpmcvbyynxgcfcc.supabase.co`
- Both use the same `.env` configuration

## Workflow

### Admin Workflow:
1. Login to admin panel at `http://localhost:5175/login`
2. Add products via dashboard
3. Products are saved to Supabase `products` table

### Customer Workflow:
1. Visit main site at `http://localhost:5174`
2. Sign up / Login
3. View products in dashboard (fetched from Supabase)
4. Click "Inquire" to contact via WhatsApp

## Admin Credentials

To create an admin user, you can:

1. **Option 1: Create via Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to Authentication > Users
   - Click "Add user"
   - Add admin email and password

2. **Option 2: Use existing user**
   - Use any email/password you created during testing
   - Login to admin panel with those credentials

## Product Data Flow

```
Admin Panel (Port 5175)
    ↓
  Add/Edit Product
    ↓
Supabase Database
    ↓
Customer Dashboard (Port 5174)
    ↓
Display Products with WhatsApp Inquiry
```

## Important Notes

- **Admin Panel** runs on port **5175**
- **Customer Site** runs on port **5174**
- Both share the same Supabase backend
- Products added by admin are instantly available to customers
- Images are loaded via URL (no file upload yet)

## Next Steps

1. **Start Admin Panel**: `cd admin && npm run dev`
2. **Login**: Use your Supabase credentials
3. **Add Products**: Click "Add Product" button
4. **View on Customer Site**: Products appear automatically in customer dashboard

## Troubleshooting

### Port Already in Use
If ports are busy, modify the port in:
- `admin/vite.config.js` - Change `port: 5175`
- `admin/package.json` - Update `--port 5175`

### Cannot Login to Admin
- Ensure user exists in Supabase Authentication
- Check `.env` file has correct Supabase credentials
- Verify Supabase project is active

### Products Not Showing
- Check if products have `is_active = true`
- Verify Supabase connection in browser console
- Check Network tab for API errors
