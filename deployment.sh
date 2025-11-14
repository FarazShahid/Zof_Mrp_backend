#!/bin/bash

# Usage: ./deployment.sh <branch-name>
# Example: ./deployment.sh main

# Exit immediately if a command exits with a non-zero status
set -e

# Set branch from first parameter
BRANCH="$1"

if [ -z "$BRANCH" ]; then
  echo "Error: No branch name provided."
  echo "Usage: $0 <branch-name>"
  exit 1
fi

echo "Starting deployment for branch: $BRANCH"
echo "Node.js version: $(node -v)"

# Checkout the lock file
echo "Checking out package lock files"
git checkout package-lock.json || { echo " git checkout failed"; exit 1; }
git checkout package.json || { echo " git checkout failed"; exit 1; }

# Checkout the branch
echo "Checking out branch: $BRANCH"
git checkout "$BRANCH" || { echo " git checkout failed"; exit 1; }

# Pull latest changes
echo "Running git pull..."
git pull origin "$BRANCH" || { echo " git pull failed"; exit 1; }

# Run installation
echo "Running installation..."
npm install || { echo "npm install failed"; exit 1; }

# Run migrationss
echo "Running migrations..."
npm run migration:run || { echo "npm run migrate failed"; exit 1; }

# Restart using PM2
echo "Restarting app with PM2..."
pm2 restart qa-mrp-backend || { echo "PM2 restart failed"; exit 1; }

echo "Deployment completed successfully!"
