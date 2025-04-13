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

# 10. Create a special JavaScript redirect handler
mkdir -p ./client/public
cat > ./client/public/redirect-to-ads.js << EOF
// This script checks if the page was loaded via a ads.txt URL and serves the content
(function() {
  // Check if the current URL is asking for ads.txt
  if (window.location.pathname.includes('ads.txt')) {
    // Clear any existing content
    document.body.innerHTML = '';
    document.head.innerHTML = '<title>ads.txt - Suono Napoletano</title>';
    
    // Set the content type header if possible
    if (typeof Response !== 'undefined') {
      try {
        const headers = new Headers();
        headers.append('Content-Type', 'text/plain');
        const response = new Response('$ADSENSE_CONTENT', {
          status: 200,
          headers: headers
        });
        // This won't actually work in a browser context, but it's worth a try
        return response;
      } catch (e) {
        console.error('Failed to create response:', e);
      }
    }
    
    // Fallback to directly writing to the document
    document.body.style.fontFamily = 'monospace';
    document.body.style.whiteSpace = 'pre';
    document.body.textContent = '$ADSENSE_CONTENT';
  }
})();
EOF
echo "Created redirect-to-ads.js script in client/public"

# 11. Create a comprehensive ads.html file with script fallback
cat > ./ads.html << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ads.txt Content</title>
    <meta http-equiv="refresh" content="0;url=/ads.txt">
    <style>
        body {
            font-family: monospace;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
        }
        pre {
            background: #f5f5f5;
            padding: 15px;
            border: 1px solid #ddd;
            white-space: pre-wrap;
        }
        h1 {
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
    </style>
</head>
<body>
    <h1>Ads.txt Content for suononapoletano.com</h1>
    <p>Below is the content of our ads.txt file:</p>
    <pre>$ADSENSE_CONTENT</pre>
    
    <p>This page automatically redirects to <a href="/ads.txt">/ads.txt</a>.</p>
    
    <script>
    // Script to handle direct content serving if needed
    if (window.location.href.includes('ads.txt')) {
        document.body.innerHTML = '$ADSENSE_CONTENT';
        document.body.style.fontFamily = 'monospace';
        document.body.style.padding = '20px';
    }
    </script>
</body>
</html>
EOF
echo "Created comprehensive ads.html file with script fallback"

# 12. Copy this file to all possible locations
cp ./ads.html ./public/
cp ./ads.html ./public_html/
cp ./ads.html ./client/public/
echo "Copied ads.html to all possible locations"

# 13. Create a .htaccess file to handle ads.txt requests (though might not be used by Replit)
cat > ./.htaccess << EOF
# Handle ads.txt requests
<Files "ads.txt">
    ForceType text/plain
    Header set Content-Type "text/plain"
</Files>

# Rewrite rule for ads.txt
RewriteEngine On
RewriteCond %{REQUEST_URI} ads\.txt$ [NC]
RewriteRule .* /ads.txt [L]
EOF
echo "Created .htaccess file for handling ads.txt requests"

# Make this script executable after deployment
chmod +x ./fix-ads.sh

echo "ads.txt has been successfully placed in all possible locations"
echo "After deployment, you should be able to access it at https://suononapoletano.com/ads.txt"