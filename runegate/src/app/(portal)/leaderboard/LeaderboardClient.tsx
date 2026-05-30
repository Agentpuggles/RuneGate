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

export default function LeaderboardClient() {
  const [mostPlayed, setMostPlayed] = useState<MostPlayedGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLB = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        if (data.mostPlayed) setMostPlayed(data.mostPlayed);
      } catch {
        // Handle error silently
      }
      setLoading(false);
    };
    fetchLB();
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-rune text-portal-gold">Leaderboard</h1>
          <p className="text-sm text-portal-text-muted">Hall of Fame</p>
        </div>
      </div>

      {/* Most Played */}
      <div className="panel">
        <div className="panel-header">
          <span className="icon"></span>
          <h3>Most Played Games</h3>
        </div>
        <div className="panel-body">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loader" />
            </div>
          ) : mostPlayed.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4 opacity-30"></div>
              <p className="text-portal-text-muted">No games played yet. Be the first!</p>
              <Link href="/games" className="btn btn-primary mt-4">
                Go to Arcade
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {mostPlayed.map((game, i) => (
                <Link key={game.id} href={`/games/${game.id}`} className="leaderboard-row group">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      i < 3 ? "shadow-lg" : "bg-portal-bg-elevated border border-portal-border"
                    }`}
                    style={
                      i === 0
                        ? { background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#0a0e1a" }
                        : i === 1
                          ? { background: "linear-gradient(135deg, #94a3b8, #64748b)", color: "#fff" }
                          : i === 2
                            ? { background: "linear-gradient(135deg, #c2410c, #9a3412)", color: "#fff" }
                            : {}
                    }
                  >
                    {i + 1}
                  </div>
                  <img src={game.image || ""} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-portal-text-primary group-hover:text-portal-gold transition-colors">
                      {game.thumbnail} {game.title}
                    </div>
                    <div className="badge badge-arcade mt-1">{game.category}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-portal-gold font-mono">{game.playCount}</div>
                    <div className="text-xs text-portal-text-dim">plays</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="panel">
          <div className="panel-header">
            <span className="icon"></span>
            <h3>Earn Ranks</h3>
          </div>
          <div className="panel-body">
            <p className="text-sm text-portal-text-secondary mb-4">
              Every game you play earns XP and gold. Compete for the top of the leaderboard!
            </p>
            <div className="space-y-3">
              {[
                { level: 1, name: "Initiate", color: "#64748b" },
                { level: 5, name: "Apprentice", color: "#10b981" },
                { level: 10, name: "Adept", color: "#3b82f6" },
                { level: 20, name: "Veteran", color: "#a855f7" },
                { level: 50, name: "Legend", color: "#f59e0b" },
              ].map((rank) => (
                <div key={rank.level} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: rank.color }}
                  >
                    {rank.level}
                  </div>
                  <span className="text-sm text-portal-text-secondary">{rank.name} — Play {rank.level} game{rank.level > 1 ? "s" : ""}</span>
                </div>
              ))}
            </div>
            <Link href="/games" className="btn btn-primary w-full mt-6">
              Go to Arcade
            </Link>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="icon"></span>
            <h3>Portal Stats</h3>
          </div>
          <div className="panel-body space-y-4">
            {[
              { label: "Total Games Available", value: "10" },
              { label: "Music Stations", value: "16" },
              { label: "Chat Channels", value: "6" },
              { label: "Avatars", value: "16" },
              { label: "Titles", value: "16" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between items-center">
                  <span className="text-portal-text-muted">{stat.label}</span>
                  <span className="text-lg font-bold text-portal-text-primary font-mono">{stat.value}</span>
                </div>
                {i < 4 && <div className="divider" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
