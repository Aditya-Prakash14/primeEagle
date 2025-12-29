-- =====================================================
-- SUPABASE DATABASE SCHEMA
-- Corporate Apparel E-commerce Platform
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE
-- Stores additional user information
-- =====================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  company text,
  avatar_url text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- RLS Policies for profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- =====================================================
-- 2. CATEGORIES TABLE
-- Product categories (shirts, t-shirts, hoodies, etc.)
-- =====================================================
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select
  using ( true );

create policy "Only admins can manage categories"
  on public.categories for all
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- =====================================================
-- 3. PRODUCTS TABLE
-- Corporate apparel products
-- =====================================================
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  base_price decimal(10, 2) not null,
  is_active boolean default true,
  is_featured boolean default false,
  stock_quantity integer default 0,
  min_order_quantity integer default 1,
  images jsonb default '[]'::jsonb, -- Array of image URLs
  specifications jsonb default '{}'::jsonb, -- Product specifications
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone"
  on public.products for select
  using ( true );

create policy "Only admins can manage products"
  on public.products for all
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- =====================================================
-- 4. PRODUCT VARIANTS TABLE
-- Sizes, colors, and custom options
-- =====================================================
create table if not exists public.product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  sku text unique not null,
  size text, -- S, M, L, XL, XXL, etc.
  color text,
  price_adjustment decimal(10, 2) default 0, -- Additional cost for this variant
  stock_quantity integer default 0,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.product_variants enable row level security;

create policy "Product variants are viewable by everyone"
  on public.product_variants for select
  using ( true );

create policy "Only admins can manage product variants"
  on public.product_variants for all
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- =====================================================
-- 5. CUSTOMIZATION OPTIONS TABLE
-- Logos, text prints, embroidery options
-- =====================================================
create table if not exists public.customization_options (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null check (type in ('logo', 'text', 'embroidery', 'pattern')),
  description text,
  base_price decimal(10, 2) not null default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.customization_options enable row level security;

create policy "Customization options are viewable by everyone"
  on public.customization_options for select
  using ( true );

create policy "Only admins can manage customization options"
  on public.customization_options for all
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- =====================================================
-- 6. ORDERS TABLE
-- Customer orders
-- =====================================================
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  order_number text unique not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  
  -- Customer information
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  company_name text,
  
  -- Shipping address
  shipping_address jsonb not null, -- {street, city, state, postal_code, country}
  
  -- Billing address
  billing_address jsonb, -- Optional, same as shipping if null
  
  -- Order totals
  subtotal decimal(10, 2) not null,
  tax decimal(10, 2) default 0,
  shipping_cost decimal(10, 2) default 0,
  discount decimal(10, 2) default 0,
  total decimal(10, 2) not null,
  
  -- Payment
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  payment_details jsonb, -- Store transaction IDs, etc.
  
  -- Additional info
  notes text,
  internal_notes text, -- Admin notes
  
  -- Timestamps
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  shipped_at timestamp with time zone,
  delivered_at timestamp with time zone
);

alter table public.orders enable row level security;

create policy "Users can view their own orders"
  on public.orders for select
  using ( auth.uid() = user_id );

create policy "Users can create their own orders"
  on public.orders for insert
  with check ( auth.uid() = user_id );

create policy "Admins can view all orders"
  on public.orders for select
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update all orders"
  on public.orders for update
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- =====================================================
-- 7. ORDER ITEMS TABLE
-- Individual items in an order
-- =====================================================
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  
  -- Product details (stored for historical record)
  product_name text not null,
  product_sku text,
  size text,
  color text,
  
  -- Pricing
  unit_price decimal(10, 2) not null,
  quantity integer not null,
  subtotal decimal(10, 2) not null,
  
  -- Customization
  customizations jsonb default '[]'::jsonb, -- Array of customization details
  customization_cost decimal(10, 2) default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.order_items enable row level security;

