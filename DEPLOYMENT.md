# Deployment Guide for AI Algorithms from Scratch

This guide will help you deploy your educational website to Cloudflare Pages and connect it to your custom domain `dhatrak.com`.

## 🚀 Quick Deployment Steps

### Step 1: Prepare Your Repository
Ensure all your new files (`index.html`, `about.html`, `lessons/`, etc.) are committed to your Git repository.
```bash
git add .
git commit -m "Restructure site for AI course"
git push origin main
```

### Step 2: Deploy to Cloudflare Pages
The process remains largely the same as before. If you have an existing project, Cloudflare will automatically redeploy on your push to `main`. If starting fresh:
1.  **Login to Cloudflare** and go to **Pages**.
2.  **Create a new project** and connect it to your GitHub repository.
3.  **Configure build settings**:
    -   **Project name**: `ai-algorithms-from-scratch` (or similar)
    -   **Production branch**: `main`
    -   **Build command**: (leave empty)
    -   **Build output directory**: `/`
4.  **Deploy**.

### Step 3: Configure Custom Domain
This process should not have changed if you already have `dhatrak.com` configured in Cloudflare. Ensure your DNS `CNAME` record for `dhatrak.com` points to your new Cloudflare Pages project URL (e.g., `ai-algorithms-from-scratch.pages.dev`).

### Step 4: Security
The `_redirects` file handles security headers, so no changes are needed here. Ensure SSL/TLS is set to "Full (strict)".

## 🚦 Testing Your Deployment

1.  **Check the live site** at `https://dhatrak.com`.
2.  **Test navigation**:
    -   Does the "Learn" link go to the main lessons page?
    -   Does the "About Me" link go to your portfolio page?
    -   Do the sidebar links correctly load each lesson?
3.  **Verify content**: Check that all 10 lessons load correctly.
4.  **Test functionality**: Ensure the theme toggle and "copy code" buttons work as expected.

## 🔄 Continuous Deployment
Your site will automatically deploy any new changes when you push to the `main` branch.
```bash
# Make changes
git add .
git commit -m "Update lesson 3 with new examples"
git push origin main
```

## 🎉 Post-Deployment Checklist

- [ ] Site loads at `https://dhatrak.com`.
- [ ] Navigation between `index.html` and `about.html` works.
- [ ] All 10 lessons load dynamically from the sidebar.
- [ ] Mobile responsiveness is correct for both pages.
- [ ] Theme toggle and copy code buttons are functional.
- [ ] `sitemap.xml` is updated and accessible.

---

**Your educational platform is now live! 🚀**
