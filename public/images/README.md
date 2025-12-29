# Image Assets Directory

## Folder Structure

### `/logos`
- Company logo files
- Partner logos
- Certification badges
- **Recommended sizes:** 
  - Primary logo: 512x512px (PNG with transparency)
  - Horizontal logo: 1200x400px

### `/products`
- Product photos
- T-shirts, hoodies, lowers
- **Recommended sizes:** 
  - Product images: 1200x1200px (square)
  - Detail shots: 800x600px
  - Format: JPG or WebP for best performance

### `/hero`
- Hero section images
- Banner backgrounds
- Feature images
- **Recommended sizes:**
  - Hero images: 1920x1080px (landscape)
  - Mobile hero: 800x1200px (portrait)

## Image Optimization Tips

1. **Compress images** before uploading (use TinyPNG or similar)
2. **Use WebP format** when possible for better performance
3. **Provide alt text** in components for accessibility
4. **Use responsive images** with different sizes for mobile/desktop

## Placeholder Images

Until real product photos are available, you can:
- Use placeholder services: https://placeholder.com/
- Generate with AI: Midjourney, DALL-E
- Use stock photos: Unsplash, Pexels (commercial use)

## Example Usage in Components

```jsx
// Logo
<img src="/images/logos/logo.png" alt="LE Corporate Logo" />

// Product
<img src="/images/products/polo-navy.jpg" alt="Navy Blue Polo Shirt" />

// Hero
<img src="/images/hero/team-corporate.jpg" alt="Corporate Team" />
```
