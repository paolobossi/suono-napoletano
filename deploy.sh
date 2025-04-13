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

# Create a .well-known directory for standard file locations
mkdir -p ./.well-known
echo "$ADSENSE_CONTENT" > ./.well-known/ads.txt

# Add to nginx configuration locations if possible
if [ -d "/etc/nginx/conf.d" ]; then
  sudo mkdir -p /etc/nginx/html
  echo "$ADSENSE_CONTENT" | sudo tee /etc/nginx/html/ads.txt
fi

# Copy favicon to all necessary locations
cp ./client/public/favicon.png ./public/favicon.png
cp ./client/public/favicon.png ./client/dist/client/favicon.png
cp ./client/public/favicon.png ./static/favicon.png
echo "Copied favicon to all necessary locations"

# Client-side JavaScript approach - create a redirect handler
mkdir -p ./client/public
cat > ./client/public/redirect-to-ads.js << EOL
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
EOL
echo "Created client-side redirect handler for ads.txt requests"

# Create a more comprehensive ads.html file with fallback mechanisms
cat > ./ads.html << EOL
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
EOL

# Copy this file to all possible locations
cp ./ads.html ./public/
cp ./ads.html ./public_html/
cp ./ads.html ./client/public/
cp ./ads.html ./client/dist/client/
cp ./ads.html ./static/
echo "Created comprehensive ads.html file with script fallback"

# Create a .htaccess file for handling ads.txt requests
cat > ./.htaccess << EOL
# Handle ads.txt requests
<Files "ads.txt">
    ForceType text/plain
    Header set Content-Type "text/plain"
</Files>

# Rewrite rule for ads.txt
RewriteEngine On
RewriteCond %{REQUEST_URI} ads\.txt$ [NC]
RewriteRule .* /ads.txt [L]
EOL
echo "Created .htaccess file for handling ads.txt requests"

# Make sure client index.html has structured data for search engines
if [ -f "./client/index.html" ]; then
  # Check if structured data already exists
  if ! grep -q "application/ld+json" "./client/index.html"; then
    # Insert structured data before the closing head tag
    sed -i '/<\/head>/i \
    <!-- Inline ads.txt content for search engines --> \
    <script type="application/ld+json"> \
    { \
      "@context": "https://schema.org", \
      "@type": "WebSite", \
      "name": "Suono Napoletano", \
      "url": "https://suononapoletano.com/", \
      "potentialAction": { \
        "@type": "ViewAction", \
        "target": "https://suononapoletano.com/ads.txt" \
      }, \
      "description": "ads.txt content: google.com, pub-1733624280085328, DIRECT, f08c47fec0942fa0" \
    } \
    </script>' "./client/index.html"
    echo "Added structured data to client/index.html"
  fi
  
  # Add our redirect-to-ads.js script to body
  if ! grep -q "redirect-to-ads.js" "./client/index.html"; then
    # Insert script tag before the main.tsx script
    sed -i '/<script type="module" src="\/src\/main.tsx"><\/script>/i \
    <!-- Special script to handle ads.txt requests via client-side detection --> \
    <script type="text/javascript" src="/redirect-to-ads.js"></script>\
    ' "./client/index.html"
    echo "Added redirect-to-ads.js script to client/index.html"
  fi
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
echo "7. curl -L https://suononapoletano.com/public_html/ads.txt"
echo "8. curl -I https://suononapoletano.com/ads.txt (check headers)"
echo ""
echo "At least one of these should work. If none do, try visiting the site in a browser and viewing the page source."
echo "The client-side JavaScript solution might work even if the direct file access doesn't."