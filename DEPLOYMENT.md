# Metro BuildIn - Google Cloud Run Deployment Guide

Complete guide for deploying Metro BuildIn to Google Cloud Run.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed ([Install Guide](https://cloud.google.com/sdk/docs/install))
3. **Docker** installed ([Install Guide](https://docs.docker.com/get-docker/))
4. **GCP Project** created

## 🚀 Quick Deploy (Automated)

### Option 1: Using the Deploy Script (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Set your project ID (optional, script will prompt if not set)
export GCP_PROJECT_ID="your-project-id"

# Run the deployment
./deploy.sh
```

The script will:
- ✅ Validate prerequisites
- ✅ Enable required GCP APIs
- ✅ Build the Docker image
- ✅ Push to Container Registry
- ✅ Deploy to Cloud Run
- ✅ Provide the live URL

### Option 2: Manual Deployment

#### Step 1: Authenticate with GCP

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

#### Step 2: Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### Step 3: Build and Push Docker Image

```bash
# Build the image
docker build -t gcr.io/YOUR_PROJECT_ID/metro-buildin:latest .

# Configure Docker to use gcloud as credential helper
gcloud auth configure-docker

# Push to Container Registry
docker push gcr.io/YOUR_PROJECT_ID/metro-buildin:latest
```

#### Step 4: Deploy to Cloud Run

```bash
gcloud run deploy metro-buildin \
  --image gcr.io/YOUR_PROJECT_ID/metro-buildin:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --port 8080
```

## 🔄 Continuous Deployment with Cloud Build

### Setup Automatic Deployments

1. **Connect your Git repository** to Cloud Build:
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

2. **Create a build trigger** in the console:
   - Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
   - Click "Create Trigger"
   - Connect your repository
   - Select `cloudbuild.yaml`
   - Save

Now every push to your main branch will automatically deploy!

## 🔧 Configuration Options

### Environment Variables

Add environment variables during deployment:

```bash
gcloud run deploy metro-buildin \
  --set-env-vars "NODE_ENV=production,API_URL=https://api.example.com"
```

### Custom Domain

Map a custom domain to your service:

```bash
gcloud run domain-mappings create \
  --service metro-buildin \
  --domain www.your-domain.com \
  --region us-central1
```

### Scaling Configuration

Adjust autoscaling:

```bash
gcloud run services update metro-buildin \
  --min-instances 1 \
  --max-instances 20 \
  --concurrency 80 \
  --region us-central1
```

### Resource Limits

Update CPU and memory:

```bash
gcloud run services update metro-buildin \
  --memory 1Gi \
  --cpu 2 \
  --region us-central1
```

## 📊 Monitoring & Logging

### View Logs

```bash
# Stream logs in real-time
gcloud run services logs tail metro-buildin --region us-central1

# View recent logs
gcloud run services logs read metro-buildin --limit 100 --region us-central1
```

### View Metrics

Access metrics dashboard:
```
https://console.cloud.google.com/run
```

### Set Up Alerts

Create uptime checks and alerts in Cloud Monitoring for:
- Response time
- Error rates
- CPU usage
- Memory usage

## 💰 Cost Optimization

Cloud Run pricing is based on:
- **CPU**: Charged per vCPU-second
- **Memory**: Charged per GB-second
- **Requests**: First 2 million requests/month free

### Optimization Tips:

1. **Use minimum instances = 0** for cost savings (cold starts acceptable)
2. **Set appropriate memory limits** (512Mi is sufficient for this app)
3. **Enable CPU boost** for faster cold starts
4. **Use CDN** for static assets

Estimated cost for low-medium traffic: **$5-20/month**

## 🔒 Security Best Practices

### 1. Enable IAM Authentication (if needed)

```bash
gcloud run services add-iam-policy-binding metro-buildin \
  --member="user:email@example.com" \
  --role="roles/run.invoker" \
  --region us-central1
```

### 2. Configure CORS (if needed)

Add to your `vite.config.js`:
```javascript
export default {
  server: {
    cors: true
  }
}
```

### 3. Add Security Headers

The service automatically includes:
- HTTPS enforcement
- Security headers via Cloud Run

## 🧪 Testing Deployment

### Local Testing with Docker

```bash
# Build locally
docker build -t metro-buildin-local .

# Run locally
docker run -p 8080:8080 metro-buildin-local

# Open browser
open http://localhost:8080
```

### Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils  # Linux
brew install httpd  # macOS

# Run load test
ab -n 1000 -c 10 https://your-service-url.run.app/
```

## 🐛 Troubleshooting

### Issue: Build Fails

**Solution:**
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t gcr.io/PROJECT_ID/metro-buildin .
```

### Issue: Service Won't Start

**Check logs:**
```bash
gcloud run services logs read metro-buildin --region us-central1
```

**Common fixes:**
- Ensure PORT 8080 is exposed
- Check that `serve` is installed in production dependencies
- Verify build artifacts exist in `dist/`

### Issue: 502 Bad Gateway

**Causes:**
- Service taking too long to start
- Listening on wrong port

**Fix:**
```bash
# Increase timeout
gcloud run services update metro-buildin --timeout 300
```

### Issue: Out of Memory

**Solution:**
```bash
# Increase memory
gcloud run services update metro-buildin --memory 1Gi
```

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Container Registry Guide](https://cloud.google.com/container-registry/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Pricing Calculator](https://cloud.google.com/products/calculator)

## 🆘 Support

For issues:
1. Check logs: `gcloud run services logs read metro-buildin`
2. Review Cloud Run metrics in console
3. Verify Docker image builds locally
4. Check GCP quotas and billing

## 🎯 Quick Commands Reference

```bash
# Deploy
./deploy.sh

# View logs
gcloud run services logs tail metro-buildin --region us-central1

# Update service
gcloud run deploy metro-buildin --image gcr.io/PROJECT_ID/metro-buildin:latest

# Delete service
gcloud run services delete metro-buildin --region us-central1

# List services
gcloud run services list

# Describe service
gcloud run services describe metro-buildin --region us-central1
```

---

**Your Metro BuildIn app is now production-ready! 🚀**
