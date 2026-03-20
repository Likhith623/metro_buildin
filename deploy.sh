#!/bin/bash

# Metro BuildIn - Google Cloud Run Deployment Script
# Make this file executable: chmod +x deploy.sh

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Metro BuildIn - Cloud Run Deployment    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-}"
SERVICE_NAME="metro-buildin"
REGION="${GCP_REGION:-us-central1}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI is not installed${NC}"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Error: Docker is not installed${NC}"
    echo "Install from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Get project ID if not set
if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}📋 Please enter your GCP Project ID:${NC}"
    read -r PROJECT_ID

    if [ -z "$PROJECT_ID" ]; then
        echo -e "${RED}❌ Error: Project ID is required${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}🔧 Configuration:${NC}"
echo "  Project ID: $PROJECT_ID"
echo "  Service Name: $SERVICE_NAME"
echo "  Region: $REGION"
echo "  Image: $IMAGE_NAME"
echo ""

# Set the project
echo -e "${YELLOW}⚙️  Setting GCP project...${NC}"
gcloud config set project "$PROJECT_ID"

# Enable required APIs
echo -e "${YELLOW}🔌 Enabling required APIs...${NC}"
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com

# Build the Docker image
echo ""
echo -e "${YELLOW}🏗️  Building Docker image...${NC}"
docker build -t "$IMAGE_NAME:latest" .

# Push to Container Registry
echo ""
echo -e "${YELLOW}📤 Pushing image to Container Registry...${NC}"
docker push "$IMAGE_NAME:latest"

# Deploy to Cloud Run
echo ""
echo -e "${YELLOW}🚀 Deploying to Cloud Run...${NC}"
gcloud run deploy "$SERVICE_NAME" \
    --image "$IMAGE_NAME:latest" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10 \
    --min-instances 0 \
    --port 8080 \
    --timeout 300 \
    --concurrency 80 \
    --cpu-boost \
    --execution-environment gen2

# Get the service URL
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --platform managed \
    --region "$REGION" \
    --format 'value(status.url)')

echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            Deployment Successful!          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}🌐 Your app is live at:${NC}"
echo -e "${GREEN}${SERVICE_URL}${NC}"
echo ""
echo -e "${YELLOW}📊 To view logs:${NC}"
echo "gcloud run services logs tail $SERVICE_NAME --region $REGION"
echo ""
echo -e "${YELLOW}📈 To view metrics:${NC}"
echo "https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME/metrics?project=$PROJECT_ID"
echo ""
