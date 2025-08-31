# Deployment Guide for Vinit Dhatrak's Portfolio

This guide will help you deploy your portfolio website to Cloudflare Pages and connect it to your custom domain `dhatrak.com`.

## 🚀 Quick Deployment Steps

### Step 1: Prepare Your Repository

1. **Create a GitHub repository** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/vinitdhatrak/portfolio.git
   git push -u origin main
   ```

### Step 2: Deploy to Cloudflare Pages

1. **Login to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to "Pages" in the sidebar

2. **Create a new Pages project**
   - Click "Create a project"
   - Choose "Connect to Git"
   - Select your GitHub repository
   - Authorize Cloudflare to access your repository

3. **Configure build settings**
   - **Project name**: `vinit-dhatrak-portfolio`
   - **Production branch**: `main`
   - **Build command**: (leave empty - it's a static site)
   - **Build output directory**: `/`
   - **Root directory**: `/`

4. **Deploy**
   - Click "Save and Deploy"
   - Wait for the initial deployment to complete

### Step 3: Configure Custom Domain

1. **Add your domain to Cloudflare**
   - In Cloudflare dashboard, click "Add a site"
   - Enter `dhatrak.com`
   - Choose a plan (Free is sufficient)
   - Update nameservers at your domain registrar

2. **Connect domain to Pages**
   - Go to your Pages project
   - Navigate to "Custom domains" tab
   - Click "Set up a custom domain"
   - Enter `dhatrak.com`
   - Cloudflare will automatically create DNS records

3. **Configure DNS records**
   - Ensure these records exist in your DNS:
   ```
   Type: CNAME
   Name: dhatrak.com
   Content: vinit-dhatrak-portfolio.pages.dev
   
   Type: CNAME
   Name: www
   Content: dhatrak.com
   ```

### Step 4: Enable HTTPS and Security

1. **SSL/TLS Settings**
   - Go to SSL/TLS → Overview
   - Set encryption mode to "Full (strict)"
   - Enable "Always Use HTTPS"

2. **Security Headers**
   - The `_redirects` file already includes security headers
   - These will be automatically applied

## 🔧 Advanced Configuration

### Environment Variables

If you need environment variables:
1. Go to Pages project → Settings → Environment variables
2. Add variables for production environment

### Custom Build Process

If you add a build process later:
1. Update `package.json` scripts
2. Modify build settings in Cloudflare Pages
3. Set build command (e.g., `npm run build`)

### Domain Configuration Options

**Option 1: Apex domain only (dhatrak.com)**
```
CNAME: @ → vinit-dhatrak-portfolio.pages.dev
```

**Option 2: With www redirect**
```
CNAME: @ → vinit-dhatrak-portfolio.pages.dev
CNAME: www → dhatrak.com
```

## 🚦 Testing Your Deployment

1. **Check the live site**
   - Visit `https://dhatrak.com`
   - Test all navigation links
   - Verify responsive design on mobile

2. **Performance testing**
   - Use Google PageSpeed Insights
   - Test with Lighthouse in Chrome DevTools

3. **Cross-browser testing**
   - Test in Chrome, Firefox, Safari, Edge
   - Check mobile browsers

## 🔄 Continuous Deployment

Your site will automatically deploy when you push to the main branch:

```bash
# Make changes to your code
git add .
git commit -m "Update portfolio content"
git push origin main

# Cloudflare Pages will automatically deploy the changes
```

## 📊 Monitoring and Analytics

### Cloudflare Analytics
- Available in your Cloudflare dashboard
- Shows traffic, performance metrics
- Free tier includes basic analytics

### Google Analytics (Optional)
Add to `index.html` before closing `</head>` tag:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🛠️ Troubleshooting

### Common Issues

1. **Site not loading**
   - Check DNS propagation (can take up to 24 hours)
   - Verify CNAME records are correct
   - Check Cloudflare SSL settings

2. **Build failures**
   - Check build logs in Cloudflare Pages
   - Ensure all files are committed to Git
   - Verify file paths are correct

3. **Custom domain issues**
   - Ensure domain is added to Cloudflare
   - Check nameserver configuration
   - Verify DNS records

### Debug Commands

```bash
# Check DNS propagation
nslookup dhatrak.com

# Test HTTPS certificate
curl -I https://dhatrak.com

# Check response headers
curl -I https://dhatrak.com
```

## 📧 Support

If you encounter issues:
1. Check Cloudflare Pages documentation
2. Review deployment logs
3. Contact Cloudflare support (if needed)

## 🎉 Post-Deployment Checklist

- [ ] Site loads at https://dhatrak.com
- [ ] All navigation links work
- [ ] Mobile responsiveness works
- [ ] Dark/light theme toggle works
- [ ] Contact form/links work
- [ ] SEO meta tags are correct
- [ ] Analytics are tracking (if implemented)
- [ ] Performance scores are good
- [ ] All browsers display correctly

---

**Your portfolio is now live at https://dhatrak.com! 🚀**
