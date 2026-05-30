"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnail: string;
  image: string;
  embedUrl: string;
  controls: string;
  rating: number;
  plays: number;
  isFavorite: boolean;
}

const categories = [
  { id: "all", label: "All", icon: "[*]" },
  { id: "puzzle", label: "Puzzle", icon: "[P]" },
  { id: "strategy", label: "Strategy", icon: "[S]" },
  { id: "rpg", label: "RPG", icon: "[R]" },
  { id: "arcade", label: "Arcade", icon: "[A]" },
];

export default function GamesClient() {
  const [games, setGames] = useState<Game[]>([]);
  const [recent, setRecent] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const fetchGames = useCallback(async () => {
    try {
      const res = await fetch("/api/games");
      const data = await res.json();
      if (data.games) {
        setGames(data.games);
        const ids = data.recentGameIds || [];
        setRecent(
          ids
            .map((id: string) => data.games.find((g: Game) => g.id === id))
            .filter(Boolean)
        );
      }
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const toggleFavorite = async (gameId: string, isFavorite: boolean) => {
    try {
      await fetch("/api/games/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          action: isFavorite ? "remove" : "add",
        }),
      });
      setGames((prev) =>
        prev.map((g) =>
          g.id === gameId ? { ...g, isFavorite: !isFavorite } : g
        )
      );
    } catch {
      // Handle error silently
    }
  };

  const filteredGames = games.filter((game) => {
    if (activeCategory !== "all" && game.category !== activeCategory) return false;
    if (favoritesOnly && !game.isFavorite) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        game.title.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="frame">
        <div className="frame-header">
          <span>🎮</span> <h3>Games Realm — Arcade</h3>
          <span className="ml-auto text-guild-text-dim text-xs">[{games.length} games available]</span>
        </div>
      </div>

      {/* Recently Played */}
      {recent.length > 0 && (
        <div className="frame">
          <div className="frame-header">
            <span>⏱</span> <h3>Recently Played</h3>
          </div>
          <div className="frame-inner">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recent.slice(0, 8).map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="flex-shrink-0 frame hover:border-guild-gold transition-colors"
                  style={{ minWidth: "120px" }}
                >
                  <div className="p-2 text-center">
                    <div className="text-2xl mb-1">{game.thumbnail}</div>
                    <div className="text-xs font-bold text-guild-text-light truncate">
                      {game.title}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      <div className="frame">
        <div className="frame-header">
          <span>🔍</span> <h3>Browse Games</h3>
        </div>
        <div className="frame-inner">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="inp flex-1"
            />
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className="btn btn-std flex-shrink-0"
            >
              {favoritesOnly ? "[★ Favs]" : "[☆ Favs]"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`btn ${activeCategory === cat.id ? "btn-gold" : "btn-std"} text-xs`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games Table/Grid */}
      <div className="frame">
        <div className="frame-inner p-0">
          {filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔮</div>
              <p className="text-guild-text-dim">No games found matching your criteria.</p>
            </div>
          ) : (
            <table className="guild-table">
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>#</th>
                  <th style={{ width: "50px" }}>Icon</th>
                  <th>Game</th>
                  <th style={{ width: "80px" }}>Category</th>
                  <th style={{ width: "70px" }}>Rating</th>
                  <th style={{ width: "70px" }}>Plays</th>
                  <th style={{ width: "60px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game, i) => (
                  <tr key={game.id}>
                    <td className="text-guild-gold font-mono">{i + 1}.</td>
                    <td className="text-2xl text-center">{game.thumbnail}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-guild-text-light">{game.title}</span>
                        <button
                          onClick={() => toggleFavorite(game.id, game.isFavorite)}
                          className="text-guild-gold hover:text-guild-gold-light"
                        >
                          {game.isFavorite ? "★" : "☆"}
                        </button>
                      </div>
                      <p className="text-xs text-guild-text-dim mt-1 line-clamp-1">{game.description}</p>
                    </td>
                    <td>
                      <span className={`badge badge-${game.category === "puzzle" ? "sapphire" : game.category === "rpg" ? "amethyst" : game.category === "strategy" ? "gold" : "emerald"}`}>
                        {game.category}
                      </span>
                    </td>
                    <td className="text-center font-mono text-guild-gold">{game.rating.toFixed(1)}</td>
                    <td className="text-center font-mono">{game.plays}</td>
                    <td>
                      <Link href={`/games/${game.id}`} className="btn btn-gold text-xs px-3">
                        Play
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
