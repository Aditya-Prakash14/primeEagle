# Public Folder Structure

## 📁 Directory Structure

```
public/
├── images/
│   ├── logos/           # Company logos and branding
│   ├── products/        # Product photos (polo, hoodies, lowers)
│   ├── hero/            # Hero section and banner images
│   └── README.md        # Image guidelines
├── icons/               # PWA app icons (72x72 to 512x512)
├── favicon.svg          # Website favicon (LE Corporate logo)
├── manifest.json        # PWA manifest file
├── robots.txt           # Search engine crawling rules
├── sitemap.xml          # XML sitemap for SEO
└── .htaccess            # Apache server configuration

```

## 📝 Files Overview

### `favicon.svg`
- Custom LE Corporate logo favicon
- SVG format for crisp display at any size
- Red gradient theme matching brand colors

### `manifest.json`
- Progressive Web App configuration
- Enables "Add to Home Screen" on mobile
- Defines app name, colors, and icon sizes
- Theme color: #dc2626 (primary red)

### `robots.txt`
- Controls search engine crawling
- Disallows: /dashboard, /login, /signup (private pages)
- Allows: all other public pages
- References sitemap location

### `sitemap.xml`
- SEO sitemap for search engines
- Lists all public pages with priority
- Update when adding new pages

### `.htaccess`
- Apache server configuration
- Enables React Router (SPA routing)
- Compression for faster loading
- Browser caching for images and assets

## 🖼️ Image Folders

### `/images/logos/`
**Purpose:** Company branding assets
**Recommended files:**
- `logo.png` - Main logo (512x512px, transparent)
- `logo-white.png` - White version for dark backgrounds
- `logo-horizontal.png` - Horizontal layout (1200x400px)
- `logo.svg` - Vector format for scalability

### `/images/products/`
**Purpose:** Product photography
**Recommended structure:**
```
products/
├── polo-navy-front.jpg
├── polo-navy-back.jpg
├── polo-black-front.jpg
├── hoodie-gray-front.jpg
├── hoodie-zip-black.jpg
├── lowers-navy.jpg
└── lowers-gray.jpg
```
**Specs:** 1200x1200px (square), JPG/WebP, optimized < 200KB

### `/images/hero/`
**Purpose:** Banner and hero section images
**Recommended files:**
- `hero-main.jpg` - Main hero (1920x1080px)
- `team-corporate.jpg` - Team photos
- `factory.jpg` - Manufacturing facility
- `quality-check.jpg` - Quality assurance
**Specs:** Landscape 16:9 ratio, JPG/WebP, optimized < 500KB

### `/icons/`
**Purpose:** PWA app icons
**Required sizes:**
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512
**Format:** PNG with transparency
**Naming:** `icon-{size}.png` (e.g., `icon-192x192.png`)

## 🎨 Usage in Components

### Import from public folder:
```jsx
// Direct path reference (no import needed)
<img src="/images/logos/logo.png" alt="LE Corporate" />
<img src="/images/products/polo-navy.jpg" alt="Navy Polo" />
<img src="/images/hero/team.jpg" alt="Corporate Team" />
```

### Background images:
```jsx
<div style={{ backgroundImage: 'url(/images/hero/main.jpg)' }}>
```

### Responsive images:
```jsx
<picture>
  <source srcset="/images/hero/main-mobile.jpg" media="(max-width: 768px)" />
  <img src="/images/hero/main.jpg" alt="Hero" />
</picture>
```

## ⚡ Image Optimization Tips

1. **Compress before upload:**
   - Use TinyPNG, ImageOptim, or Squoosh
   - Target: < 200KB for products, < 500KB for hero

2. **Use modern formats:**
   - WebP for web (better compression)
   - PNG for logos (transparency)
   - JPG for photos

3. **Provide multiple sizes:**
   - Desktop: 1920px width
   - Tablet: 1024px width
   - Mobile: 640px width

4. **Always add alt text:**
   - Improves SEO
   - Accessibility for screen readers
   - Shows when image fails to load

## 🚀 Deployment Notes

### Vercel / Netlify:
- Public folder automatically served at root
- No additional configuration needed

### Apache / cPanel:
- Upload `.htaccess` for SPA routing
- Ensure mod_rewrite is enabled
- Set proper MIME types

### Nginx:
- Use try_files for SPA routing
- Enable gzip compression
- Configure browser caching

## 📋 Checklist Before Launch

- [ ] Add company logo (PNG + SVG)
- [ ] Add product photos (all variants)
- [ ] Add hero/banner images
- [ ] Generate PWA icons (all sizes)
- [ ] Optimize all images (< 200KB each)
- [ ] Test favicon displays correctly
- [ ] Verify manifest.json works
- [ ] Check robots.txt rules
- [ ] Update sitemap.xml with all pages
- [ ] Test .htaccess on server

## 🔗 Resources

- **Image Optimization:** [TinyPNG](https://tinypng.com)
- **Icon Generator:** [RealFaviconGenerator](https://realfavicongenerator.net)
- **PWA Testing:** [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- **Free Images:** [Unsplash](https://unsplash.com), [Pexels](https://pexels.com)
