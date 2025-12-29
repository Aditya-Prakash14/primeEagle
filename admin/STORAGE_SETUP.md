# Supabase Storage Setup Guide

## Setting Up Image Storage

### Step 1: Create Storage Bucket (Option A - Via Dashboard)

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Set the following:
   - **Name**: `product-images`
   - **Public**: ✅ Enable (checked)
   - **File size limit**: 5MB (recommended)
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp,image/gif`
5. Click **Create Bucket**

### Step 2: Configure Storage Policies

After creating the bucket, set up the following policies:

#### Via SQL Editor:
1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Copy and paste the content from `supabase_storage_setup.sql`
4. Run the query

#### Via Dashboard UI:
1. Go to **Storage** > **Policies**
2. Click on `product-images` bucket
3. Add the following policies:

**Policy 1: Allow Public Read**
- Policy name: `Allow public read access`
- Target roles: `public`
- Operations: `SELECT`
- Policy definition: `bucket_id = 'product-images'`

**Policy 2: Allow Authenticated Upload**
- Policy name: `Allow authenticated uploads`
- Target roles: `authenticated`
- Operations: `INSERT`
- Policy definition: `bucket_id = 'product-images'`

**Policy 3: Allow Authenticated Delete**
- Policy name: `Allow authenticated deletes`
- Target roles: `authenticated`
- Operations: `DELETE`
- Policy definition: `bucket_id = 'product-images'`

### Step 3: Test the Setup

1. Start your admin panel: `npm run dev`
2. Login to admin dashboard
3. Click "Add Product"
4. Try uploading an image
5. Image should upload to Supabase storage and display in preview

## How It Works

### Upload Flow:
```
Admin clicks "Upload Image"
    ↓
File selected from computer
    ↓
Image preview shown
    ↓
Click "Add Product"
    ↓
Image uploaded to Supabase Storage bucket
    ↓
Public URL generated
    ↓
URL saved to products table
    ↓
Image displayed on customer site
```

### Storage Structure:
```
product-images/
├── products/
│   ├── abc123-1234567890.jpg
│   ├── def456-1234567891.png
│   └── ghi789-1234567892.webp
```

### File Naming:
- Random prefix + timestamp + original extension
- Example: `xyz789-1703856789.jpg`
- This prevents naming conflicts

## Features

✅ **File Upload Interface**
- Drag & drop support (via file input)
- Image preview before upload
- Remove/change image option
- File type validation (images only)
- Size limit: 5MB

✅ **Supported Formats**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

✅ **Security**
- Only authenticated users can upload
- Public read access for display
- 5MB file size limit
- MIME type validation

## Troubleshooting

### Issue: "Storage bucket not found"
**Solution**: Make sure you created the bucket named exactly `product-images`

### Issue: "Permission denied"
**Solution**: Check storage policies are set up correctly. Authenticated users need INSERT permission.

### Issue: "File too large"
**Solution**: Image must be under 5MB. Compress the image before uploading.

### Issue: "Invalid file type"
**Solution**: Only image files (JPG, PNG, WEBP, GIF) are allowed.

### Issue: Image not displaying
**Solution**: 
1. Check if bucket is set to public
2. Verify the image URL in the database
3. Check browser console for errors

## Testing Checklist

- [ ] Bucket created and set to public
- [ ] Storage policies configured
- [ ] Admin panel running
- [ ] Can login to admin dashboard
- [ ] Can click "Upload Image" button
- [ ] Image preview appears after selecting file
- [ ] Can save product with image
- [ ] Image appears in product list
- [ ] Image displays on customer dashboard
- [ ] Can update image for existing product
- [ ] Can remove image

## Cost Considerations

Supabase Free Tier includes:
- 1GB storage
- 2GB bandwidth per month

For production:
- Consider image optimization
- Use WebP format for smaller file sizes
- Implement CDN for better performance
