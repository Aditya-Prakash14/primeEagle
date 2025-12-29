# Supabase Backend Setup Guide

## Setup Complete! ✅

Your application has been configured with Supabase as the backend. Here's what has been set up:

### 1. Dependencies Installed
- `@supabase/supabase-js` - Official Supabase client library

### 2. Files Created

#### Configuration Files
- **`src/lib/supabase.js`** - Supabase client initialization and auth helper functions
- **`.env`** - Environment variables (add your Supabase credentials here)
- **`.env.example`** - Example environment variables template
- **`.gitignore`** - Updated to exclude `.env` files

#### Updated Components
- **`src/pages/Login.jsx`** - Integrated Supabase authentication with error handling
- **`src/pages/SignUp.jsx`** - Integrated Supabase user registration with validation

## Next Steps

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Project name
   - Database password (save this!)
   - Region (choose closest to your users)

### 2. Get Your API Credentials
1. Go to Project Settings → API
2. Copy your:
   - **Project URL** (under "Project URL")
   - **Anon/Public Key** (under "Project API keys")

### 3. Configure Environment Variables
Open the `.env` file and replace the placeholder values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Authentication in Supabase Dashboard

1. **Enable Email Authentication:**
   - Go to Authentication → Providers
   - Enable "Email" provider
   - Configure email templates if needed

2. **Configure Email Settings:**
   - Go to Authentication → Email Templates
   - Customize confirmation emails if desired

3. **Set Up User Metadata:**
   The signup form captures additional user data:
   - Full Name
   - Phone
   - Company
   
   This data is stored in the user's metadata and can be accessed via `user.user_metadata`

### 5. Create Database Tables (Optional)

If you want to store additional user profile information, create a profiles table:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  company text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policy to allow users to read their own profile
create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Create policy to allow users to update their own profile
create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Create policy to allow users to insert their own profile
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- Create trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, company)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'company'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 6. Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the signup page
3. Create a test account
4. Check your email for the confirmation link
5. Try logging in

## Available Auth Functions

The `src/lib/supabase.js` file provides these helper functions:

```javascript
// Sign up
await authService.signUp(email, password, userData)

// Sign in
await authService.signIn(email, password)

// Sign out
await authService.signOut()

// Get current user
await authService.getCurrentUser()

// Get current session
await authService.getSession()

// Listen to auth state changes
authService.onAuthStateChange((event, session) => {
  // Handle auth state changes
})

// Reset password
await authService.resetPassword(email)

// Update user
await authService.updateUser(updates)
```

## Protected Routes

To protect routes and require authentication, you can create an auth context or use the session checking:

```javascript
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../lib/supabase'

function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { session } = await authService.getSession()
    if (!session) {
      navigate('/login')
    }
    setLoading(false)
  }

  if (loading) return <div>Loading...</div>

  return children
}
```

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error:**
   - Check that your `.env` file has the correct credentials
   - Restart your dev server after updating `.env`

2. **Email not being sent:**
   - Check Supabase dashboard → Authentication → Email Templates
   - Verify email provider settings

3. **CORS errors:**
   - Add your development URL to Supabase dashboard → Authentication → URL Configuration

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript/introduction)

## Support

For issues or questions:
- [Supabase Discord](https://discord.supabase.com/)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
