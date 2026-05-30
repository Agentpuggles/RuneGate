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
    <div className="panel panel-gold">
      <div className="panel-header">
        <span className="icon"></span>
        <h3>Portal Authentication</h3>
      </div>
      <div className="panel-body">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-portal-text-muted mb-2 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="Enter your alias..."
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-portal-text-muted mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="The ancient words..."
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-portal-ruby/10 border border-portal-ruby/30">
              <span className="text-portal-ruby"></span>
              <span className="text-sm text-portal-ruby">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-base font-semibold disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="loader !w-5 !h-5" />
                Opening the Gate...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Enter the Gate</span>
              </span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-portal-border/30">
          <div className="text-center">
            <p className="text-xs text-portal-text-dim">
              Default credentials: <span className="text-portal-text-muted font-mono">admin</span> / <span className="text-portal-text-muted font-mono">runegate</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
