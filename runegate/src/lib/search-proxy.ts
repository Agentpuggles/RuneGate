import prisma from "./db";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

function isBlockedUrl(url: string): boolean {
  const blocked = [/localhost/i, /127\.\d+\.\d+\.\d+/, /10\.\d+\.\d+\.\d+/, /172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/, /192\.168\.\d+\.\d+/, /0\.0\.0\.0/, /file:\/\//i, /ftp:\/\//i, /javascript:/i, /data:/i];
  return blocked.some((p) => p.test(url));
}

function resolveDDGUrl(rawUrl: string): string {
  try {
    if (rawUrl.includes("duckduckgo.com/l/?") || rawUrl.includes("duckduckgo.com/l/?")) {
      const match = rawUrl.match(/uddg=([^&]+)/);
      if (match?.[1]) return decodeURIComponent(match[1]);
    }
    if (rawUrl.startsWith("//")) return "https:" + rawUrl;
    return rawUrl;
  } catch { return rawUrl; }
}

export async function searchWeb(query: string, userId: string): Promise<{ results: SearchResult[]; error?: string }> {
  if (!query?.trim()) return { results: [], error: "Query cannot be empty" };
  if (query.length > 500) return { results: [], error: "Query too long" };
  if (isBlockedUrl(query)) return { results: [], error: "Blocked query" };

  try {
    // Try DDG Lite first (simpler HTML, easier to parse)
    const liteUrl = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`;
    const res = await fetch(liteUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) return { results: [], error: `Search failed: ${res.status}` };

    const html = await res.text();
    let results = parseLiteResults(html);

    // Fallback to regular DDG HTML if lite fails
    if (results.length === 0) {
      const htmlUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const res2 = await fetch(htmlUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        signal: AbortSignal.timeout(12000),
      });
      if (res2.ok) {
        const html2 = await res2.text();
        results = parseHTMLResults(html2);
      }
    }

    await prisma.searchLog.create({ data: { userId, query: query.substring(0, 500) } });
    return { results: results.slice(0, 15) };
  } catch (err) {
    console.error("Search error:", err);
    return { results: [], error: "Search service unavailable." };
  }
}

function parseLiteResults(html: string): SearchResult[] {
  const results: SearchResult[] = [];
  try {
    // DDG Lite uses tables. Each result row contains:
    // <a rel="nofollow" class="result-link" href="URL">Title</a>
    // <td class="result-snippet">Snippet</td>
    const rows = html.split('<tr rel="');
    for (let i = 1; i < rows.length && results.length < 20; i++) {
      const row = rows[i];
      const linkMatch = row.match(/<a[^>]*class="result-link"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i)
        || row.match(/<a[^>]*class="link"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i)
        || row.match(/<a[^>]*href="(\/\/duckduckgo\.com\/l\/\?[^"]*)"[^>]*>([\s\S]*?)<\/a>/i);

      const snippetMatch = row.match(/class="result-snippet"[^>]*>([\s\S]*?)<\/td>/i)
        || row.match(/class="snippet"[^>]*>([\s\S]*?)<\/td>/i);

      if (linkMatch) {
        const url = resolveDDGUrl(linkMatch[1].replace(/&amp;/g, "&"));
        const title = linkMatch[2].replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
        const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim() : "";

        if (title && url && !url.includes("duckduckgo.com")) {
          results.push({ title, url, snippet });
        }
      }
    }
  } catch (e) { console.error("Lite parse error:", e); }
  return results;
}

function parseHTMLResults(html: string): SearchResult[] {
  const results: SearchResult[] = [];
  try {
    // Parse regular DDG HTML
    const blocks = html.split(/class="result[^"]*"/);
    for (let i = 1; i < blocks.length && results.length < 20; i++) {
      const block = blocks[i];
      const titleMatch = block.match(/class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i)
        || block.match(/href="(\/\/duckduckgo\.com\/l\/\?[^"]*)"[^>]*>([\s\S]*?)<\/a>/i)
        || block.match(/href="([^"]*)"[^>]*class="[^"]*result[^"]*a[^"]*"[^>]*>([\s\S]*?)<\/a>/i);

      const snippetMatch = block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);

      if (titleMatch) {
        const url = resolveDDGUrl(titleMatch[1].replace(/&amp;/g, "&"));
        const title = titleMatch[2].replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();
        const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim() : "";

        if (title && url && !url.includes("duckduckgo.com")) {
          results.push({ title, url, snippet });
        }
      }
    }

    // Fallback: generic link extraction
    if (results.length === 0) {
      const linkRegex = /href="(\/\/duckduckgo\.com\/l\/\?uddg=[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      while ((match = linkRegex.exec(html)) !== null && results.length < 15) {
        const url = resolveDDGUrl(match[1].replace(/&amp;/g, "&"));
        const title = match[2].replace(/<[^>]*>/g, "").trim();
        if (title && url && !url.includes("duckduckgo.com")) {
          results.push({ title, url, snippet: "" });
        }
      }
    }
  } catch (e) { console.error("HTML parse error:", e); }
  return results;
}

export async function fetchPagePreview(url: string, _userId: string): Promise<{ html: string; error?: string }> {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return { html: "", error: "Only HTTP(S) URLs allowed" };
    const h = parsed.hostname;
    if (h === "localhost" || h === "127.0.0.1" || h.startsWith("192.168.") || h.startsWith("10.") || h.startsWith("172.") || h === "0.0.0.0")
      return { html: "", error: "Private network URLs blocked" };
  } catch { return { html: "", error: "Invalid URL" }; }

  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; RuneGate/1.0)" }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return { html: "", error: `Failed: ${r.status}` };
    return { html: await r.text() };
  } catch { return { html: "", error: "Failed to fetch" }; }
}
