"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface GameData {
  id: string; title: string; slug: string; description: string; category: string;
  thumbnail: string; image: string; embedUrl: string; controls: string;
  rating: number; plays: number; isFavorite: boolean;
}

export default function GamePlayerClient({ gameId }: { gameId: string }) {
  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameLoading, setGameLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCRT, setShowCRT] = useState(false);
  const [error, setError] = useState("");
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${gameId}`);
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Spell not found"); setLoading(false); return; }
        setGame(data);
      } catch { setError("Failed to load spell"); }
      finally { setLoading(false); }
    };
    fetchGame();
  }, [gameId]);

  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const toggleFavorite = async () => {
    if (!game) return;
    try {
      await fetch("/api/games/favorites", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: game.id, action: game.isFavorite ? "remove" : "add" }),
      });
      setGame((prev) => prev ? { ...prev, isFavorite: !prev.isFavorite } : prev);
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="rloader mx-auto mb-4" />
          <p className="t-dim font-mono text-sm animate-pulse">&gt; Summoning spell artifact...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="fp fp-gold max-w-md">
          <div className="fp-head"><span>⚠️</span><h3>Spell Failed</h3></div>
          <div className="fp-body text-center">
            <p className="t-dim mb-4">{error || "Unknown error"}</p>
            <Link href="/games" className="btn btn-p">Return to Arcade</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="anim-in">
      <div className="flex items-center justify-between mb-3">
        <Link href="/games" className="text-sm t-dim hover:t-cream transition-colors flex items-center gap-1">← Arcade</Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCRT(!showCRT)}
            className={`btn text-xs px-3 py-1.5 cursor-pointer ${showCRT ? "btn-g" : "btn-p"}`}>
            📺 CRT
          </button>
          <button onClick={toggleFavorite}
            className={`btn text-xs px-3 py-1.5 cursor-pointer ${game.isFavorite ? "btn-g" : "btn-p"}`}>
            {game.isFavorite ? "⭐ Fav" : "☆ Fav"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div ref={playerRef} className={`gp-container ${isFullscreen ? "gp-fs" : ""} ${showCRT ? "crt-filter" : ""}`}>
            {gameLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center" style={{ background: "rgba(5,5,16,0.95)" }}>
                <div className="text-5xl mb-4 anim-float">{game.thumbnail}</div>
                <div className="rloader mb-3" />
                <p className="t-dim font-mono text-sm">&gt; Loading {game.title}...</p>
              </div>
            )}
            <iframe src={game.embedUrl} className="w-full h-full absolute inset-0" allowFullScreen
              allow="autoplay; fullscreen; gamepad" sandbox="allow-scripts allow-same-origin allow-popups"
              onLoad={() => setGameLoading(false)} title={game.title} />
            {isFullscreen && (
              <div className="absolute top-3 right-3 z-30">
                <button onClick={toggleFullscreen} className="btn btn-p text-xs">✕ Exit</button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0" style={{ background: "var(--bg-dark)", border: "1px solid var(--border-light)" }}>
                {game.image ? <img src={game.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">{game.thumbnail}</div>}
              </div>
              <div>
                <h1 className="text-base font-bold t-cream">{game.title}</h1>
                <div className="flex items-center gap-3 text-xs t-dim">
                  <span>👥 {game.plays + 1}</span>
                  <span>⭐ {game.rating.toFixed(1)}</span>
                  <span>🎮 {game.controls}</span>
                </div>
              </div>
            </div>
            <button onClick={toggleFullscreen} className="btn btn-p flex items-center gap-2 text-xs cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Fullscreen
            </button>
          </div>
        </div>

        <div className="lg:w-64 space-y-3">
          <div className="fp">
            <div className="fp-head"><span>📜</span><h3>Spell Info</h3></div>
            <div className="fp-body">
              <p className="text-xs t-dim leading-relaxed">{game.description}</p>
              <div className="mt-3 pt-3 grid grid-cols-2 gap-2 text-xs" style={{ borderTop: "1px solid var(--border-light)" }}>
                <span className="t-dim">Category</span><span className="t-cream capitalize">{game.category}</span>
                <span className="t-dim">Controls</span><span className="t-cream capitalize">{game.controls}</span>
                <span className="t-dim">Type</span><span className="t-cream">HTML5 Spell</span>
              </div>
            </div>
          </div>
          <div className="fp">
            <div className="fp-head"><span>🎮</span><h3>Controls</h3></div>
            <div className="fp-body space-y-1 text-xs t-dim">
              {game.controls === "keyboard" ? (
                <><p>⌨️ Arrow keys / WASD to move</p><p>⌨️ Space for action</p><p>⌨️ P to pause</p></>
              ) : (
                <><p>🖱️ Click to interact</p><p>🖱️ Drag to move items</p></>
              )}
            </div>
          </div>
          <div className="fp">
            <div className="fp-head"><span>⚡</span><h3>Quick Links</h3></div>
            <div className="fp-body space-y-2">
              <Link href="/games" className="block text-xs t-link hover:t-cream transition-colors">← Back to Arcade</Link>
              <Link href="/dashboard" className="block text-xs t-dim hover:t-cream transition-colors">🏰 Portal Hub</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
