# Supabase End-to-End Integration Guide

## ✅ What's Been Connected

### 1. **Authentication Context** (`src/contexts/AuthContext.jsx`)
- Global authentication state management
- Real-time auth state listening
- Automatic profile fetching on login
- Sign in, sign up, and sign out functions

### 2. **Protected Routes** (`src/components/ProtectedRoute.jsx`)
- Automatic redirect to login for unauthenticated users
- Loading states during auth check
- Wraps the Dashboard route

### 3. **App Integration** (`src/App.jsx`)
- AuthProvider wraps entire app
- Dashboard is protected with ProtectedRoute
- Auth state available throughout app

### 4. **Login Page** (`src/pages/Login.jsx`)
- Uses `useAuth` hook for authentication
- Real Supabase sign-in integration
- Error handling with user feedback
- Redirects to dashboard on success

### 5. **SignUp Page** (`src/pages/SignUp.jsx`)
- Uses `useAuth` hook for registration
- Creates user with metadata (name, phone, company)
- Password validation
- Success message and auto-redirect

### 6. **Dashboard** (`src/pages/Dashboard.jsx`)
- Displays real user data from Supabase
- Shows profile information
- Email verification status
- Member since date
- Protected route - requires authentication

## 🧪 Testing the Integration

### Test 1: Sign Up Flow
```bash
npm run dev
```

1. Go to http://localhost:5173/signup
2. Fill in the form with:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: +91 9876543210
   - Company: Test Corp
   - Password: test123
3. Click "Create Account"
4. Check console for success/errors

### Test 2: Login Flow
1. Go to http://localhost:5173/login
2. Enter your credentials
3. Click "Sign In"
4. Should redirect to Dashboard

### Test 3: Dashboard Access
1. Try accessing http://localhost:5173/dashboard directly
2. If not logged in → redirects to /login
3. If logged in → shows your profile data

### Test 4: Profile Data
1. Login successfully
2. Go to Dashboard → Profile tab
3. Verify your data is displayed:
   - Name
   - Email
   - Phone
   - Company
   - User ID
   - Email verification status

### Test 5: Logout
1. In Dashboard, click "Logout" button
2. Should redirect to home page
3. Try accessing /dashboard
4. Should redirect back to /login

## 📊 Verifying Data in Supabase

### Check Auth Users
1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. You should see your registered user
4. Check `user_metadata` for name, phone, company

### Check Profiles Table
1. Go to **Table Editor** → **profiles**
2. You should see a profile created automatically
3. Verify fields match signup data

## 🔧 Troubleshooting

### Error: "Invalid API key"
- Check `.env` file has correct credentials
- Restart dev server after changing `.env`
- Verify URL and key in Supabase dashboard

### Error: "Email not confirmed"
- Check Supabase → Authentication → Email Templates
- For development, you can disable email confirmation:
  - Go to Authentication → Settings
  - Disable "Enable email confirmations"

### Profile not showing
- Check browser console for errors
- Verify `profiles` table exists in Supabase
- Check if trigger `on_auth_user_created` fired
- Check Supabase logs in Dashboard → Logs

### Protected route not working
- Verify AuthProvider wraps routes in App.jsx
- Check browser console for auth errors
- Clear browser localStorage and retry

## 🔐 Current Auth Flow

```
User Signs Up
    ↓
Supabase creates auth.users entry
    ↓
Trigger creates profiles entry
    ↓
User receives confirmation email (if enabled)
    ↓
User confirms email (if required)
    ↓
User logs in
    ↓
AuthContext fetches user + profile
    ↓
User accesses Dashboard
    ↓
Real data displayed from Supabase
```

## 📱 What Works Now

### ✅ Authentication
- [x] Sign up with email/password
- [x] User metadata stored (name, phone, company)
- [x] Email confirmation flow (if enabled)
- [x] Login with email/password
- [x] Logout functionality
- [x] Session persistence (survives page refresh)

### ✅ Data Flow
- [x] User data from auth.users
- [x] Profile data from profiles table
- [x] Real-time auth state updates
- [x] Automatic profile creation on signup

### ✅ UI Components
- [x] Protected Dashboard route
- [x] Loading states
- [x] Error messages
- [x] Success notifications
- [x] User info display

## 🎯 Next Steps (Optional Enhancements)

### 1. Products Integration
```javascript
// src/hooks/useProducts.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_active', true)
    
    if (!error) setProducts(data)
    setLoading(false)
  }

  return { products, loading }
}
```

### 2. Cart Integration
```javascript
// Add to cart with Supabase
const addToCart = async (productId, quantity) => {
  const { data, error } = await supabase
    .from('cart')
    .insert({
      user_id: user.id,
      product_id: productId,
      quantity
    })
  
  if (error) console.error('Error adding to cart:', error)
}
```

### 3. Orders Integration
```javascript
// Fetch user orders
const fetchOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
}
```

## 📚 Available Auth Functions

```javascript
import { useAuth } from './contexts/AuthContext'

function MyComponent() {
  const { 
    user,           // Current user object
    profile,        // User profile from profiles table
    session,        // Current session
    loading,        // Loading state
    signIn,         // Sign in function
    signUp,         // Sign up function
    signOut,        // Sign out function
    updateProfile,  // Update profile function
    refreshProfile  // Refresh profile data
  } = useAuth()

  // Use auth data...
}
```

## 🔗 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [React Context API](https://react.dev/reference/react/useContext)
- [Protected Routes Pattern](https://ui.dev/react-router-protected-routes-authentication)

## ✨ Test Commands

```bash
# Start development server
npm run dev

# Check for errors
# Open browser console (F12)
# Check Network tab for API calls
# Check Console tab for errors

# View Supabase logs
# Go to Supabase Dashboard → Logs
# Filter by "Auth" or "Database"
```

## 🎉 Success Indicators

You'll know everything is working when:
1. ✅ Sign up creates user in Supabase
2. ✅ Profile automatically created in profiles table
3. ✅ Login redirects to dashboard
4. ✅ Dashboard shows your real data
5. ✅ Direct /dashboard access requires login
6. ✅ Logout works and redirects home
7. ✅ No console errors
8. ✅ Session persists after page refresh
