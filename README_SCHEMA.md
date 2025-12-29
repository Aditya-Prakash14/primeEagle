# Database Schema Documentation

## Overview
This document explains the database schema for the corporate apparel e-commerce platform.

## How to Apply the Schema

### Option 1: Using Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query
4. Copy the entire contents of `supabase_schema.sql`
5. Paste and click **Run**

### Option 2: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

## Database Tables

### 1. **profiles**
Stores extended user information beyond authentication.

**Fields:**
- `id` (UUID, Primary Key) - References auth.users
- `full_name` (Text)
- `email` (Text)
- `phone` (Text)
- `company` (Text)
- `avatar_url` (Text)
- `role` (Text) - 'customer' or 'admin'
- `created_at`, `updated_at` (Timestamps)

**Relationships:**
- Links to `auth.users` table
- Referenced by `orders` and `reviews`

---

### 2. **categories**
Product categories for organizing apparel.

**Fields:**
- `id` (UUID, Primary Key)
- `name` (Text) - e.g., "Corporate Shirts"
- `slug` (Text, Unique) - URL-friendly identifier
- `description` (Text)
- `image_url` (Text)
- `created_at` (Timestamp)

**Sample Data:**
- Corporate Shirts
- T-Shirts
- Polo Shirts
- Hoodies
- Jackets

---

### 3. **products**
Main product catalog.

**Fields:**
- `id` (UUID, Primary Key)
- `category_id` (UUID, Foreign Key)
- `name` (Text) - Product name
- `slug` (Text, Unique)
- `description` (Text)
- `base_price` (Decimal) - Base price in your currency
- `is_active` (Boolean) - Product availability
- `is_featured` (Boolean) - Featured products
- `stock_quantity` (Integer)
- `min_order_quantity` (Integer)
- `images` (JSONB) - Array of image URLs
- `specifications` (JSONB) - Additional product specs
- `created_at`, `updated_at` (Timestamps)

**Example Images Structure:**
```json
[
  "https://bucket.supabase.co/products/shirt-1.jpg",
  "https://bucket.supabase.co/products/shirt-2.jpg"
]
```

---

### 4. **product_variants**
Different sizes, colors, and variations of products.

**Fields:**
- `id` (UUID, Primary Key)
- `product_id` (UUID, Foreign Key)
- `sku` (Text, Unique) - Stock Keeping Unit
- `size` (Text) - S, M, L, XL, XXL, etc.
- `color` (Text) - Color name or hex code
- `price_adjustment` (Decimal) - Additional cost for this variant
- `stock_quantity` (Integer)
- `is_available` (Boolean)
- `created_at` (Timestamp)

**Example:**
- Product: "Corporate Shirt"
- Variant 1: Size L, Color Blue, SKU: CS-L-BLUE
- Variant 2: Size XL, Color White, SKU: CS-XL-WHITE

---

### 5. **customization_options**
Available customization services.

**Fields:**
- `id` (UUID, Primary Key)
- `name` (Text) - e.g., "Company Logo Print"
- `type` (Text) - 'logo', 'text', 'embroidery', 'pattern'
- `description` (Text)
- `base_price` (Decimal) - Cost for this customization
- `is_active` (Boolean)
- `created_at` (Timestamp)

**Sample Data:**
- Company Logo Print (₹150)
- Embroidered Logo (₹250)
- Custom Text (₹50)
- Employee Name (₹30)

---

### 6. **orders**
Customer orders with complete details.

**Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `order_number` (Text, Unique) - Auto-generated (e.g., ORD-20251229-00001)
- `status` (Text) - pending, confirmed, processing, shipped, delivered, cancelled
- Customer fields: `customer_name`, `customer_email`, `customer_phone`, `company_name`
- `shipping_address` (JSONB) - Full address object
- `billing_address` (JSONB) - Optional, defaults to shipping
- Financial fields: `subtotal`, `tax`, `shipping_cost`, `discount`, `total`
- `payment_status` (Text) - pending, paid, failed, refunded
- `payment_method`, `payment_details` (JSONB)
- `notes`, `internal_notes` (Text)
- Timestamps: `created_at`, `updated_at`, `shipped_at`, `delivered_at`

**Address Structure:**
```json
{
  "street": "123 Business Park",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postal_code": "400001",
  "country": "India"
}
```

---

