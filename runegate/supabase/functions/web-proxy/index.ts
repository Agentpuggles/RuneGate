import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// HTML template for the proxied page
function generateProxyPage(url: string, content: string, baseUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RuneGate Portal - ${url}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', serif;
      background: #000;
      color: #c9b896;
      min-height: 100vh;
    }
    .portal-header {
      background: linear-gradient(180deg, #1a1a1f 0%, #0d0d12 100%);
      border-bottom: 2px solid #2a2a2a;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .portal-header h1 {
      font-family: 'MedievalSharp', cursive;
      color: #d4af37;
      font-size: 14px;
      text-transform: uppercase;
    }
    .portal-url {
      flex: 1;
      background: #0a0a0f;
      border: 1px solid #2a2a2a;
      padding: 6px 12px;
      font-family: monospace;
      font-size: 11px;
      color: #c9b896;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .portal-btn {
      background: linear-gradient(180deg, #d4af37 0%, #996515 100%);
      border: 2px solid #f0d060;
      padding: 6px 16px;
      font-family: 'Times New Roman', serif;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      color: #000;
      text-transform: uppercase;
    }
    .portal-btn:hover {
      background: linear-gradient(180deg, #f0d060 0%, #d4af37 100%);
    }
    .portal-btn-exit {
      background: linear-gradient(180deg, #cc0000 0%, #660000 100%);
      border-color: #ff3333;
      color: #fff;
    }
    .portal-content {
      width: 100%;
      height: calc(100vh - 50px);
      border: none;
      background: #fff;
    }
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 50px);
      flex-direction: column;
      gap: 16px;
    }
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #2a2a2a;
      border-top-color: #d4af37;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="portal-header">
    <span style="color: #d4af37; font-size: 18px;">🌀</span>
    <h1>RuneGate Portal</h1>
    <div class="portal-url">${url}</div>
    <a href="${url}" target="_blank" class="portal-btn">↗ Open Direct</a>
    <a href="/search" class="portal-btn portal-btn-exit">✕ Exit</a>
  </div>
  <iframe id="content-frame" class="portal-content" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe>
  <div id="loading" class="loading">
    <div class="loading-spinner"></div>
    <span style="color: #d4af37;">Opening portal...</span>
  </div>
  <script>
    const frame = document.getElementById('content-frame');
    const loading = document.getElementById('loading');

    // Create blob URL for the content
    const blob = new Blob([${JSON.stringify(content)}], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);

    frame.srcdoc = decodeURIComponent("${encodeURIComponent(content)}");

    frame.onload = () => {
      loading.style.display = 'none';
    };

    // Rewrite links to go through proxy
    frame.addEventListener('load', () => {
      try {
        const doc = frame.contentDocument || frame.contentWindow.document;
        const links = doc.querySelectorAll('a[href]');
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
            try {
              const absoluteUrl = new URL(href, '${url}').href;
              link.setAttribute('href', '${baseUrl}?url=' + encodeURIComponent(absoluteUrl));
            } catch (e) {}
          }
        });

        // Rewrite forms
        const forms = doc.querySelectorAll('form[action]');
        forms.forEach(form => {
          const action = form.getAttribute('action');
          if (action) {
            try {
              const absoluteUrl = new URL(action, '${url}').href;
              form.setAttribute('action', '${baseUrl}?url=' + encodeURIComponent(absoluteUrl));
              form.setAttribute('target', '_self');
            } catch (e) {}
          }
        });
      } catch (e) {
        // Cross-origin restrictions
      }
    });
  </script>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const targetUrl = url.searchParams.get("url");

  // Return info page if no URL
  if (!targetUrl) {
    return new Response(
      JSON.stringify({
        name: "RuneGate Web Proxy",
        version: "1.0",
        description: "Server-side web proxy for Arcane Search",
        usage: "Add ?url=ENCODED_URL to proxy a website",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Fetch the target URL
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
    });

    const contentType = response.headers.get("content-type") || "text/html";

    // Handle non-HTML content (images, CSS, JS, etc.)
    if (!contentType.includes("text/html")) {
      const data = await response.arrayBuffer();
      return new Response(data, {
        headers: {
          ...corsHeaders,
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // Get HTML content
    let html = await response.text();

    // Rewrite URLs in HTML
    const baseUrl = url.origin + url.pathname;
    const targetOrigin = new URL(targetUrl).origin;

    // Rewrite absolute URLs
    html = html.replace(/(href|src|action)=["'](https?:\/\/[^"']+)["']/gi, (match, attr, linkUrl) => {
      try {
        const absolute = new URL(linkUrl, targetUrl).href;
        return `${attr}="${baseUrl}?url=${encodeURIComponent(absolute)}"`;
      } catch {
        return match;
      }
    });

    // Rewrite protocol-relative URLs
    html = html.replace(/(href|src|action)=["'](\/\/[^"']+)["']/gi, (match, attr, linkUrl) => {
      try {
        const absolute = new URL(linkUrl, targetUrl).href;
        return `${attr}="${baseUrl}?url=${encodeURIComponent(absolute)}"`;
      } catch {
        return match;
      }
    });

    // Rewrite root-relative URLs
    html = html.replace(/(href|src|action)=["'](\/[^"']*)["']/gi, (match, attr, linkUrl) => {
      try {
        const absolute = new URL(linkUrl, targetUrl).href;
        return `${attr}="${baseUrl}?url=${encodeURIComponent(absolute)}"`;
      } catch {
        return match;
      }
    });

    // Inject base tag for relative URLs
    if (!html.includes("<base")) {
      html = html.replace(/<head[^>]*>/i, (match) => {
        return match + `<base href="${targetUrl}">`;
      });
    }

    // Return the proxied page wrapped in our portal frame
    const proxiedPage = generateProxyPage(targetUrl, html, baseUrl);

    return new Response(proxiedPage, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        error: "Failed to fetch URL",
        message: errorMessage,
        url: targetUrl,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
