'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SearchResult {
  games?: any[];
  users?: any[];
  messages?: any[];
}

interface ExternalSearch {
  name: string;
  icon: string;
  url: string;
  direct: string;
}

export default function PortalSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('all');
  const [engine, setEngine] = useState('google');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/portal/search?q=${encodeURIComponent(query)}&type=${searchType}&engine=${engine}`
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/portal" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Back to Portal
        </Link>

        <h1 className="text-4xl font-bold mb-2">🔍 Portal Search</h1>
        <p className="text-gray-400 mb-8">Search RuneGate or the web through our proxy</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games, players, or use web search..."
              className="flex-1 bg-gray-800 rounded px-4 py-3 text-white placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded font-bold"
            >
              Search
            </button>
          </div>

          {/* Search Type Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              type="button"
              onClick={() => setSearchType('all')}
              className={`px-4 py-2 rounded font-bold capitalize ${
                searchType === 'all'
                  ? 'bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSearchType('internal')}
              className={`px-4 py-2 rounded font-bold capitalize ${
                searchType === 'internal'
                  ? 'bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              RuneGate
            </button>
            <button
              type="button"
              onClick={() => setSearchType('proxy')}
              className={`px-4 py-2 rounded font-bold capitalize ${
                searchType === 'proxy'
                  ? 'bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Web Search
            </button>
          </div>

          {/* Search Engine Selection (for proxy search) */}
          {(searchType === 'proxy' || searchType === 'all') && (
            <div className="mb-4">
              <label className="text-sm font-bold mb-2 block">Search Engine:</label>
              <div className="flex gap-2 flex-wrap">
                {['google', 'youtube', 'bing', 'duckduckgo'].map((eng) => (
                  <button
                    key={eng}
                    type="button"
                    onClick={() => setEngine(eng)}
                    className={`px-3 py-2 rounded font-bold capitalize text-sm ${
                      engine === eng
                        ? 'bg-purple-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {eng}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {loading && (
          <p className="text-center text-gray-400 py-8">Searching...</p>
        )}

        {results && (
          <div className="space-y-8">
            {/* Internal Results */}
            {results.type === 'all' && results.internal && (
              <div>
                <h2 className="text-2xl font-bold mb-4">🎮 RuneGate Results</h2>
                
                {results.internal.games?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3 text-blue-400">Games ({results.internal.games.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {results.internal.games.map((game: any) => (
                        <Link
                          key={game.id}
                          href={`/games/${game.slug}`}
                          className="block bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition"
                        >
                          <h4 className="font-bold">{game.title}</h4>
                          <p className="text-gray-300 text-sm">{game.description}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {results.internal.users?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-blue-400">Players ({results.internal.users.length})</h3>
                    <div className="space-y-2">
                      {results.internal.users.map((user: any) => (
                        <Link
                          key={user.id}
                          href={`/profile/${user.id}`}
                          className="block bg-gray-800 hover:bg-gray-700 rounded-lg p-3 transition"
                        >
                          <p className="font-bold">{user.displayName || user.username}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Web Search Results */}
            {(results.type === 'proxy' || results.type === 'all') && results.external && (
              <div>
                <h2 className="text-2xl font-bold mb-4">🌐 Web Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(results.external).map(([key, search]: [string, any]) => (
                    <a
                      key={key}
                      href={search.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-br from-purple-600 to-purple-800 hover:shadow-lg hover:shadow-purple-500/50 rounded-lg p-6 transition transform hover:scale-105"
                    >
                      <div className="text-3xl mb-2">{search.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{search.name}</h3>
                      <p className="text-sm text-purple-200 mb-3">
                        Search "{query}" on {search.name}
                      </p>
                      <span className="text-purple-300 hover:text-purple-100">
                        Open via Proxy →
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Search Results (type: internal only) */}
            {results.type === 'internal' && results.results && (
              <div>
                <h2 className="text-2xl font-bold mb-4">📚 Search Results</h2>
                
                {results.results.games?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3 text-green-400">Games ({results.results.games.length})</h3>
                    <div className="space-y-3">
                      {results.results.games.map((game: any) => (
                        <Link
                          key={game.id}
                          href={`/games/${game.slug}`}
                          className="block bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition"
                        >
                          <h4 className="font-bold text-lg">{game.title}</h4>
                          <p className="text-gray-300 text-sm">{game.description}</p>
                          <p className="text-xs text-gray-500 mt-2">Category: {game.category}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {results.results.users?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3 text-blue-400">Players ({results.results.users.length})</h3>
                    <div className="space-y-3">
                      {results.results.users.map((user: any) => (
                        <Link
                          key={user.id}
                          href={`/profile/${user.id}`}
                          className="block bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition"
                        >
                          <p className="font-bold">{user.displayName || user.username}</p>
                          <p className="text-sm text-gray-400">{user.rank} • Level {user.level}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {results.results.messages?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-yellow-400">Messages ({results.results.messages.length})</h3>
                    <div className="space-y-3">
                      {results.results.messages.map((msg: any) => (
                        <div
                          key={msg.id}
                          className="bg-gray-800 rounded-lg p-4"
                        >
                          <p className="text-sm text-gray-500">
                            {msg.user.username} in #{msg.channel.name}
                          </p>
                          <p className="text-gray-300 mt-2">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!results.results.games?.length &&
                  !results.results.users?.length &&
                  !results.results.messages?.length && (
                    <p className="text-center text-gray-400 py-8">
                      No results found for "{query}"
                    </p>
                  )}
              </div>
            )}

            {/* Proxy Search Only Results */}
            {results.type === 'proxy' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">🌐 {results.engine.toUpperCase()} Search</h3>
                <p className="text-gray-300 mb-4">
                  Searching for: <span className="font-bold">"{query}"</span>
                </p>
                <a
                  href={results.proxyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded font-bold transition"
                >
                  Open Search Results via Proxy →
                </a>
              </div>
            )}
          </div>
        )}

        {!results && !loading && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-4">🔍 Start searching!</p>
            <p className="text-sm">
              Search RuneGate games & players, or use web search to access content through our proxy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
