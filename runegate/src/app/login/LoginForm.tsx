"use client";

import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Access denied.");
        setLoading(false);
        return;
      }
      document.body.style.transition = "opacity 0.5s";
      document.body.style.opacity = "0";
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch {
      setError("The gate is unresponsive.");
      setLoading(false);
    }
  };

  return (
    <div className="frame frame-gold">
      <div className="frame-header">
        <span>🗝</span> <h3>Authentication Required</h3>
      </div>
      <div className="frame-inner">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-guild-text-dim mb-1 uppercase tracking-wider">
              [ Username ]
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="inp"
              placeholder="Enter your alias..."
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-guild-text-dim mb-1 uppercase tracking-wider">
              [ Password ]
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inp"
              placeholder="••••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="border border-guild-blood bg-guild-blood-dark bg-opacity-30 p-3 text-sm text-guild-blood-light font-mono">
              ⚠ {error}
            </div>
          )}

          <div className="divider-double" />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold w-full py-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="loader !w-4 !h-4" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <span>⚔ Enter the Gate ⚔</span>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-guild-border">
          <p className="font-mono text-2xs text-center text-guild-text-dim">
            Default: <span className="text-guild-text-light">admin</span> / <span className="text-guild-text-light">runegate</span>
          </p>
        </div>
      </div>
    </div>
  );
}
