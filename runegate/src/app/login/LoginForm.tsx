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
      setTimeout(() => { window.location.href = "/dashboard"; }, 500);
    } catch {
      setError("The gate is unresponsive.");
      setLoading(false);
    }
  };

  return (
    <div className="forum-panel-gold">
      <div className="forum-panel-header">
        <span className="text-lg">🗝️</span>
        <h3>Portal Authentication</h3>
      </div>
      <div className="forum-panel-body">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-forum-cream-dim mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-forum"
              placeholder="Enter your alias..."
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-forum-cream-dim mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-forum"
              placeholder="The ancient words..."
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="bg-forum-red/10 border border-forum-red/30 rounded-md p-3 text-sm text-forum-red">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3 text-base disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="rune-loader !w-5 !h-5" />
                Opening the Gate...
              </span>
            ) : (
              "🌀 Enter the Gate"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
