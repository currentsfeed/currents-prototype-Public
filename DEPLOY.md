# Deploy Currents Prototype

## Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `currents-prototype`
3. Description: "Currents homepage prototype - editorial prediction markets"
4. Keep it **Public** (so Vercel can access it for free)
5. **Do NOT** initialize with README (we already have code)
6. Click **Create repository**

## Step 2: Connect Local Code to GitHub

GitHub will show you commands. You need this one:

```bash
git remote add origin https://github.com/currentsfeed/currents-prototype.git
git push -u origin main
```

**Or run from the OpenClaw workspace:**

```bash
cd /home/ubuntu/.openclaw/workspace/projects/currents/prototype
git remote add origin https://github.com/currentsfeed/currents-prototype.git
git push -u origin main
```

(You'll need to enter your GitHub username and password/token)

## Step 3: Deploy to Vercel

1. Go to: https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Click **"Import Project"**
5. Find `currents-prototype` in your repo list
6. Click **Import**
7. Keep all default settings
8. Click **Deploy**

**Done!** Vercel will give you a live URL like:
`https://currents-prototype.vercel.app`

---

## Quick Verification

Once deployed, check that:
- ✅ Page loads without errors
- ✅ Hero market displays
- ✅ Market cards show data
- ✅ Colors are muted (no red/green)
- ✅ Mobile responsive (test on phone)

---

## Need Help?

Tell Robo if:
- GitHub push fails (might need personal access token)
- Vercel deployment fails
- Site doesn't look right

The prototype is 100% ready - deployment is just connecting the dots.
