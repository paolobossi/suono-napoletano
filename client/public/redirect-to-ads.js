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
        const response = new Response('google.com, pub-1733624280085328, DIRECT, f08c47fec0942fa0', {
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
    document.body.textContent = 'google.com, pub-1733624280085328, DIRECT, f08c47fec0942fa0';
  }
})();
