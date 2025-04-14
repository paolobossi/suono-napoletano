#!/bin/bash

# Deploy script for Suono Napoletano app

# Make sure we're in the project root directory
cd "$(dirname "$0")"

# Create necessary directories
mkdir -p ./public
mkdir -p ./public/assets
mkdir -p ./client/dist/client
mkdir -p ./client/dist/client/assets
mkdir -p ./static
mkdir -p ./static/assets

# Copy favicon and preview.png to all necessary locations
cp ./client/public/favicon.png ./public/favicon.png
cp ./client/public/favicon.png ./client/dist/client/favicon.png
cp ./client/public/favicon.png ./static/favicon.png

# Copy iOS home screen icon to all necessary locations
cp ./client/public/apple-touch-icon.png ./public/apple-touch-icon.png
cp ./client/public/apple-touch-icon.png ./client/dist/client/apple-touch-icon.png
cp ./client/public/apple-touch-icon.png ./static/apple-touch-icon.png

# Copy preview images to all necessary locations
cp ./client/public/preview-v2.png ./public/preview-v2.png
cp ./client/public/preview-v2.png ./client/dist/client/preview-v2.png
cp ./client/public/preview-v2.png ./static/preview-v2.png

# For backward compatibility, also maintain preview.png
cp ./client/public/preview-v2.png ./public/preview.png
cp ./client/public/preview-v2.png ./client/dist/client/preview.png
cp ./client/public/preview-v2.png ./static/preview.png

# Copy preview files to assets directories for backward compatibility
cp ./client/public/preview-v2.png ./public/assets/preview-v2.png
cp ./client/public/preview-v2.png ./client/dist/client/assets/preview-v2.png
cp ./client/public/preview-v2.png ./static/assets/preview-v2.png
cp ./client/public/preview-v2.png ./public/assets/preview.png
cp ./client/public/preview-v2.png ./client/dist/client/assets/preview.png
cp ./client/public/preview-v2.png ./static/assets/preview.png

echo "Deployed assets successfully!"
echo "- Favicon copied to all locations"
echo "- iOS home screen icon copied to all locations"
echo "- Preview images copied to all locations"