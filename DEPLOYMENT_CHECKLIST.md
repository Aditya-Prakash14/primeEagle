# Deployment Checklist for Vercel

## Pre-Deployment Steps

- [ ] All code is committed to Git
- [ ] Environment variables are documented in .env.example
- [ ] Build works locally: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] All images exist in public folder
- [ ] Supabase credentials are ready
- [ ] Admin role is granted to admin users in database

## Vercel Deployment

### 1. Main Customer Site

- [ ] Create new project on Vercel
- [ ] Connect GitHub repository
- [ ] Set Root Directory: `./` (root)
- [ ] Framework Preset: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### 2. Environment Variables

Add these in Vercel project settings:

```
VITE_SUPABASE_URL=https://chewjrpmcvbyynxgcfcc.supabase.co
VITE_SUPABASE_ANON_KEY=<your_key_here>
```

- [ ] VITE_SUPABASE_URL is set
- [ ] VITE_SUPABASE_ANON_KEY is set
- [ ] Variables are set for Production environment

### 3. Admin Panel (Separate Deployment)

- [ ] Create another Vercel project for admin
- [ ] Set Root Directory: `admin`
- [ ] Add same environment variables
- [ ] Deploy admin panel

## Post-Deployment Verification

- [ ] Customer site loads at Vercel URL
- [ ] Login works correctly
- [ ] Signup creates new users
- [ ] Dashboard loads after login
- [ ] Products display correctly
- [ ] Images load properly
- [ ] WhatsApp links work
- [ ] Filters function correctly
- [ ] Mobile responsive design works
- [ ] Admin panel loads and authenticates
- [ ] Admin can add/edit products
- [ ] Image uploads to Supabase work

## DNS & Custom Domain (Optional)

- [ ] Add custom domain in Vercel settings
- [ ] Update DNS records:
  - A record: 76.76.21.21
  - CNAME: cname.vercel-dns.com
- [ ] Verify SSL certificate is active
- [ ] Test site at custom domain

## Performance Optimization

- [ ] Enable Analytics in Vercel
- [ ] Check Lighthouse scores
- [ ] Optimize images if needed
- [ ] Enable compression
- [ ] Configure caching headers

## Monitoring

- [ ] Set up Vercel Analytics
- [ ] Monitor error rates
- [ ] Check build logs for warnings
- [ ] Test all critical user flows

## Rollback Plan

If deployment issues occur:
1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find previous working deployment
4. Click "..." → "Promote to Production"

## Quick Deploy Commands

```bash
# Ensure everything is committed
git add .
git commit -m "Ready for production"
git push origin main

# Vercel will auto-deploy from main branch
```

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- React Router: https://reactrouter.com

---

**Last Updated**: December 29, 2025
**Deployment Platform**: Vercel
**Framework**: Vite + React
**Database**: Supabase
