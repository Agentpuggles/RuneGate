"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Game {
  id: string; title: string; slug: string; description: string; category: string;
  thumbnail: string; image: string; embedUrl: string; controls: string;
  rating: number; plays: number; isFavorite: boolean;
}

const cats = [
  { id: "all", label: "All Games", icon: "✨" },
  { id: "puzzle", label: "Puzzle", icon: "🧩" },
  { id: "strategy", label: "Strategy", icon: "♟️" },
  { id: "rpg", label: "RPG", icon: "⚔️" },
  { id: "arcade", label: "Arcade", icon: "🕹️" },
];

const cb: Record<string, string> = { puzzle: "b-puzzle", strategy: "b-strategy", rpg: "b-rpg", arcade: "b-arcade" };

export default function GamesClient() {
  const [games, setGames] = useState<Game[]>([]);
  const [recent, setRecent] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [favOnly, setFavOnly] = useState(false);

  const fetchGames = useCallback(async () => {
    try {
      const res = await fetch("/api/games");
      const data = await res.json();
      if (data.games) {
        setGames(data.games);
        const ids = data.recentGameIds || [];
        setRecent(ids.map((id: string) => data.games.find((g: Game) => g.id === id)).filter(Boolean));
      }
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchGames(); }, [fetchGames]);

  const toggleFav = async (gameId: string, isFav: boolean) => {
    try {
      await fetch("/api/games/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gameId, action: isFav ? "remove" : "add" }) });
      setGames((p) => p.map((g) => (g.id === gameId ? { ...g, isFavorite: !isFav } : g)));
    } catch {}
  };

  const filtered = games.filter((g) => {
    if (activeCat !== "all" && g.category !== activeCat) return false;
    if (favOnly && !g.isFavorite) return false;
    if (search) { const q = search.toLowerCase(); return g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q); }
    return true;
  });

  if (loading) return <div className="flex justify-center py-20"><div className="rloader" /></div>;

  return (
    <div className="anim-in">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl t-title flex items-center gap-2">🎮 Games Realm</h1>
        <span className="t-dim text-xs font-mono">Arcane Arcade</span>
      </div>

      {/* Recently played */}
      {recent.length > 0 && (
        <div className="fp mb-4">
          <div className="fp-head"><span>⏱</span><h3>Recently Played</h3></div>
          <div className="fp-body">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {recent.slice(0, 8).map((g) => (
                <Link key={g.id} href={`/games/${g.id}`} className="flex-shrink-0 w-32 group">
                  <img src={g.image || ""} alt="" className="w-full h-20 rounded object-cover mb-1.5 group-hover:brightness-125 transition-all" loading="lazy" />
                  <div className="text-xs font-medium t-cream truncate group-hover:t-gold transition-colors">{g.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="fp mb-4">
        <div className="fp-head"><span>🔍</span><h3>Browse Games</h3></div>
        <div className="fp-body">
          <div className="flex gap-3 mb-3">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for a spell..." className="inp flex-1" />
            <button onClick={() => setFavOnly(!favOnly)} className={`btn ${favOnly ? "btn-g" : "btn-p"} text-xs cursor-pointer`}>
              ⭐ {favOnly ? "All" : "Favorites"}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cats.map((c) => (
              <button key={c.id} onClick={() => setActiveCat(c.id)}
                className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-all ${
                  activeCat === c.id ? "t-gold border" : "t-dim hover:t-cream border border-transparent"
                }`}
                style={activeCat === c.id ? { background: "rgba(201,168,76,0.1)", borderColor: "var(--gold-dim)" } : {}}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((g) => (
          <div key={g.id} className="gcard group">
            <div className="relative">
              <img src={g.image || ""} alt={g.title} className="gimg" loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = ""; (e.target as HTMLImageElement).style.background = "linear-gradient(135deg, #1a2040, #0e1220)"; }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl drop-shadow-lg">{g.thumbnail}</span>
              </div>
              <div className="gover">
                <Link href={`/games/${g.id}`} className="btn btn-g text-xs anim-in">▶ Play</Link>
              </div>
              <div className={`badge absolute top-2 right-2 text-[9px] ${cb[g.category] || "b-arcade"}`}>{g.category}</div>
              <button onClick={(e) => { e.preventDefault(); toggleFav(g.id, g.isFavorite); }}
                className="absolute top-2 left-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-125 cursor-pointer bg-black/40 rounded-full w-6 h-6 flex items-center justify-center">
                {g.isFavorite ? "⭐" : "☆"}
              </button>
            </div>
            <div className="p-3">
              <Link href={`/games/${g.id}`}><h3 className="font-semibold t-cream text-sm group-hover:t-gold transition-colors">{g.title}</h3></Link>
              <p className="text-[10px] t-dim mt-1 line-clamp-2">{g.description}</p>
              <div className="flex items-center justify-between text-[9px] t-dim mt-2">
                <span>🎮 {g.controls}</span>
                <span>⭐ {g.rating.toFixed(1)}</span>
                <span>👥 {g.plays}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 t-dim"><div className="text-3xl mb-2">🔮</div><p className="font-mono text-sm">No spells found.</p></div>
      )}
    </div>
  );
}
