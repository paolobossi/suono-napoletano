#!/bin/bash

# Deploy script to ensure ads.txt is properly included in production

# Make sure we're in the project root directory
cd "$(dirname "$0")"

# Create ads.txt content
ADSENSE_CONTENT="google.com, pub-1733624280085328, DIRECT, f08c47fec0942fa0"

# Write ads.txt content to key locations - this ensures the file exists even if it wasn't there before
echo "$ADSENSE_CONTENT" > ./ads.txt
echo "$ADSENSE_CONTENT" > ./public/ads.txt 
echo "$ADSENSE_CONTENT" > ./public/ads.txt.static

# Create special html file for ads.txt that redirects
cat > ./public/ads.html << EOL
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ads.txt</title>
    <meta http-equiv="refresh" content="0;url=/ads.txt">
</head>
<body>
    $ADSENSE_CONTENT
</body>
</html>
EOL

# Make sure ads.txt can be found in all possible locations in the dist directory
mkdir -p ./client/dist/client
echo "$ADSENSE_CONTENT" > ./client/dist/client/ads.txt
cp ./public/ads.html ./client/dist/client/ads.html

# Create a direct file in public_html directory for direct server access 
mkdir -p ./public_html
echo "$ADSENSE_CONTENT" > ./public_html/ads.txt

# Create the exact URL path structure from the screenshot
mkdir -p ./public/suononapoletano.com
echo "$ADSENSE_CONTENT" > ./public/suononapoletano.com/ads.txt

# Also create it in dist client
mkdir -p ./client/dist/client/suononapoletano.com
echo "$ADSENSE_CONTENT" > ./client/dist/client/suononapoletano.com/ads.txt

# Additional locations for ads.txt in static and other directories
# These locations are sometimes used by Replit's deployment system
mkdir -p ./static
echo "$ADSENSE_CONTENT" > ./static/ads.txt

# Also create the file in a staging directory where Replit might look
mkdir -p ./.replit/static
echo "$ADSENSE_CONTENT" > ./.replit/static/ads.txt

# Create a .well-known directory for standard file locations
mkdir -p ./.well-known
echo "$ADSENSE_CONTENT" > ./.well-known/ads.txt

# Create special replit-specific folders that might be used during deployment
mkdir -p ./.replit/public
echo "$ADSENSE_CONTENT" > ./.replit/public/ads.txt

# Add to nginx configuration locations if possible
if [ -d "/etc/nginx/conf.d" ]; then
  sudo mkdir -p /etc/nginx/html
  echo "$ADSENSE_CONTENT" | sudo tee /etc/nginx/html/ads.txt
fi

# Display success message
echo "ads.txt has been written to all necessary locations for deployment"

# IMPORTANT: For Replit deployments, test ALL of these URLs:
echo ""
echo "After deployment, please test ALL of these URLs:"
echo "1. curl -L https://suononapoletano.com/ads.txt"
echo "2. curl -L https://suononapoletano.com/ads.html" 
echo "3. curl -L https://suononapoletano.com/public/ads.txt"
echo "4. curl -L https://suononapoletano.com/suononapoletano.com/ads.txt"
echo "5. curl -L https://suononapoletano.com/static/ads.txt"
echo "6. curl -L https://suononapoletano.com/.well-known/ads.txt"
echo ""
echo "At least one of these should work. If none do, you need to contact Replit support."