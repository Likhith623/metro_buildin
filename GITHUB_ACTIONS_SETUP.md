# GitHub Actions Deployment Setup

## 🔐 Setting Up GitHub Secrets

### Step 1: Add GCP Credentials to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GCP_CREDENTIALS`
5. Value: Paste the entire JSON content of your service account key
6. Click **Add secret**

### Step 2: Required Secrets

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `GCP_CREDENTIALS` | Service account key JSON | ✅ Yes |

## 🚀 How It Works

### Automatic Deployment
- **Trigger**: Pushes to `main` branch
- **Process**:
  1. ✅ Checkout code
  2. ✅ Install Node.js dependencies
  3. ✅ Build React application
  4. ✅ Authenticate with GCP
  5. ✅ Build Docker image
  6. ✅ Push to Google Container Registry
  7. ✅ Deploy to Cloud Run
  8. ✅ Verify deployment
  9. ✅ Cleanup old images

### Manual Deployment
You can also trigger deployment manually:
1. Go to **Actions** tab in GitHub
2. Select **Deploy to Google Cloud Run** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## 📋 Configuration

### Environment Variables (in deploy.yml)
```yaml
PROJECT_ID: nirbhay-488421
SERVICE_NAME: metro-buildin
REGION: us-central1
```

### Cloud Run Configuration
- **Memory**: 512Mi
- **CPU**: 1
- **Min Instances**: 0 (scales to zero)
- **Max Instances**: 10
- **Timeout**: 300 seconds
- **Port**: 8080
- **Access**: Public (unauthenticated)

## 🔍 Monitoring Deployments

### View Workflow Runs
1. Go to **Actions** tab in your GitHub repository
2. Click on any workflow run to see details
3. Each step shows logs and status

### View Deployment URL
After successful deployment, the workflow will output:
```
🚀 Application deployed successfully!
📍 URL: https://metro-buildin-xxxxxxxxxx-uc.a.run.app
```

## 🛠️ Customization

### Change Deployment Region
Edit `.github/workflows/deploy.yml`:
```yaml
REGION: us-central1  # Change to: europe-west1, asia-east1, etc.
```

### Adjust Resources
Modify the `--memory` and `--cpu` flags:
```yaml
--memory=512Mi  # Options: 128Mi, 256Mi, 512Mi, 1Gi, 2Gi, 4Gi
--cpu=1         # Options: 1, 2, 4
```

### Add Environment Variables
Add to the deploy step:
```yaml
--set-env-vars=NODE_ENV=production,API_KEY=xxx
```

## 🔒 Security Best Practices

### ✅ DO
- Store service account keys in GitHub Secrets
- Use least-privilege IAM roles
- Enable deployment verification
- Regularly rotate service account keys
- Use Cloud Run IAM for API authentication if needed

### ❌ DON'T
- Commit service account keys to repository
- Share credentials in plain text
- Use overly permissive IAM roles
- Expose sensitive environment variables in logs

## 🐛 Troubleshooting

### Authentication Failures
```bash
# Verify service account has correct roles:
gcloud projects get-iam-policy nirbhay-488421 \
  --flatten="bindings[].members" \
  --filter="bindings.members:metro-buildin@nirbhay-488421.iam.gserviceaccount.com"
```

Required roles:
- `roles/run.admin`
- `roles/storage.admin`
- `roles/iam.serviceAccountUser`

### Build Failures
Check the workflow logs in GitHub Actions for:
- Node.js version compatibility
- Missing dependencies
- Build script errors

### Deployment Failures
- Verify Cloud Run API is enabled
- Check service account permissions
- Review Cloud Run quotas

## 📊 Workflow Status Badge

Add to your README.md:
```markdown
[![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml)
```

## 🔄 Rollback

To rollback to a previous version:
```bash
# List revisions
gcloud run revisions list --service=metro-buildin --region=us-central1

# Rollback to specific revision
gcloud run services update-traffic metro-buildin \
  --to-revisions=metro-buildin-00001-xxx=100 \
  --region=us-central1
```

## 📈 Next Steps

1. ✅ Add `GCP_CREDENTIALS` secret to GitHub
2. ✅ Push code to `main` branch
3. ✅ Watch deployment in Actions tab
4. ✅ Visit your live application URL
5. ✅ Set up custom domain (optional)
6. ✅ Configure Cloud CDN (optional)
7. ✅ Set up monitoring alerts (optional)
