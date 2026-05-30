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
    } catch {
      setError("The arcane scrolls are unreachable.");
    } finally {
      setLoading(false);
    }
  }, [query, mode]);

  const modes: { id: SearchMode; label: string; icon: string }[] = [
    { id: "scroll", label: "Scroll", icon: "📜" },
    { id: "portal", label: "Portal", icon: "🌀" },
    { id: "terminal", label: "Terminal", icon: "💻" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="frame">
        <div className="frame-header">
          <span>🔍</span> <h3>Arcane Search — Knowledge Proxy</h3>
        </div>
      </div>

      {/* Search Box */}
      <div className="frame">
        <div className="frame-header">
          <span>🔮</span> <h3>Query the Arcane Void</h3>
        </div>
        <div className="frame-inner">
          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Speak your query into the void..."
              className="inp flex-1"
            />
            <button type="submit" disabled={loading} className="btn btn-gold disabled:opacity-50">
              {loading ? "..." : "Search"}
            </button>
          </form>

          <div className="flex gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`btn ${mode === m.id ? "btn-gold" : "btn-std"} text-xs`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="border border-guild-blood bg-guild-blood-dark bg-opacity-30 p-3 text-sm text-guild-blood-light">
          ⚠ {error}
        </div>
      )}

      {/* Results */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className={`${previewUrl && mode === "portal" ? "lg:w-1/2" : "flex-1"}`}>
          {/* Scroll Mode */}
          {mode === "scroll" && results.length > 0 && (
            <div className="frame">
              <div className="frame-header">
                <span>📜</span> <h3>Search Results — {results.length} found</h3>
              </div>
              <div className="frame-inner p-0">
                <table className="guild-table">
                  <tbody>
                    {results.map((result, i) => (
                      <tr key={i}>
                        <td className="text-guild-gold font-mono w-8">{i + 1}.</td>
                        <td>
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-guild-sapphire hover:text-guild-gold transition-colors font-bold"
                          >
                            {result.title}
                          </a>
                          <p className="text-2xs text-guild-text-dim font-mono mt-1 truncate">{result.url}</p>
                          <p className="text-xs text-guild-text-dim mt-1">{result.snippet}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Portal Mode */}
          {mode === "portal" && results.length > 0 && (
            <div className="frame">
              <div className="frame-header">
                <span>🌀</span> <h3>Click to open in Portal</h3>
              </div>
              <div className="frame-inner p-0">
                <table className="guild-table">
                  <tbody>
                    {results.map((result, i) => (
                      <tr
                        key={i}
                        onClick={() => setPreviewUrl(result.url)}
                        className={`cursor-pointer ${previewUrl === result.url ? "bg-guild-gold bg-opacity-10" : ""}`}
                      >
                        <td className="text-2xl w-10 text-center">🌐</td>
                        <td>
                          <div className="font-bold text-guild-text-light">{result.title}</div>
                          <p className="text-2xs text-guild-text-dim font-mono">{domainFromUrl(result.url)}</p>
                          <p className="text-xs text-guild-text-dim mt-1 line-clamp-1">{result.snippet}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Terminal Mode */}
          {mode === "terminal" && terminalOutput && (
            <div className="frame">
              <div className="frame-header">
                <span>💻</span> <h3>Terminal Output</h3>
              </div>
              <div className="frame-inner">
                <pre className="font-mono text-xs text-guild-emerald whitespace-pre-wrap" style={{ textShadow: "0 0 5px rgba(0, 204, 102, 0.3)" }}>
                  {terminalOutput}
                  <span className="inline-block w-2 h-4 ml-1 animate-blink bg-guild-emerald" />
                </pre>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && results.length === 0 && !terminalOutput && (
            <div className="frame">
              <div className="frame-inner text-center py-12">
                <div className="text-4xl mb-3">🔮</div>
                <p className="text-guild-text-dim">The void awaits your query...</p>
              </div>
            </div>
          )}
        </div>

        {/* Portal Preview */}
        {mode === "portal" && previewUrl && (
          <div className="lg:w-1/2">
            <div className="frame">
              <div className="frame-header">
                <span>🌀</span> <h3 className="truncate">{previewUrl}</h3>
                <button onClick={() => setPreviewUrl("")} className="btn btn-blood ml-auto text-xs">
                  [X]
                </button>
              </div>
              <div className="frame-inner p-1">
                <div className="flex gap-2 mb-2">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold text-xs"
                  >
                    ↗ Open External
                  </a>
                  <span className="text-xs text-guild-text-dim font-mono self-center">
                    [{domainFromUrl(previewUrl)}]
                  </span>
                </div>
                <div className="aspect-video bg-black">
                  <iframe
                    src={previewUrl}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    title="Portal Preview"
                    style={{ border: "none" }}
                  />
                </div>
                <p className="text-2xs text-guild-text-dim mt-2">
                  ⚠ If blank, site blocks embedding. Use "Open External".
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
