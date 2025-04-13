#!/bin/bash

# Script to fix ads.txt 404 error
# This script will create the ads.txt file in all possible locations

# Define the content
ADSENSE_CONTENT="google.com, pub-1733624280085328, DIRECT, f08c47fec0942fa0"

# 1. Create ads.txt in project root (most important)
echo "$ADSENSE_CONTENT" > ./ads.txt
echo "Created ads.txt in project root"

# 2. Create ads.txt in the public directory
mkdir -p ./public
echo "$ADSENSE_CONTENT" > ./public/ads.txt
echo "Created ads.txt in public directory"

# 3. Create ads.txt in the public_html directory
mkdir -p ./public_html
echo "$ADSENSE_CONTENT" > ./public_html/ads.txt
echo "Created ads.txt in public_html directory"

# 4. Create ads.txt in the client directory
mkdir -p ./client/
echo "$ADSENSE_CONTENT" > ./client/ads.txt
echo "Created ads.txt in client directory"

# 5. Create ads.txt in the client/dist directory
mkdir -p ./client/dist
echo "$ADSENSE_CONTENT" > ./client/dist/ads.txt
echo "Created ads.txt in client/dist directory"

# 6. Create ads.txt in the exact suononapoletano.com path
mkdir -p ./public/suononapoletano.com
echo "$ADSENSE_CONTENT" > ./public/suononapoletano.com/ads.txt
echo "Created ads.txt in public/suononapoletano.com directory"

# 7. Create ads.txt in the client/public directory
mkdir -p ./client/public
echo "$ADSENSE_CONTENT" > ./client/public/ads.txt
echo "Created ads.txt in client/public directory"

# 8. Create ads.txt in client/dist/client directory (where Vite outputs files)
mkdir -p ./client/dist/client
echo "$ADSENSE_CONTENT" > ./client/dist/client/ads.txt
echo "Created ads.txt in client/dist/client directory"

# 9. Create index.html file in public_html with a link to ads.txt
cat > ./public_html/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ads.txt Information</title>
</head>
<body>
    <h1>Ads.txt Information</h1>
    <p>Our ads.txt file is available at: <a href="/ads.txt">/ads.txt</a></p>
    <pre>$ADSENSE_CONTENT</pre>
</body>
</html>
EOF
echo "Created index.html in public_html with ads.txt information"

# Make this script executable after deployment
chmod +x ./fix-ads.sh

echo "ads.txt has been successfully placed in all possible locations"
echo "After deployment, you should be able to access it at https://suononapoletano.com/ads.txt"