"use client";

import { useState, useCallback } from "react";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

type SearchMode = "scroll" | "portal" | "terminal";

function domainFromUrl(url: string): string {
  try { return new URL(url).hostname; } catch { return url; }
}

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<SearchMode>("scroll");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    setTerminalOutput("");

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), mode }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      if (data.results) setResults(data.results);
      if (data.terminalOutput) setTerminalOutput(data.terminalOutput);
      setSearchHistory((prev) => [query.trim(), ...prev.filter((q) => q !== query.trim())].slice(0, 10));
    } catch {
      setError("The arcane scrolls are unreachable.");
    } finally {
      setLoading(false);
    }
  }, [query, mode]);

  const openPortal = (url: string) => {
    setPreviewUrl(url);
  };

  const openFullscreen = () => {
    if (!previewUrl) return;
    const features = "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1280,height=800";
    window.open(previewUrl, "_blank", features);
  };

  const modes: { id: SearchMode; label: string; icon: string; desc: string }[] = [
    { id: "scroll", label: "Scroll", icon: "📜", desc: "Classic result list" },
    { id: "portal", label: "Portal", icon: "🌀", desc: "Embedded preview" },
    { id: "terminal", label: "Terminal", icon: "💻", desc: "Hacker output" },
  ];

  return (
    <div className="anim-in">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl t-title flex items-center gap-2">🔍 Arcane Search</h1>
        <span className="t-dim text-xs font-mono">Knowledge Proxy</span>
      </div>

      {/* Search bar */}
      <div className="fp mb-4">
        <div className="fp-head"><span>🔮</span><h3>Query the Arcane Void</h3></div>
        <div className="fp-body">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Speak your query into the void..."
              className="inp flex-1"
            />
            <button type="submit" disabled={loading} className="btn btn-g disabled:opacity-50 cursor-pointer">
              {loading ? <div className="rloader !w-4 !h-4" /> : "Cast 🔮"}
            </button>
          </form>
          <div className="flex gap-2 mt-3">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all ${
                  mode === m.id ? "t-gold border" : "t-dim hover:t-cream border border-transparent"
                }`}
                style={mode === m.id ? { background: "rgba(201,168,76,0.1)", borderColor: "var(--gold-dim)" } : {}}
                title={m.desc}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md text-sm" style={{ background: "rgba(196,80,80,0.1)", border: "1px solid rgba(196,80,80,0.3)", color: "var(--red)" }}>
          ⚠️ {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Results list */}
        <div className={`${previewUrl && mode === "portal" ? "lg:w-1/2" : "flex-1"}`}>
          {/* Scroll Mode */}
          {mode === "scroll" && results.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs t-dim font-mono">Found {results.length} scrolls</p>
              {results.map((result, i) => (
                <div key={i} className="fp p-3 hover:border-gold-dim transition-all">
                  <div className="flex items-start gap-2">
                    <span className="t-dim text-xs mt-0.5">{i + 1}.</span>
                    <div>
                      <a href={result.url} target="_blank" rel="noopener noreferrer"
                        className="t-link hover:t-cream font-medium text-sm transition-colors">
                        {result.title}
                      </a>
                      <p className="text-[10px] t-dim mt-0.5 truncate">{result.url}</p>
                      <p className="text-xs t-dim mt-1">{result.snippet}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Portal Mode — click to open in portal window */}
          {mode === "portal" && results.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs t-dim font-mono mb-1">Click a result to open in the Portal Window →</p>
              {results.map((result, i) => (
                <button
                  key={i}
                  onClick={() => openPortal(result.url)}
                  className={`w-full text-left fp p-3 transition-all cursor-pointer ${
                    previewUrl === result.url ? "fp-gold" : "hover:border-gold-dim"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domainFromUrl(result.url)}&sz=32`}
                      alt=""
                      className="w-5 h-5 rounded flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="t-link font-medium text-sm">{result.title}</div>
                      <p className="text-[10px] t-dim truncate">{domainFromUrl(result.url)}</p>
                      <p className="text-xs t-dim mt-0.5 line-clamp-1">{result.snippet}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Terminal Mode */}
          {mode === "terminal" && terminalOutput && (
            <div className="fp p-4 font-mono text-sm" style={{ background: "#060812" }}>
              <pre className="whitespace-pre-wrap leading-relaxed" style={{ color: "var(--green)", textShadow: "0 0 5px rgba(93,160,106,0.3)" }}>
                {terminalOutput}
                <span className="inline-block w-2 h-4 ml-1 animate-pulse" style={{ background: "var(--green)" }} />
              </pre>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && results.length === 0 && !terminalOutput && (
            <div className="text-center py-16 t-dim">
              <div className="text-4xl mb-3">🔮</div>
              <p className="font-mono text-sm">The void awaits your query...</p>
            </div>
          )}
        </div>

        {/* Portal preview panel */}
        {mode === "portal" && previewUrl && (
          <div className="lg:w-1/2">
            <div className="fp sticky top-16">
              <div className="fp-head">
                <span>🌀</span>
                <h3 className="truncate flex-1 text-xs">{previewUrl}</h3>
                <button onClick={() => setPreviewUrl("")} className="text-xs t-dim hover:text-red-400 cursor-pointer mr-1">✕</button>
              </div>

              {/* Action bar */}
              <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid var(--border-light)" }}>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-g text-[10px] px-3 py-1 cursor-pointer"
                >
                  ↗ Open in New Tab
                </a>
                <button
                  onClick={openFullscreen}
                  className="btn btn-p text-[10px] px-3 py-1 cursor-pointer"
                >
                  🖥 Fullscreen Window
                </button>
                <span className="text-[9px] t-dim ml-auto">{domainFromUrl(previewUrl)}</span>
              </div>

              {/* Iframe preview — works for sites that allow embedding */}
              <div className="p-1">
                <div className="rounded overflow-hidden" style={{ height: "460px", background: "#111" }}>
                  <iframe
                    src={previewUrl}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    title="Portal Preview"
                    style={{ border: "none" }}
                  />
                </div>
              </div>

              {/* Note about iframe blocking */}
              <div className="px-3 py-2 text-[10px] t-dim" style={{ borderTop: "1px solid var(--border-light)" }}>
                ⚠️ If the preview is blank, the site blocks embedding. Use{" "}
                <strong className="t-gold">Open in New Tab</strong> or{" "}
                <strong className="t-gold">Fullscreen Window</strong> instead.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search history */}
      {searchHistory.length > 1 && (
        <div className="mt-4">
          <h3 className="text-xs font-mono t-dim mb-2">📜 Recent Queries</h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(1).map((q, i) => (
              <button
                key={i}
                onClick={() => setQuery(q)}
                className="text-xs px-3 py-1 rounded-md t-dim hover:t-cream cursor-pointer"
                style={{ background: "var(--bg-dark)", border: "1px solid var(--border-light)" }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