create policy "Users can view items from their own orders"
  on public.order_items for select
  using ( 
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Users can create items for their own orders"
  on public.order_items for insert
  with check ( 
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on public.order_items for select
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- =====================================================
-- 8. CART TABLE
-- Shopping cart for users
-- =====================================================
create table if not exists public.cart (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  variant_id uuid references public.product_variants(id) on delete cascade,
  quantity integer not null default 1,
  customizations jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id, variant_id)
);

alter table public.cart enable row level security;

create policy "Users can manage their own cart"
  on public.cart for all
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

-- =====================================================
-- 9. REVIEWS TABLE
-- Product reviews and ratings
-- =====================================================
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  comment text,
  images jsonb default '[]'::jsonb,
  is_verified_purchase boolean default false,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;

create policy "Approved reviews are viewable by everyone"
  on public.reviews for select
  using ( is_approved = true );

create policy "Users can view their own reviews"
  on public.reviews for select
  using ( auth.uid() = user_id );

create policy "Users can create reviews for their orders"
  on public.reviews for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own reviews"
  on public.reviews for update
  using ( auth.uid() = user_id );

create policy "Admins can manage all reviews"
  on public.reviews for all
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to relevant tables
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at_column();

create trigger update_products_updated_at before update on public.products
  for each row execute function update_updated_at_column();

create trigger update_orders_updated_at before update on public.orders
  for each row execute function update_updated_at_column();

create trigger update_cart_updated_at before update on public.cart
  for each row execute function update_updated_at_column();

create trigger update_reviews_updated_at before update on public.reviews
  for each row execute function update_updated_at_column();

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone, company)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'company'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function to generate order number
create or replace function generate_order_number()
returns text as $$
declare
  new_order_number text;
  order_count integer;
begin
  select count(*) into order_count from public.orders;
  new_order_number := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || lpad((order_count + 1)::text, 5, '0');
  return new_order_number;
end;
$$ language plpgsql;

-- Trigger to auto-generate order number
create or replace function set_order_number()
returns trigger as $$
begin
  if new.order_number is null then
    new.order_number := generate_order_number();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger set_order_number_trigger
  before insert on public.orders
  for each row execute function set_order_number();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Products indexes
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_products_is_featured on public.products(is_featured);

-- Product variants indexes
create index if not exists idx_variants_product on public.product_variants(product_id);
create index if not exists idx_variants_sku on public.product_variants(sku);

-- Orders indexes
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- Order items indexes
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_order_items_product on public.order_items(product_id);

-- Cart indexes
create index if not exists idx_cart_user on public.cart(user_id);
create index if not exists idx_cart_product on public.cart(product_id);

-- Reviews indexes
create index if not exists idx_reviews_product on public.reviews(product_id);
create index if not exists idx_reviews_user on public.reviews(user_id);
create index if not exists idx_reviews_approved on public.reviews(is_approved);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample categories
insert into public.categories (name, slug, description) values
  ('Corporate Shirts', 'corporate-shirts', 'Premium formal shirts for corporate wear'),
  ('T-Shirts', 't-shirts', 'Comfortable cotton t-shirts with custom printing'),
  ('Polo Shirts', 'polo-shirts', 'Classic polo shirts for business casual'),
  ('Hoodies', 'hoodies', 'Warm hoodies with company branding'),
  ('Jackets', 'jackets', 'Professional jackets and outerwear')
on conflict do nothing;

-- Insert sample customization options
insert into public.customization_options (name, type, description, base_price) values
  ('Company Logo Print', 'logo', 'Print your company logo on the product', 150.00),
  ('Embroidered Logo', 'embroidery', 'Embroidered company logo', 250.00),
  ('Custom Text', 'text', 'Add custom text to your products', 50.00),
  ('Employee Name', 'text', 'Add employee name on the product', 30.00)
on conflict do nothing;

-- =====================================================
-- VIEWS (Optional - for easier querying)
-- =====================================================

-- View for products with category information
create or replace view products_with_category as
select 
  p.*,
  c.name as category_name,
  c.slug as category_slug
from public.products p
left join public.categories c on p.category_id = c.id;

-- View for orders with customer information
create or replace view orders_with_customer as
select 
  o.*,
  pr.full_name,
  pr.email as profile_email,
  pr.phone as profile_phone,
  pr.company
from public.orders o
left join public.profiles pr on o.user_id = pr.id;

-- =====================================================
-- STORAGE BUCKETS (Run in Supabase Dashboard)
-- =====================================================

-- Create storage bucket for product images
-- insert into storage.buckets (id, name, public) 
-- values ('products', 'products', true);

-- Create storage bucket for user avatars
-- insert into storage.buckets (id, name, public) 
-- values ('avatars', 'avatars', true);

-- Create storage bucket for customization files
-- insert into storage.buckets (id, name, public) 
-- values ('customizations', 'customizations', false);

-- Storage policies for product images
-- create policy "Product images are publicly accessible"
--   on storage.objects for select
--   using ( bucket_id = 'products' );

-- create policy "Admins can upload product images"
--   on storage.objects for insert
--   with check ( 
--     bucket_id = 'products' and
--     exists (
--       select 1 from public.profiles
--       where profiles.id = auth.uid()
--       and profiles.role = 'admin'
--     )
--   );
