#!/bin/bash

# setup-github-secret.sh
# Helper script to set up GitHub Actions secret for GCP deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     GitHub Actions GCP Deployment Setup                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
    echo -e "${YELLOW}Install it with: brew install gh${NC}"
    echo -e "${YELLOW}Or visit: https://cli.github.com/${NC}"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not authenticated with GitHub CLI${NC}"
    echo -e "${YELLOW}Run: gh auth login${NC}"
    exit 1
fi

echo -e "${GREEN}✓ GitHub CLI is installed and authenticated${NC}"
echo ""

# Get repository info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")

if [ -z "$REPO" ]; then
    echo -e "${RED}❌ Not in a GitHub repository${NC}"
    echo -e "${YELLOW}Please run this script from your repository directory${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Repository: ${GREEN}$REPO${NC}"
echo ""

# Check if credentials file exists
CREDS_FILE="gcp-credentials.json"

if [ ! -f "$CREDS_FILE" ]; then
    echo -e "${YELLOW}⚠️  Credentials file not found: $CREDS_FILE${NC}"
    echo ""
    echo -e "${BLUE}Please create the file with your GCP service account key:${NC}"
    echo -e "  cat > $CREDS_FILE << 'EOF'"
    echo -e "  {your-service-account-json-content}"
    echo -e "  EOF"
    echo ""
    echo -e "${YELLOW}Or specify a different file path:${NC}"
    read -p "Enter credentials file path (or press Enter to exit): " CREDS_FILE

    if [ -z "$CREDS_FILE" ] || [ ! -f "$CREDS_FILE" ]; then
        echo -e "${RED}❌ File not found. Exiting.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Found credentials file: $CREDS_FILE${NC}"
echo ""

# Validate JSON
if ! jq empty "$CREDS_FILE" 2>/dev/null; then
    echo -e "${RED}❌ Invalid JSON in credentials file${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Credentials file is valid JSON${NC}"
echo ""

# Extract project info for confirmation
PROJECT_ID=$(jq -r '.project_id' "$CREDS_FILE")
CLIENT_EMAIL=$(jq -r '.client_email' "$CREDS_FILE")

echo -e "${BLUE}📋 Credentials Info:${NC}"
echo -e "   Project ID: ${GREEN}$PROJECT_ID${NC}"
echo -e "   Service Account: ${GREEN}$CLIENT_EMAIL${NC}"
echo ""

# Confirm before proceeding
read -p "$(echo -e ${YELLOW}Do you want to add this as a GitHub secret? [y/N]: ${NC})" -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Cancelled by user${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🔐 Adding secret to GitHub repository...${NC}"

# Add secret to GitHub
CREDS_CONTENT=$(cat "$CREDS_FILE")

if gh secret set GCP_CREDENTIALS --body "$CREDS_CONTENT"; then
    echo ""
    echo -e "${GREEN}✅ Secret 'GCP_CREDENTIALS' added successfully!${NC}"
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                    Setup Complete! ✨                      ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Next steps:${NC}"
    echo -e "  1. Push your code to the main branch"
    echo -e "  2. GitHub Actions will automatically deploy to Cloud Run"
    echo -e "  3. Check the Actions tab to see the deployment progress"
    echo ""
    echo -e "${YELLOW}💡 Tip: You can view all secrets with:${NC}"
    echo -e "   gh secret list"
    echo ""
    echo -e "${YELLOW}🔗 Repository URL:${NC}"
    echo -e "   https://github.com/$REPO"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Failed to add secret${NC}"
    echo -e "${YELLOW}Try adding it manually:${NC}"
    echo -e "  1. Go to: https://github.com/$REPO/settings/secrets/actions"
    echo -e "  2. Click 'New repository secret'"
    echo -e "  3. Name: GCP_CREDENTIALS"
    echo -e "  4. Value: (paste the contents of $CREDS_FILE)"
    exit 1
fi
