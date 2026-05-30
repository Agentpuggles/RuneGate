"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User { id: string; username: string; displayName: string | null; avatar: string; profileImage: string | null; title: string; rank: string; level: number; xp: number; gold: number; createdAt: string | Date; }
interface Stats { gamesPlayed: number; messagesSent: number; searchesMade: number; favoriteCount: number; noteCount: number; }

const realms = [
  { href: "/games", title: "Games Realm", sub: "Arcane Arcade", icon: "🎮",
    desc: "Play enchanted artifacts, retro spellcraft, and digital games.",
    img: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=200&fit=crop", color: "#5da06a" },
  { href: "/leaderboard", title: "Leaderboard", sub: "Hall of Fame", icon: "🏆",
    desc: "See who tops the charts. Most played games and rankings.",
    img: "https://images.unsplash.com/photo-1461896836934-bd45ba48a796?w=400&h=200&fit=crop", color: "#c9a84c" },
  { href: "/music", title: "Bard's Hall", sub: "Music & Ambience", icon: "🎵",
    desc: "Listen to lofi, fantasy, epic, and ambient music streams.",
    img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=200&fit=crop", color: "#8b6cc4" },
  { href: "/search", title: "Arcane Search", sub: "Knowledge Proxy", icon: "🔍",
    desc: "Search the digital cosmos through magical scroll and portal.",
    img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=200&fit=crop", color: "#5882b0" },
  { href: "/chat", title: "Chat Tavern", sub: "The Gathering Hall", icon: "💬",
    desc: "Enter the tavern. Share tales, plan raids, and speak with allies.",
    img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=200&fit=crop", color: "#c48840" },
  { href: "/profile", title: "Character Sheet", sub: "Your Legend", icon: "👤",
    desc: "View stats, customize avatar, title, biography, and profile image.",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=200&fit=crop", color: "#8a6d3b" },
];

export default function DashboardClient({ user, stats }: { user: User; stats: Stats }) {
  const [greeting, setGreeting] = useState("Welcome");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const h = new Date().getHours();
    setGreeting(h < 6 ? "The night is dark" : h < 12 ? "Good morrow" : h < 18 ? "Well met" : "Good evening");
  }, []);

  if (!mounted) return <div className="flex justify-center py-20"><div className="rloader" /></div>;

  const dn = user.displayName || user.username;
  const xpProg = (user.xp % 1000) / 10;

  return (
    <div className="anim-in">
      {/* Hero welcome */}
      <div className="fp fp-gold mb-4">
        <div className="relative overflow-hidden" style={{ borderRadius: "6px 6px 0 0" }}>
          <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=250&fit=crop" alt=""
            className="w-full h-36 object-cover" style={{ filter: "brightness(0.4)" }} />
          <div className="absolute inset-0 flex items-center px-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 anim-glow"
                style={{ border: "3px solid var(--border-gold)", background: "linear-gradient(135deg, var(--gold-dim), var(--brown))" }}>
                {user.profileImage ? (
                  <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    {user.avatar === "wizard" ? "🧙" : "👤"}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-['MedievalSharp'] t-gold mb-0.5">{greeting}, {dn}</h1>
                <p className="text-xs t-dim">{user.title} &bull; {user.rank} &bull; Level {user.level}</p>
                <div className="mt-1.5 w-64">
                  <div className="sbar sbar-gold"><div className="sbar-fill" style={{ width: `${xpProg}%` }} /></div>
                  <div className="flex justify-between text-[9px] t-dim mt-0.5">
                    <span>{user.xp.toLocaleString()} XP</span>
                    <span>💰 {user.gold} gold</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fp-body py-3">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { l: "Games", v: stats.gamesPlayed, i: "🎮" },
              { l: "Messages", v: stats.messagesSent, i: "💬" },
              { l: "Searches", v: stats.searchesMade, i: "🔍" },
              { l: "Favorites", v: stats.favoriteCount, i: "⭐" },
              { l: "Notes", v: stats.noteCount, i: "📜" },
            ].map((s) => (
              <div key={s.l} className="text-center p-2 rounded-md" style={{ background: "var(--bg-dark)", border: "1px solid var(--border-light)" }}>
                <div className="text-base">{s.i}</div>
                <div className="text-sm font-bold t-cream">{s.v}</div>
                <div className="text-[8px] t-dim uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Realm tiles with images */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="t-gold">✦</span>
          <h2 className="font-['MedievalSharp'] t-gold text-sm">Choose Your Realm</h2>
          <hr className="divider flex-1" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {realms.map((r) => (
            <Link key={r.href} href={r.href} className="rtile group">
              <img src={r.img} alt="" className="rimg" loading="lazy"
                style={{ filter: "brightness(0.5)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.background = "linear-gradient(135deg, #1a2040, #0e1220)"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="btn btn-g text-xs">Enter →</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <h3 className="font-semibold t-cream text-sm group-hover:t-gold transition-colors">{r.title}</h3>
                    <p className="text-[10px] font-mono uppercase" style={{ color: r.color }}>{r.sub}</p>
                  </div>
                </div>
                <p className="text-[10px] t-dim mt-1 line-clamp-1">{r.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bulletin */}
      <div className="fp">
        <div className="fp-head"><span>📜</span><h3>Realm Bulletin</h3></div>
        <div className="fp-body space-y-2">
          {[
            { text: "🎵 Bard's Hall now open — 16 music stations!", badge: "NEW", badgeClass: "b-arcade" },
            { text: "🏆 Leaderboard & ranking system added", badge: "NEW", badgeClass: "b-strategy" },
            { text: "📷 Profile image upload now supported", badge: "NEW", badgeClass: "b-rpg" },
            { text: "🔍 Arcane Search improved with better URL resolution", badge: "FIX", badgeClass: "b-puzzle" },
            { text: "🎮 10 playable games in the Arcade Realm", badge: "", badgeClass: "" },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 text-xs">
                {item.badge && <span className={`badge ${item.badgeClass}`}>{item.badge}</span>}
                <span className="t-cream">{item.text}</span>
              </div>
              {i < 4 && <hr className="divider" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
