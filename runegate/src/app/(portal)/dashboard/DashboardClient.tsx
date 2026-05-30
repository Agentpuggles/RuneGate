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
    icon: "game",
    desc: "Play enchanted artifacts, retro spellcraft, and digital games.",
    img: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=200&fit=crop",
    color: "emerald"
  },
  {
    href: "/leaderboard",
    title: "Leaderboard",
    sub: "Hall of Fame",
    icon: "trophy",
    desc: "See who tops the charts. Most played games and rankings.",
    img: "https://images.unsplash.com/photo-1461896836934-bd45ba48a796?w=400&h=200&fit=crop",
    color: "gold"
  },
  {
    href: "/music",
    title: "Bard's Hall",
    sub: "Music & Ambience",
    icon: "music",
    desc: "Listen to lofi, fantasy, epic, and ambient music streams.",
    img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=200&fit=crop",
    color: "amethyst"
  },
  {
    href: "/search",
    title: "Arcane Search",
    sub: "Knowledge Proxy",
    icon: "search",
    desc: "Search the digital cosmos through magical scroll and portal.",
    img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=200&fit=crop",
    color: "sapphire"
  },
  {
    href: "/chat",
    title: "Chat Tavern",
    sub: "The Gathering Hall",
    icon: "message",
    desc: "Enter the tavern. Share tales, plan raids, and speak with allies.",
    img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=200&fit=crop",
    color: "ruby"
  },
  {
    href: "/profile",
    title: "Character Sheet",
    sub: "Your Legend",
    icon: "user",
    desc: "View stats, customize avatar, title, biography, and profile image.",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=200&fit=crop",
    color: "emerald"
  },
];

const colorMap: Record<string, string> = {
  gold: "from-portal-gold/20 to-portal-gold-dark/10",
  emerald: "from-portal-emerald/20 to-portal-emerald-dark/10",
  sapphire: "from-portal-sapphire/20 to-portal-sapphire-light/10",
  amethyst: "from-portal-amethyst/20 to-portal-amethyst-light/10",
  ruby: "from-portal-ruby/20 to-portal-ruby-light/10",
};

const iconMap: Record<string, string> = {
  game: "",
  trophy: "",
  music: "",
  search: "",
  message: "",
  user: "",
};

export default function DashboardClient({ user, stats }: { user: User; stats: Stats }) {
  const [greeting, setGreeting] = useState("Welcome");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const h = new Date().getHours();
    setGreeting(
      h < 6 ? "The night is dark" :
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

  const totalInteractions = stats.gamesPlayed + stats.messagesSent + stats.searchesMade;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hero Welcome Card */}
      <div className="panel panel-gold">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&h=300&fit=crop"
            alt=""
            className="w-full h-48 object-cover"
            style={{ filter: "brightness(0.4)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-portal-bg-base/80 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center px-6 lg:px-10">
            <div className="flex items-center gap-5">
              <div className="avatar avatar-lg animate-glow">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="" />
                ) : (
                  <span className="text-2xl">
                    {user.avatar === "wizard" ? "" : ""}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-rune text-portal-gold mb-1">
                  {greeting}, {dn}
                </h1>
                <p className="text-sm text-portal-text-secondary">
                  {user.title} <span className="text-portal-text-dim mx-2">|</span> {user.rank} <span className="text-portal-text-dim mx-2">|</span> Level {user.level}
                </p>
                <div className="mt-3 w-64 lg:w-80">
                  <div className="progress-bar progress-gold">
                    <div className="progress-fill" style={{ width: `${xpProg}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1.5">
                    <span className="text-portal-text-muted">{user.xp.toLocaleString()} XP</span>
                    <span className="text-portal-gold font-mono">{user.gold.toLocaleString()} Gold</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel-body">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: "Games", value: stats.gamesPlayed, icon: "" },
              { label: "Messages", value: stats.messagesSent, icon: "" },
              { label: "Searches", value: stats.searchesMade, icon: "" },
              { label: "Favorites", value: stats.favoriteCount, icon: "" },
              { label: "Notes", value: stats.noteCount, icon: "" },
            ].map((stat) => (
              <div key={stat.label} className="stat-box">
                <div className="label">{stat.icon} {stat.label}</div>
                <div className="value">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Realm Tiles */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-rune text-portal-gold">Choose Your Realm</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-portal-border to-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {realms.map((realm) => (
            <Link key={realm.href} href={realm.href} className="rtile group">
              <div className="relative">
                <img
                  src={realm.img}
                  alt=""
                  className="rimg"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.background = "linear-gradient(135deg, #141a2e, #0a0e1a)";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-portal-bg-base via-transparent to-transparent opacity-80" />
                <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[realm.color]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="btn btn-primary text-sm shadow-lg">Enter Realm</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{iconMap[realm.icon]}</span>
                    <div>
                      <h3 className="text-base font-semibold text-portal-text-primary group-hover:text-portal-gold transition-colors">
                        {realm.title}
                      </h3>
                      <p className="text-xs text-portal-text-muted font-mono uppercase tracking-wide">
                        {realm.sub}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-portal-text-muted mt-2 line-clamp-1">
                    {realm.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Realm Bulletin */}
      <div className="panel">
        <div className="panel-header">
          <span className="icon"></span>
          <h3>Realm Bulletin</h3>
        </div>
        <div className="panel-body">
          <div className="space-y-3">
            {[
              { text: "Bard's Hall now open - 16 music stations!", badge: "NEW", variant: "arcade" },
              { text: "Leaderboard & ranking system added", badge: "NEW", variant: "strategy" },
              { text: "Profile image upload now supported", badge: "NEW", variant: "rpg" },
              { text: "Arcane Search improved with better URL resolution", badge: "FIX", variant: "puzzle" },
              { text: "10 playable games in the Arcade Realm", badge: null, variant: null },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 py-2">
                  {item.badge && (
                    <span className={`badge badge-${item.variant}`}>
                      {item.badge}
                    </span>
                  )}
                  <span className="text-sm text-portal-text-secondary">{item.text}</span>
                </div>
                {i < 4 && <div className="divider" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel">
          <div className="panel-header">
            <span className="icon"></span>
            <h3>Quick Actions</h3>
          </div>
          <div className="panel-body">
            <div className="grid grid-cols-2 gap-3">
              <Link href="/games" className="btn btn-primary justify-start">
                Play a Game
              </Link>
              <Link href="/chat" className="btn btn-secondary justify-start">
                Join Chat
              </Link>
              <Link href="/music" className="btn btn-secondary justify-start">
                Open Music
              </Link>
              <Link href="/profile" className="btn btn-secondary justify-start">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="icon"></span>
            <h3>Portal Stats</h3>
          </div>
          <div className="panel-body space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-portal-text-muted">Total Interactions</span>
              <span className="text-lg font-bold text-portal-text-primary font-mono">{totalInteractions}</span>
            </div>
            <div className="divider" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-portal-text-muted">Member Since</span>
              <span className="text-sm text-portal-text-secondary">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="divider" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-portal-text-muted">Current Rank</span>
              <span className="badge badge-strategy">{user.rank}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
