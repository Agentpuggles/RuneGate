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
    { id: "scroll", label: "Scroll", icon: "", desc: "Classic result list" },
    { id: "portal", label: "Portal", icon: "", desc: "Embedded preview" },
    { id: "terminal", label: "Terminal", icon: "", desc: "Hacker output" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-rune text-portal-gold">Arcane Search</h1>
          <p className="text-sm text-portal-text-muted">Knowledge Proxy</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="panel">
        <div className="panel-header">
          <span className="icon"></span>
          <h3>Query the Arcane Void</h3>
        </div>
        <div className="panel-body space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Speak your query into the void..."
              className="input flex-1"
            />
            <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-50">
              {loading ? <div className="loader !w-5 !h-5" /> : "Search"}
            </button>
          </form>
          <div className="flex gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`btn ${mode === m.id ? "btn-primary" : "btn-ghost"}`}
                title={m.desc}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-portal-ruby/10 border border-portal-ruby/30">
          <span className="text-portal-ruby"></span>
          <span className="text-sm text-portal-ruby">{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Results list */}
        <div className={`${previewUrl && mode === "portal" ? "lg:w-1/2" : "flex-1"}`}>
          {/* Scroll Mode */}
          {mode === "scroll" && results.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-portal-text-muted font-mono">Found {results.length} results</p>
              {results.map((result, i) => (
                <a
                  key={i}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card block p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-portal-text-dim text-sm mt-0.5 font-mono">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${domainFromUrl(result.url)}&sz=32`}
                        alt=""
                        className="w-4 h-4 rounded inline mr-2"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <span className="text-portal-sapphire hover:text-portal-sapphire-light font-medium text-sm transition-colors">
                        {result.title}
                      </span>
                      <p className="text-xs text-portal-text-dim mt-1 truncate">{result.url}</p>
                      <p className="text-sm text-portal-text-secondary mt-1.5">{result.snippet}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Portal Mode */}
          {mode === "portal" && results.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-portal-text-muted">Click a result to open in the Portal Window</p>
              {results.map((result, i) => (
                <button
                  key={i}
                  onClick={() => openPortal(result.url)}
                  className={`card w-full text-left p-4 ${previewUrl === result.url ? "panel-gold" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domainFromUrl(result.url)}&sz=32`}
                      alt=""
                      className="w-5 h-5 rounded"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-portal-sapphire font-medium text-sm">{result.title}</div>
                      <p className="text-xs text-portal-text-dim truncate">{domainFromUrl(result.url)}</p>
                      <p className="text-xs text-portal-text-muted mt-1 line-clamp-1">{result.snippet}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Terminal Mode */}
          {mode === "terminal" && terminalOutput && (
            <div className="panel p-6 font-mono text-sm bg-portal-bg-base">
              <pre className="whitespace-pre-wrap leading-relaxed text-portal-emerald" style={{ textShadow: "0 0 5px rgba(16, 185, 129, 0.3)" }}>
                {terminalOutput}
                <span className="inline-block w-2 h-4 ml-1 animate-pulse bg-portal-emerald" />
              </pre>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && results.length === 0 && !terminalOutput && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-30"></div>
              <p className="text-portal-text-muted">The void awaits your query...</p>
            </div>
          )}
        </div>

        {/* Portal preview panel */}
        {mode === "portal" && previewUrl && (
          <div className="lg:w-1/2">
            <div className="panel sticky top-24">
              <div className="panel-header">
                <span className="icon"></span>
                <h3 className="truncate flex-1">{previewUrl}</h3>
                <button onClick={() => setPreviewUrl("")} className="btn btn-ghost text-sm">Close</button>
              </div>

              <div className="flex items-center gap-2 px-4 py-3 border-b border-portal-border">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-xs"
                >
                  Open in New Tab
                </a>
                <button onClick={openFullscreen} className="btn btn-secondary text-xs">
                  Fullscreen
                </button>
                <span className="text-xs text-portal-text-dim ml-auto">{domainFromUrl(previewUrl)}</span>
              </div>

              <div className="p-2">
                <div className="rounded-lg overflow-hidden bg-portal-bg-base" style={{ height: "480px" }}>
                  <iframe
                    src={previewUrl}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    title="Portal Preview"
                    style={{ border: "none" }}
                  />
                </div>
              </div>

              <div className="px-4 py-3 border-t border-portal-border">
                <p className="text-xs text-portal-text-muted">
                  Note: If the preview is blank, the site blocks embedding. Use "Open in New Tab" instead.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search history */}
      {searchHistory.length > 1 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-portal-text-muted mb-3">Recent Queries</h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(1).map((q, i) => (
              <button
                key={i}
                onClick={() => setQuery(q)}
                className="btn btn-ghost text-xs"
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