### 7. **order_items**
Individual line items within an order.

**Fields:**
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key)
- `product_id` (UUID, Foreign Key)
- `variant_id` (UUID, Foreign Key)
- Product snapshot: `product_name`, `product_sku`, `size`, `color`
- `unit_price` (Decimal)
- `quantity` (Integer)
- `subtotal` (Decimal)
- `customizations` (JSONB) - Array of applied customizations
- `customization_cost` (Decimal)
- `created_at` (Timestamp)

**Customizations Structure:**
```json
[
  {
    "type": "logo",
    "name": "Company Logo Print",
    "price": 150.00,
    "details": {
      "position": "chest",
      "file_url": "..."
    }
  }
]
```

---

### 8. **cart**
Shopping cart for authenticated users.

**Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `product_id` (UUID, Foreign Key)
- `variant_id` (UUID, Foreign Key)
- `quantity` (Integer)
- `customizations` (JSONB)
- `created_at`, `updated_at` (Timestamps)

**Unique Constraint:** User can't have duplicate cart entries for the same product+variant combination.

---

### 9. **reviews**
Product reviews and ratings.

**Fields:**
- `id` (UUID, Primary Key)
- `product_id` (UUID, Foreign Key)
- `user_id` (UUID, Foreign Key)
- `order_id` (UUID, Foreign Key) - Optional, links to verified purchase
- `rating` (Integer) - 1 to 5
- `title` (Text)
- `comment` (Text)
- `images` (JSONB) - Review photos
- `is_verified_purchase` (Boolean)
- `is_approved` (Boolean) - Admin moderation
- `created_at`, `updated_at` (Timestamps)

---

## Security (Row Level Security)

All tables have RLS enabled with appropriate policies:

### Public Access
- **SELECT**: Categories, Products, Product Variants, Customization Options, Approved Reviews

### User-Specific Access
- **Profiles**: Users can view all, but only edit their own
- **Orders**: Users can only view/create their own orders
- **Cart**: Users can fully manage their own cart items
- **Reviews**: Users can create and edit their own reviews

### Admin Access
- Admins (role='admin') can manage all data in all tables
- Admins can approve reviews, manage products, and update order statuses

---

## Automated Features

### Triggers
1. **Auto-update timestamps**: `updated_at` automatically updates on record modification
2. **Auto-create profile**: Profile automatically created when user signs up
3. **Auto-generate order numbers**: Format: ORD-YYYYMMDD-XXXXX

### Functions
- `handle_new_user()` - Creates profile on signup
- `generate_order_number()` - Generates sequential order numbers
- `update_updated_at_column()` - Updates timestamps

---

## Indexes

Performance indexes created for:
- Product lookups by category, slug, status
- Order lookups by user, status, order number
- Cart lookups by user and product
- Review lookups by product and approval status

---

## Views

### products_with_category
Joins products with category information for easier querying.

### orders_with_customer
Joins orders with user profile information.

---

## Storage Buckets

### Recommended Buckets (create in Supabase Dashboard):
1. **products** (Public) - Product images
2. **avatars** (Public) - User avatars
3. **customizations** (Private) - Customer logo uploads

---

## Example Queries

### Get all active products with categories
```sql
select * from products_with_category 
where is_active = true;
```

### Get user's orders with items
```sql
select 
  o.*,
  json_agg(oi.*) as items
from orders o
left join order_items oi on o.id = oi.order_id
where o.user_id = 'user-uuid'
group by o.id;
```

### Get product with variants
```sql
select 
  p.*,
  json_agg(pv.*) as variants
from products p
left join product_variants pv on p.id = pv.product_id
where p.slug = 'corporate-shirt'
group by p.id;
```

---

## Next Steps After Running Schema

1. **Create Admin User:**
   - Sign up through your app
   - Manually update role in profiles table to 'admin'

2. **Add Products:**
   - Use admin panel or SQL to insert products
   - Upload images to storage bucket
   - Create product variants

3. **Test Order Flow:**
   - Add items to cart
   - Create test order
   - Verify order number generation

4. **Set Up Storage:**
   - Create storage buckets in Supabase dashboard
   - Configure storage policies
   - Test image uploads

---

## Support

For questions about the schema:
- Review the SQL comments in `supabase_schema.sql`
- Check Supabase documentation: https://supabase.com/docs
- Review Row Level Security policies for access control
