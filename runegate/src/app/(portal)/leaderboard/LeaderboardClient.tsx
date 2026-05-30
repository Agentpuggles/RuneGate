"use client";

import { useState, useEffect } from "react";
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
    <div className="space-y-4">
      {/* Header */}
      <div className="frame">
        <div className="frame-header">
          <span>🏆</span> <h3>Leaderboard — Hall of Fame</h3>
        </div>
      </div>

      {/* Most Played */}
      <div className="frame">
        <div className="frame-header">
          <span>🔥</span> <h3>Most Played Games</h3>
        </div>
        <div className="frame-inner p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="loader" />
            </div>
          ) : mostPlayed.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎮</div>
              <p className="text-guild-text-dim text-sm">No games played yet. Be the first!</p>
              <Link href="/games" className="btn btn-gold mt-4">
                [🎮] Go to Arcade
              </Link>
            </div>
          ) : (
            <table className="guild-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>Rank</th>
                  <th style={{ width: "50px" }}>Icon</th>
                  <th>Game</th>
                  <th style={{ width: "100px" }}>Category</th>
                  <th style={{ width: "80px" }}>Plays</th>
                </tr>
              </thead>
              <tbody>
                {mostPlayed.map((game, i) => (
                  <tr key={game.id} className="group hover:bg-guild-gold hover:bg-opacity-5">
                    <td className="text-center">
                      <div
                        className="w-8 h-8 mx-auto flex items-center justify-center font-bold"
                        style={{
                          background: i === 0 ? "linear-gradient(180deg, #d4af37, #996515)"
                            : i === 1 ? "linear-gradient(180deg, #888, #555)"
                            : i === 2 ? "linear-gradient(180deg, #b87333, #8b4513)"
                            : "transparent",
                          color: i < 3 ? "#000" : "#666",
                          border: i < 3 ? "none" : "1px solid #333",
                        }}
                      >
                        {i + 1}
                      </div>
                    </td>
                    <td className="text-2xl text-center">{game.thumbnail}</td>
                    <td>
                      <Link href={`/games/${game.id}`} className="font-bold text-guild-text-light hover:text-guild-gold transition-colors">
                        {game.title}
                      </Link>
                      <p className="text-xs text-guild-text-dim"></p>
                    </td>
                    <td>
                      <span className="badge badge-emerald">{game.category}</span>
                    </td>
                    <td className="text-center font-mono text-guild-gold font-bold">{game.playCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Rank Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="frame">
          <div className="frame-header">
            <span>⚔</span> <h3>Earn Ranks</h3>
          </div>
          <div className="frame-inner">
            <p className="text-xs text-guild-text-dim mb-3">
              Every game you play earns XP and gold. Compete for the top!
            </p>
            <table className="guild-table">
              <tbody>
                {[
                  { level: 1, name: "Initiate", color: "#666655" },
                  { level: 5, name: "Apprentice", color: "#00cc66" },
                  { level: 10, name: "Adept", color: "#3366cc" },
                  { level: 20, name: "Veteran", color: "#9933cc" },
                  { level: 50, name: "Legend", color: "#ff9900" },
                ].map((rank) => (
                  <tr key={rank.level}>
                    <td className="w-12 text-center">
                      <div
                        className="w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold text-black"
                        style={{ background: rank.color }}
                      >
                        {rank.level}
                      </div>
                    </td>
                    <td>{rank.name} — Play {rank.level} game{rank.level > 1 ? "s" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link href="/games" className="btn btn-gold w-full mt-4 text-center">
              [🎮] Go to Arcade
            </Link>
          </div>
        </div>

        <div className="frame">
          <div className="frame-header">
            <span>📊</span> <h3>Portal Statistics</h3>
          </div>
          <div className="frame-inner">
            <table className="guild-table">
              <tbody>
                <tr>
                  <td className="text-guild-text-dim">Total Games Available</td>
                  <td className="text-right font-bold font-mono">10</td>
                </tr>
                <tr>
                  <td className="text-guild-text-dim">Music Stations</td>
                  <td className="text-right font-bold font-mono">16</td>
                </tr>
                <tr>
                  <td className="text-guild-text-dim">Chat Channels</td>
                  <td className="text-right font-bold font-mono">6</td>
                </tr>
                <tr>
                  <td className="text-guild-text-dim">Avatars Available</td>
                  <td className="text-right font-bold font-mono">16</td>
                </tr>
                <tr>
                  <td className="text-guild-text-dim">Titles Available</td>
                  <td className="text-right font-bold font-mono">16</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
