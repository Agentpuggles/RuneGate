"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  displayName: string | null;
  avatar: string;
  profileImage: string | null;
  title: string;
  rank: string;
  level: number;
  xp: number;
  gold: number;
  createdAt: string | Date;
}
interface Stats {
  gamesPlayed: number;
  messagesSent: number;
  searchesMade: number;
  favoriteCount: number;
  noteCount: number;
}

const realms = [
  {
    href: "/games",
    title: "Games Realm",
    sub: "Arcane Arcade",
    icon: "🎮",
    desc: "Play enchanted games and digital spellcraft.",
    color: "emerald"
  },
  {
    href: "/leaderboard",
    title: "Leaderboard",
    sub: "Hall of Fame",
    icon: "🏆",
    desc: "See who tops the charts in the realm.",
    color: "gold"
  },
  {
    href: "/music",
    title: "Bard's Hall",
    sub: "Music & Ambience",
    icon: "🎵",
    desc: "Listen to lofi, fantasy, and epic music streams.",
    color: "amethyst"
  },
  {
    href: "/search",
    title: "Arcane Search",
    sub: "Knowledge Proxy",
    icon: "🔍",
    desc: "Search the cosmos through magical portals.",
    color: "sapphire"
  },
  {
    href: "/chat",
    title: "Chat Tavern",
    sub: "The Gathering Hall",
    icon: "💬",
    desc: "Enter the tavern. Share tales with allies.",
    color: "blood"
  },
  {
    href: "/profile",
    title: "Character Sheet",
    sub: "Your Legend",
    icon: "📜",
    desc: "Customize your avatar, title, and profile.",
    color: "gold"
  },
];

export default function DashboardClient({ user, stats }: { user: User; stats: Stats }) {
  const [greeting, setGreeting] = useState("Welcome");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const h = new Date().getHours();
    setGreeting(
      h < 6 ? "Good evening, night owl" :
      h < 12 ? "Good morrow" :
      h < 18 ? "Well met" :
      "Good evening"
    );
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center py-20">
        <div className="loader" />
      </div>
    );
  }

  const dn = user.displayName || user.username;
  const xpProg = Math.min((user.xp % 1000) / 10, 100);

  return (
    <div className="space-y-4">
      {/* Welcome Header */}
      <div className="frame frame-gold">
        <div className="frame-header">
          <span>⚔</span> <h3>{greeting}, {dn}</h3>
        </div>
        <div className="frame-inner">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            {/* Avatar */}
            <div className="avatar-frame avatar-frame-gold w-16 h-16">
              <div className="avatar-inner w-full h-full flex items-center justify-center text-3xl">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{user.avatar === "wizard" ? "🧙" : "👤"}</span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="text-lg font-rune text-guild-gold">{dn}</div>
              <div className="font-mono text-xs text-guild-text-dim">
                {user.title} • {user.rank}
              </div>
              <div className="mt-2">
                <div className="stat-row" style={{ borderRadius: 0 }}>
                  <span className="stat-label">LEVEL {user.level}</span>
                  <span className="stat-value text-guild-gold">{user.xp.toLocaleString()} XP</span>
                </div>
                <div className="bar bar-xp">
                  <div className="bar-fill" style={{ width: `${xpProg}%` }} />
                  <span className="bar-text">{xpProg.toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Gold counter */}
            <div className="counter">
              💰 {user.gold.toLocaleString()} Gold
            </div>
          </div>

          <div className="divider-double" />

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { l: "Games", v: stats.gamesPlayed, i: "🎮" },
              { l: "Messages", v: stats.messagesSent, i: "💬" },
              { l: "Searches", v: stats.searchesMade, i: "🔍" },
              { l: "Favorites", v: stats.favoriteCount, i: "⭐" },
              { l: "Notes", v: stats.noteCount, i: "📜" },
            ].map((s) => (
              <div key={s.l} className="frame p-2 text-center">
                <div className="text-lg">{s.i}</div>
                <div className="text-base font-bold text-guild-text-light font-mono">{s.v}</div>
                <div className="text-2xs text-guild-text-dim uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Realm Links */}
      <div className="frame">
        <div className="frame-header">
          <span>🗺</span> <h3>Choose Your Realm</h3>
        </div>
        <div className="frame-inner">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {realms.map((r) => (
              <Link key={r.href} href={r.href} className="frame hover:border-guild-gold transition-colors group">
                <div className="p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="icon-box text-lg group-hover:border-guild-gold transition-colors">
                      {r.icon}
                    </div>
                    <div>
                      <h4 className="font-rune text-sm text-guild-gold group-hover:glow-gold transition-all">
                        {r.title}
                      </h4>
                      <p className="font-mono text-2xs text-guild-text-dim">
                        [{r.sub}]
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-guild-text-dim">
                    {r.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bulletin Board */}
      <div className="frame">
        <div className="frame-header">
          <span>📜</span> <h3>Realm Bulletin</h3>
        </div>
        <div className="frame-inner">
          <table className="guild-table">
            <tbody>
              {[
                { text: "Bard's Hall now open — 16 music stations!", badge: "NEW" },
                { text: "Leaderboard & ranking system added", badge: "NEW" },
                { text: "Profile image upload now supported", badge: "NEW" },
                { text: "Arcane Search improved", badge: "UPD" },
                { text: "10 playable games in Arcade Realm", badge: "" },
              ].map((item, i) => (
                <tr key={i}>
                  <td className="w-12 text-center">
                    <span className="text-guild-gold">★</span>
                  </td>
                  <td>
                    {item.badge && (
                      <span className={`badge badge-gold mr-2`} style={{ fontSize: "9px" }}>
                        {item.badge}
                      </span>
                    )}
                    <span className="text-sm">{item.text}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <div className="frame">
          <div className="frame-header">
            <span>⚡</span> <h3>Quick Actions</h3>
          </div>
          <div className="frame-inner">
            <div className="space-y-2">
              <Link href="/games" className="btn btn-gold w-full text-center text-xs">
                🎮 Play a Game
              </Link>
              <Link href="/chat" className="btn btn-std w-full text-center text-xs">
                💬 Join Chat
              </Link>
            </div>
          </div>
        </div>

        <div className="frame">
          <div className="frame-header">
            <span>📊</span> <h3>Portal Stats</h3>
          </div>
          <div className="frame-inner">
            <div className="stat-row">
              <span className="stat-label">Total Interactions</span>
              <span className="stat-value text-guild-gold">
                {stats.gamesPlayed + stats.messagesSent + stats.searchesMade}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Member Since</span>
              <span className="stat-value text-xs">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="stat-row" style={{ borderBottom: "none" }}>
              <span className="stat-label">Current Rank</span>
              <span className="badge badge-gold">{user.rank}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
