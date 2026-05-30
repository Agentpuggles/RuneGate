"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
}

export default function PortalShell({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", label: "Hub", icon: "[H]" },
    { href: "/games", label: "Arcade", icon: "[A]" },
    { href: "/leaderboard", label: "Ranks", icon: "[R]" },
    { href: "/music", label: "Music", icon: "[M]" },
    { href: "/search", label: "Search", icon: "[S]" },
    { href: "/chat", label: "Chat", icon: "[C]" },
    { href: "/profile", label: "Profile", icon: "[P]" },
    ...(user.username === "admin" ? [{ href: "/admin", label: "Admin", icon: "[!]" }] : []),
  ];

  const dn = user.displayName || user.username;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-guild-bg flex items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-guild-bg">
      {/* Top Header */}
      <header className="bg-guild-bg-header border-b-2 border-guild-border">
        {/* Marquee Banner */}
        <div className="marquee">
          <span className="marquee-content">
            ★ Welcome to RuneGate v2.0 ★ The realm awaits, brave adventurer ★ New: Bard's Hall with 16 music stations ★ Compete on the Leaderboard ★ Join the Chat Tavern ★
          </span>
        </div>

        {/* Logo & Title */}
        <div className="border-b border-guild-border">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-4 group">
              <div className="icon-box icon-box-gold text-xl">
                ⚔
              </div>
              <div>
                <h1 className="font-rune text-2xl text-guild-gold glow-gold tracking-wider">
                  RUNEGATE
                </h1>
                <p className="font-mono text-2xs text-guild-text-dim">
                  [ Fantasy Portal v2.0 ]
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {/* User Info Box */}
              <div className="frame frame-gold px-3 py-1 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="avatar-frame avatar-frame-gold w-8 h-8">
                    <div className="avatar-inner w-full h-full flex items-center justify-center text-sm">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>{user.avatar === "wizard" ? "🧙" : "👤"}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-guild-text-light">{dn}</div>
                    <div className="text-2xs text-guild-gold">Lv.{user.level} • {user.gold} Gold</div>
                  </div>
                </div>
              </div>

              <button onClick={handleLogout} className="btn btn-blood text-2xs">
                [X] Exit
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="nav-bar max-w-6xl mx-auto px-4">
          {navItems.map((item, index) => (
            <span key={item.href}>
              <Link
                href={item.href}
                className={`nav-item ${pathname.startsWith(item.href) ? "active" : ""}`}
              >
                <span className="text-guild-gold">{item.icon}</span> {item.label}
              </Link>
              {index < navItems.length - 1 && <span className="nav-divider">|</span>}
            </span>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer mt-8">
        <div className="divider-ornate" />
        <p className="text-guild-gold">
          ★ RuneGate Fantasy Portal ★
        </p>
        <p className="mt-1">
          © MMXXVI • All Rights Reserved • Best viewed in 1024x768
        </p>
        <div className="divider-gold my-2 max-w-xs mx-auto" />
        <p className="font-mono">
          [ Visitors: <span className="text-guild-gold">{Math.floor(Math.random() * 10000)}</span> ]
        </p>
      </footer>
    </div>
  );
}
