#!/bin/bash
# Auto-pull script for faroai deployment
# Uses credential helper to store GitHub credentials

set -e

echo "🚀 FaroAI Deployment Script"
echo ""

# Configure git
git config user.email "clawclaw@clawdeMac-mini.local"
git config user.name "OpenClaw Deploy"

# Set credential helper for passwordless pushes
git config --global credential.helper store

# Add remote (already configured)
git remote -v | grep origin

echo ""
echo "📋 Deployment ready!"
echo ""
echo "Please push with the first-time credential prompt:"
echo "  git push -u origin main"
echo ""
echo "After first push, credentials will be cached."
echo ""

# Show current status
echo "📊 Repository status:"
git log --oneline -3
git status --short
