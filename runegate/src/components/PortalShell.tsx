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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", label: "Portal Hub", icon: "home", emoji: "" },
    { href: "/games", label: "Games Realm", icon: "game", emoji: "" },
    { href: "/leaderboard", label: "Leaderboard", icon: "trophy", emoji: "" },
    { href: "/music", label: "Bard's Hall", icon: "music", emoji: "" },
    { href: "/search", label: "Arcane Search", icon: "search", emoji: "" },
    { href: "/chat", label: "Chat Tavern", icon: "message", emoji: "" },
    { href: "/profile", label: "Character", icon: "user", emoji: "" },
  ];

  const dn = user.displayName || user.username;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-portal-bg">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-realm">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-xl bg-portal-bg-surface border border-portal-border hover:bg-portal-bg-overlay transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-portal-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? "open" : ""} lg:translate-x-0`}
      >
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 p-6 border-b border-portal-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-portal-gold to-portal-gold-dark flex items-center justify-center text-2xl shadow-glow-gold">

          </div>
          <div>
            <h1 className="text-lg font-rune text-portal-gold">RUNEGATE</h1>
            <p className="text-2xs text-portal-text-dim font-mono">v2.0</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-item ${isActive ? "active" : ""}`}
              >
                <span className="icon text-lg">
                  {item.href === "/dashboard" && ""}
                  {item.href === "/games" && ""}
                  {item.href === "/leaderboard" && ""}
                  {item.href === "/music" && ""}
                  {item.href === "/search" && ""}
                  {item.href === "/chat" && ""}
                  {item.href === "/profile" && ""}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="sidebar-footer">
          <div className="flex items-center gap-3 mb-3">
            <div className="avatar">
              {user.profileImage ? (
                <img src={user.profileImage} alt="" />
              ) : (
                <span className="text-portal-gold text-lg">
                  {user.avatar === "wizard" ? "" : ""}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-portal-text-primary truncate">{dn}</p>
              <p className="text-xs text-portal-text-muted truncate">@{user.username}</p>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-portal-text-muted">Level {user.level}</span>
              <span className="text-portal-gold font-mono">{user.xp.toLocaleString()} XP</span>
            </div>
            <div className="progress-bar progress-gold">
              <div
                className="progress-fill"
                style={{ width: `${Math.min((user.xp % 1000) / 10, 100)}%` }}
              />
            </div>
          </div>

          {/* Gold Display */}
          <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-lg bg-portal-bg-base border border-portal-border">
            <span className="text-xs text-portal-text-muted">Gold</span>
            <span className="text-sm font-bold text-portal-gold font-mono">
              {user.gold.toLocaleString()}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="btn btn-ghost w-full text-sm justify-start"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Exit Portal
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="p-4 lg:p-8">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-portal-border py-4 px-6 mt-8">
          <div className="portal-container flex items-center justify-between text-xs text-portal-text-dim font-mono">
            <span>RuneGate v2.0 - Private Portal</span>
            <span className="flex items-center gap-2">
              <span className="animate-float">The realm awaits</span>
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
