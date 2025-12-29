# Prime Eagle - Deployment Guide

## Deploy to Vercel

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- Your Supabase URL and Anon Key

### Steps to Deploy

1. **Push your code to GitHub** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Environment Variables**
   In the Vercel project settings, add these environment variables:
   
   ```
   VITE_SUPABASE_URL=https://chewjrpmcvbyynxgcfcc.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Custom Domain (Optional)
1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., primeeagle.com)
4. Follow the DNS configuration instructions

### Continuous Deployment
- Once connected, every push to your main branch will automatically deploy
- Pull requests will get preview deployments

### Build Configuration
The project is configured with:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Framework: Vite

### Important Notes
- Make sure all environment variables are set in Vercel
- The site will use SPA routing (all routes redirect to index.html)
- Images and assets in /public will be served from the root

### Admin Panel
To deploy the admin panel separately:
1. Create a new Vercel project for the admin folder
2. Set the root directory to `admin`
3. Add the same environment variables
4. Deploy

### Troubleshooting
- If build fails, check the build logs in Vercel dashboard
- Verify environment variables are correctly set
- Ensure all dependencies are in package.json
- Check that images referenced exist in the public folder
