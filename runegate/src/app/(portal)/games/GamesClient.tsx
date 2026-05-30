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
  { id: "all", label: "All Games", icon: "sparkles" },
  { id: "puzzle", label: "Puzzle", icon: "puzzle" },
  { id: "strategy", label: "Strategy", icon: "chess" },
  { id: "rpg", label: "RPG", icon: "sword" },
  { id: "arcade", label: "Arcade", icon: "joystick" },
];

const iconMap: Record<string, string> = {
  all: "",
  sparkles: "",
  puzzle: "",
  chess: "",
  sword: "",
  joystick: "",
};

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
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-rune text-portal-gold">Games Realm</h1>
          <p className="text-sm text-portal-text-muted">Arcane Arcade - {games.length} games available</p>
        </div>
      </div>

      {/* Recently Played */}
      {recent.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <span className="icon"></span>
            <h3>Recently Played</h3>
          </div>
          <div className="panel-body">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recent.slice(0, 8).map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="flex-shrink-0 w-36 group"
                >
                  <div className="relative rounded-lg overflow-hidden mb-2">
                    <img
                      src={game.image || ""}
                      alt=""
                      className="w-full h-20 object-cover transition-transform group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-portal-bg-base/0 group-hover:bg-portal-bg-base/30 transition-colors" />
                  </div>
                  <div className="text-sm font-medium text-portal-text-primary group-hover:text-portal-gold transition-colors truncate">
                    {game.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="panel">
        <div className="panel-header">
          <span className="icon"></span>
          <h3>Browse Games</h3>
        </div>
        <div className="panel-body space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a game..."
              className="input flex-1"
            />
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`btn ${favoritesOnly ? "btn-primary" : "btn-secondary"} flex-shrink-0`}
            >
              {favoritesOnly ? "" : ""} Favorites
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`btn ${activeCategory === cat.id ? "btn-primary" : "btn-ghost"}`}
              >
                {iconMap[cat.icon]} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredGames.map((game) => (
          <div key={game.id} className="gcard group">
            <div className="relative">
              <img
                src={game.image || ""}
                alt={game.title}
                className="gimg"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                  (e.target as HTMLImageElement).style.background =
                    "linear-gradient(135deg, #141a2e, #0a0e1a)";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl drop-shadow-lg opacity-40 group-hover:opacity-60 transition-opacity">
                  {game.thumbnail}
                </span>
              </div>
              <div className="gover">
                <Link href={`/games/${game.id}`} className="btn btn-primary animate-scale-in">
                  Play Now
                </Link>
              </div>
              <div className={`badge badge-${game.category} absolute top-3 right-3 text-2xs`}>
                {game.category}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(game.id, game.isFavorite);
                }}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-portal-bg-base/60 backdrop-blur-sm text-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-portal-border/50 hover:border-portal-gold/50"
              >
                {game.isFavorite ? "" : ""}
              </button>
            </div>
            <div className="card-body">
              <Link href={`/games/${game.id}`}>
                <h3 className="text-base font-semibold text-portal-text-primary group-hover:text-portal-gold transition-colors">
                  {game.title}
                </h3>
              </Link>
              <p className="text-xs text-portal-text-muted mt-1.5 line-clamp-2">
                {game.description}
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-portal-border/30">
                <span className="text-xs text-portal-text-dim">
                  {game.controls === "keyboard" ? "" : ""} {game.controls}
                </span>
                <div className="flex items-center gap-3 text-xs text-portal-text-dim">
                  <span title="Rating"> {game.rating.toFixed(1)}</span>
                  <span title="Plays"> {game.plays}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 opacity-30"></div>
          <p className="text-portal-text-muted">No games found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
              setFavoritesOnly(false);
            }}
            className="btn btn-secondary mt-4"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
