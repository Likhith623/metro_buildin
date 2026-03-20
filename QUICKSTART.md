# 🚀 Quick Start: Deploy to Google Cloud Run with GitHub Actions

This guide will get your Metro BuildIn app deployed automatically using GitHub Actions.

## 📋 Prerequisites

- [x] Google Cloud Project (ID: `nirbhay-488421`)
- [x] Service Account Key (provided as `GCP_CREDENTIALS`)
- [ ] GitHub repository
- [ ] GitHub CLI installed (optional, for easier setup)

## 🎯 Two Deployment Methods

### Method 1: Automated with GitHub Actions (Recommended)

Every push to `main` branch automatically deploys to Cloud Run.

### Method 2: Manual with Docker + GCP CLI

Use `deploy.sh` script for one-command deployment.

---

## 🔧 Method 1: GitHub Actions Setup (Automated)

### Step 1: Save GCP Credentials Locally

Create a file `gcp-credentials.json` in your project root:

```bash
cat > gcp-credentials.json << 'EOF'
{
  "type": "service_account",
  "project_id": "nirbhay-488421",
  "private_key_id": "806ce6cef5d9a91b7699195b3b3399a1618e036e",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "metro-buildin@nirbhay-488421.iam.gserviceaccount.com",
  ...
}
EOF
```

**⚠️ Important:** This file is automatically ignored by Git (in `.gitignore`)

### Step 2: Add Secret to GitHub

#### Option A: Using the Helper Script (Easy!)

```bash
# Install GitHub CLI if needed
brew install gh

# Login to GitHub
gh auth login

# Run the setup script
./setup-github-secret.sh
```

The script will:
- ✅ Validate your credentials file
- ✅ Upload to GitHub as a secret
- ✅ Confirm successful setup

#### Option B: Manual Setup via GitHub UI

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Set name: `GCP_CREDENTIALS`
5. Paste the entire JSON content as value
6. Click **Add secret**

### Step 3: Push to GitHub

```bash
# Initialize git if needed
git init
git add .
git commit -m "Add GitHub Actions deployment"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/metro-buildin.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 4: Watch the Magic! ✨

1. Go to **Actions** tab in your GitHub repository
2. You'll see "Deploy to Google Cloud Run" workflow running
3. Wait 3-5 minutes for deployment to complete
4. Get your live URL from the workflow output!

---

## 🛠️ Method 2: Manual Deployment (Docker Required)

### Step 1: Start Docker Desktop

```bash
# Check if Docker is running
docker ps
```

If not running, open **Docker Desktop** application.

### Step 2: Deploy

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

This will:
1. Build Docker image
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Output your live application URL

---

## 📊 Verify Deployment

### Check Deployment Status

```bash
# List Cloud Run services
gcloud run services list --project=nirbhay-488421

# Get service details
gcloud run services describe metro-buildin \
  --region=us-central1 \
  --project=nirbhay-488421
```

### Test Your Application

```bash
# Get the URL
URL=$(gcloud run services describe metro-buildin \
  --region=us-central1 \
  --project=nirbhay-488421 \
  --format='value(status.url)')

echo "Your app is live at: $URL"

# Test it
curl -I "$URL"
```

---

## 🔄 Deployment Workflow

### GitHub Actions (Automatic)

```
Push to main → GitHub Actions → Build → Push to GCR → Deploy to Cloud Run → Live! 🎉
```

### Manual (Docker)

```
Run deploy.sh → Build locally → Push to GCR → Deploy to Cloud Run → Live! 🎉
```

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | GitHub Actions workflow |
| `Dockerfile` | Multi-stage Docker build |
| `deploy.sh` | Manual deployment script |
| `setup-github-secret.sh` | Helper to add GitHub secret |
| `GITHUB_ACTIONS_SETUP.md` | Detailed GitHub Actions guide |
| `.gitignore` | Protects sensitive files |
| `.dockerignore` | Optimizes Docker builds |
| `.gcloudignore` | Optimizes Cloud Build |

---

## 🐛 Troubleshooting

### "Docker daemon not running"
**Solution:** Start Docker Desktop application

### "Permission denied" on scripts
**Solution:**
```bash
chmod +x deploy.sh setup-github-secret.sh
```

### "Failed to authenticate"
**Solution:** Verify service account has these roles:
- `roles/run.admin`
- `roles/storage.admin`
- `roles/iam.serviceAccountUser`

```bash
# Grant roles if needed
gcloud projects add-iam-policy-binding nirbhay-488421 \
  --member="serviceAccount:metro-buildin@nirbhay-488421.iam.gserviceaccount.com" \
  --role="roles/run.admin"
```

### "GitHub secret not found"
**Solution:** Re-run `./setup-github-secret.sh` or add manually via GitHub UI

### Deployment succeeds but app doesn't work
**Solution:** Check Cloud Run logs:
```bash
gcloud run services logs read metro-buildin \
  --region=us-central1 \
  --project=nirbhay-488421 \
  --limit=50
```

---

## 🎨 Customization

### Change Deployment Region

Edit `.github/workflows/deploy.yml`:
```yaml
REGION: us-central1  # Change to your preferred region
```

Or in `deploy.sh`:
```bash
REGION="us-central1"  # Change here
```

### Adjust Resources

In `.github/workflows/deploy.yml`:
```yaml
--memory=512Mi    # Options: 128Mi, 256Mi, 512Mi, 1Gi, 2Gi
--cpu=1           # Options: 1, 2, 4
--max-instances=10  # Scale up to 10 instances
```

### Add Environment Variables

```yaml
--set-env-vars=NODE_ENV=production,API_KEY=your-key
```

---

## 🔐 Security Checklist

- [x] Service account key in `.gitignore`
- [x] Credentials stored as GitHub secret (not in code)
- [ ] Regular key rotation (recommended every 90 days)
- [ ] Least-privilege IAM roles assigned
- [ ] Cloud Run configured with proper access controls

---

## 📈 Next Steps After Deployment

1. **Custom Domain**
   ```bash
   gcloud run domain-mappings create \
     --service=metro-buildin \
     --domain=yourdomain.com \
     --region=us-central1
   ```

2. **HTTPS Certificate** (automatically provisioned)

3. **Cloud CDN** for global performance

4. **Cloud Monitoring** for alerts and metrics

5. **CI/CD Enhancements**
   - Add automated tests
   - Staging environment
   - Blue-green deployments

---

## 📞 Support

- **GitHub Actions Logs:** Actions tab in your repository
- **Cloud Run Logs:** [Google Cloud Console](https://console.cloud.google.com/run)
- **Documentation:** See `GITHUB_ACTIONS_SETUP.md` for detailed info

---

## ✅ Quick Command Reference

```bash
# Check Docker status
docker ps

# Manual deployment
./deploy.sh

# Setup GitHub secret
./setup-github-secret.sh

# View Cloud Run services
gcloud run services list --project=nirbhay-488421

# View logs
gcloud run services logs read metro-buildin --follow --project=nirbhay-488421

# Update service
gcloud run services update metro-buildin --region=us-central1 --memory=1Gi

# Roll back to previous version
gcloud run services update-traffic metro-buildin --to-revisions=PREVIOUS=100
```

---

**Ready to deploy? Pick your method and let's go! 🚀**
