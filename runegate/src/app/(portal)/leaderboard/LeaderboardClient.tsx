"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface MostPlayedGame {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  image: string;
  category: string;
  playCount: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  date: string;
}

export default function LeaderboardClient() {
  const [mostPlayed, setMostPlayed] = useState<MostPlayedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"played" | "scores">("played");

  useEffect(() => {
    const fetchLB = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        if (data.mostPlayed) setMostPlayed(data.mostPlayed);
      } catch {}
      setLoading(false);
    };
    fetchLB();
  }, []);

  const catBadge: Record<string, string> = { puzzle: "b-puzzle", strategy: "b-strategy", rpg: "b-rpg", arcade: "b-arcade", multiplayer: "b-multi" };

  return (
    <div className="anim-in">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl t-title flex items-center gap-2">🏆 Leaderboard</h1>
        <span className="t-dim text-xs font-mono">Hall of Fame</span>
      </div>

      {/* Top section: Most Played */}
      <div className="fp mb-4">
        <div className="fp-head"><span>🔥</span><h3>Most Played</h3></div>
        <div className="fp-body">
          {loading ? (
            <div className="flex justify-center py-8"><div className="rloader" /></div>
          ) : mostPlayed.length === 0 ? (
            <div className="text-center py-8 t-dim text-sm">No games played yet. Be the first!</div>
          ) : (
            <div className="space-y-2">
              {mostPlayed.map((game, i) => (
                <Link key={game.id} href={`/games/${game.id}`} className="lb-row lb-top group">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: i === 0 ? "linear-gradient(135deg, #c9a84c, #ffd84d)" : i === 1 ? "linear-gradient(135deg, #888, #aaa)" : i === 2 ? "linear-gradient(135deg, #8a6d3b, #b8935a)" : "var(--bg-dark)",
                      color: i < 3 ? "#1a1510" : "var(--text-dim)",
                      border: "1px solid var(--border-light)",
                    }}>
                    {i + 1}
                  </div>
                  <img src={game.image || ""} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold t-cream group-hover:t-gold transition-colors">{game.thumbnail} {game.title}</div>
                    <div className="text-[10px] t-dim">{game.category}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold t-gold">{game.playCount}</div>
                    <div className="text-[9px] t-dim">plays</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Achievements / Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="fp">
          <div className="fp-head"><span>⚔️</span><h3>Play Games to Earn Ranks</h3></div>
          <div className="fp-body">
            <p className="text-xs t-dim mb-3">Every game you play earns XP and gold. Compete for the top of the leaderboard!</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#c9a84c", color: "#1a1510" }}>1</span>
                <span className="t-cream">Initiate — Play 1 game</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#5da06a", color: "#fff" }}>5</span>
                <span className="t-cream">Apprentice — Play 5 games</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#5882b0", color: "#fff" }}>10</span>
                <span className="t-cream">Adept — Play 10 games</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#8b6cc4", color: "#fff" }}>20</span>
                <span className="t-cream">Veteran — Play 20 games</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#c48840", color: "#fff" }}>50</span>
                <span className="t-cream">Legend — Play 50 games</span>
              </div>
            </div>
            <Link href="/games" className="btn btn-g mt-4 text-xs w-full justify-center">🎮 Go to Arcade</Link>
          </div>
        </div>

        <div className="fp">
          <div className="fp-head"><span>📊</span><h3>Quick Stats</h3></div>
          <div className="fp-body space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="t-dim">Total Games Available</span>
              <span className="t-cream font-bold">10</span>
            </div>
            <hr className="divider" />
            <div className="flex justify-between items-center text-sm">
              <span className="t-dim">Music Stations</span>
              <span className="t-cream font-bold">16</span>
            </div>
            <hr className="divider" />
            <div className="flex justify-between items-center text-sm">
              <span className="t-dim">Chat Channels</span>
              <span className="t-cream font-bold">6</span>
            </div>
            <hr className="divider" />
            <div className="flex justify-between items-center text-sm">
              <span className="t-dim">Avatars</span>
              <span className="t-cream font-bold">16</span>
            </div>
            <hr className="divider" />
            <div className="flex justify-between items-center text-sm">
              <span className="t-dim">Titles</span>
              <span className="t-cream font-bold">16</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
