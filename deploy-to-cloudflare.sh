#!/bin/bash
# Deploy FaroAI website to Cloudflare Pages

set -e

echo "🚀 Deploying FaroAI website to Cloudflare Pages..."
echo "=================================================="

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Check if API token is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo ""
    echo "🔑 Please set your Cloudflare API Token:"
    echo "   export CLOUDFLARE_API_TOKEN='your_token_here'"
    echo ""
    echo "To create a token:"
    echo "1. Visit: https://dash.cloudflare.com/profile/api-tokens"
    echo "2. Click 'Create Token'"
    echo "3. Use 'Custom token' template"
    echo "4. Permissions needed:"
    echo "   - Account:Cloudflare Pages:Edit"
    echo "   - Zone:DNS:Edit"
    echo "   - Zone:Zone:Read"
    exit 1
fi

# Deploy to Cloudflare Pages
echo ""
echo "📤 Uploading to Cloudflare Pages..."
wrangler pages deploy . \
    --project-name="faroai" \
    --branch="main" \
    --commit-hash="$(git rev-parse HEAD 2>/dev/null || echo 'manual')" \
    --commit-message="Update website $(date '+%Y-%m-%d %H:%M:%S')"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your website will be available at:"
echo "   - https://faroai.pages.dev"
echo "   - https://www.faroai.net (after DNS configuration)"
