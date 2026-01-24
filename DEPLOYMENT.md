# 🚀 Deployment Guide

This document outlines how to deploy updates to the Neon Crosses game hosted at **https://username.github.io/neon_crosses/**

## Quick Deploy (TL;DR)

```bash
npm run deploy
```

Your changes will be live at https://username.github.io/neon_crosses/ within 2-3 minutes.

---

## Complete Development & Deployment Workflow

### 1. **Local Development**

```bash
# Start development server
npm run dev
# Visit http://localhost:5173 to test changes
```

### 2. **Test Production Build**

```bash
# Build for production (catches TypeScript errors)
npm run build

# Preview production build locally
npm run preview
# Visit http://localhost:4173 to test production build
```

### 3. **Deploy to Production**

```bash
# Deploy to GitHub Pages (builds automatically)
npm run deploy
```

**What happens:**
- Runs `npm run build` automatically (predeploy script)
- Pushes built files to `gh-pages` branch
- GitHub Pages serves the site at https://username.github.io/neon_crosses/
- Changes are live within 2-3 minutes

---

## Git Version Control (Optional)

For tracking changes in your repository:

```bash
# Stage changes
git add -A

# Commit with descriptive message
git commit -m "feat: add new game feature"

# Push to repository
git push

# Deploy to production
npm run deploy
```

---

## Branch Management

### Current Setup
- **Working branch**: `github-pages-setup` (configured for GitHub Pages subdirectory)
- **Production branch**: `gh-pages` (auto-managed by deployment)

### Deploying from Any Branch
```bash
# You can deploy from any branch
git checkout main
npm run deploy  # ✅ Works

git checkout custom-domain-setup
npm run deploy  # ✅ Works

git checkout feature-branch
npm run deploy  # ✅ Works
```

---

## Troubleshooting

### Build Errors
```bash
# Check for TypeScript errors
npm run build

# Check for linting issues
npm run lint

# Run tests
npm run test
```

### Deployment Issues
```bash
# Clear dist folder and rebuild
rm -rf dist
npm run build
npm run deploy
```

### Domain Issues
- **GitHub Pages URL**: https://username.github.io/neon_crosses/
- **HTTPS**: Automatically enabled for github.io domains
- **No custom domain required**: Works out of the box

---

## Configuration Files

### Key Files for Deployment
- **`vite.config.ts`**: `base: '/neon_crosses/'` for GitHub Pages subdirectory
- **`package.json`**: Deploy scripts configured
- **GitHub Pages Settings**: Source = `gh-pages` branch

### GitHub Pages Setup
1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Save

---

## Project Structure

```
dist/                    # Built files (auto-generated)
src/
  ├── components/        # React components
  ├── hooks/            # Custom hooks
  ├── logic/            # Game logic
  └── test/             # Test utilities
package.json            # Scripts and dependencies
vite.config.ts          # Build configuration
```

---

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run test` | Run unit tests |
| `npm run lint` | Check code quality |

---

## Live Site

**Production URL**: https://username.github.io/neon_crosses/  
**Repository**: https://github.com/username/neon_crosses  
**Hosting**: GitHub Pages (subdirectory deployment)

---

*Last updated: January 23, 2026*