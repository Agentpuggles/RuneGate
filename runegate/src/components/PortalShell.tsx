"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface User {
  id: string; username: string; displayName: string | null; avatar: string;
  profileImage: string | null; title: string; rank: string; level: number; xp: number; gold: number;
}

export default function PortalShell({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", label: "Hub", icon: "🏰" },
    { href: "/games", label: "Arcade", icon: "🎮" },
    { href: "/leaderboard", label: "Ranks", icon: "🏆" },
    { href: "/music", label: "Bard's Hall", icon: "🎵" },
    { href: "/search", label: "Search", icon: "🔍" },
    { href: "/chat", label: "Tavern", icon: "💬" },
    { href: "/profile", label: "Profile", icon: "👤" },
  ];

  const dn = user.displayName || user.username;

  if (!mounted) return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-dark)" }}><div className="rloader" /></div>;

  return (
    <div className="min-h-screen bg-realm">
      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-40" style={{ background: "linear-gradient(180deg, #0d1628, #0b1020)" }}>
        <div className="h-0.5" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        <div className="border-b-2" style={{ borderColor: "var(--border-gold)" }}>
          <div className="max-w-7xl mx-auto px-3 h-11 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <span className="text-lg group-hover:anim-float">🌀</span>
              <span className="font-['MedievalSharp'] text-base text-shimmer hidden sm:block">RUNEGATE</span>
            </Link>

            <nav className="hidden lg:flex items-center">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}
                  className={`ntab ${pathname.startsWith(item.href) ? "on" : ""}`}>
                  <span className="mr-1">{item.icon}</span>{item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-light)" }}>
                <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center text-xs"
                  style={{ background: "linear-gradient(135deg, var(--gold-dim), var(--brown))" }}>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.avatar === "wizard" ? "🧙" : "👤"}</span>
                  )}
                </div>
                <span className="text-[11px] t-cream font-medium">{dn}</span>
                <span className="text-[10px] t-gold">💰{user.gold}</span>
              </div>
              <button onClick={() => setNavOpen(!navOpen)} className="lg:hidden p-1 rounded t-dim hover:t-cream cursor-pointer">{navOpen ? "✕" : "☰"}</button>
              <button onClick={handleLogout} className="hidden md:block text-[10px] t-dim hover:text-red-400 px-2 py-1 rounded cursor-pointer">Exit</button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setNavOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute top-12 left-0 right-0 p-3 space-y-1 anim-in" style={{ background: "var(--bg-mid)", borderBottom: "2px solid var(--border-gold)" }}
            onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setNavOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm cursor-pointer ${pathname.startsWith(item.href) ? "t-gold" : "t-dim hover:t-cream"}`}
                style={pathname.startsWith(item.href) ? { background: "rgba(201,168,76,0.1)" } : {}}>
                <span>{item.icon}</span><span>{item.label}</span>
              </Link>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-red-400 hover:bg-red-400/10 cursor-pointer">🚪 Exit Portal</button>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-7xl mx-auto px-3 py-4">{children}</main>

      <footer className="border-t mt-6" style={{ borderColor: "var(--border-main)" }}>
        <div className="max-w-7xl mx-auto px-3 py-3 flex items-center justify-between text-[10px] t-dim font-mono">
          <span>RuneGate v2.0 — Private Portal</span>
          <span>🌀 The realm awaits</span>
        </div>
      </footer>
    </div>
  );
}
