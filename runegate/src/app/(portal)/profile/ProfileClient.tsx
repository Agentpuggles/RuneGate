"use client";
import { useState, useRef } from "react";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  displayName: string | null;
  avatar: string;
  profileImage: string | null;
  bio: string;
  title: string;
  rank: string;
  level: number;
  xp: number;
  gold: number;
  createdAt: string | Date;
  lastLogin: string | Date;
}
interface Stats {
  gamesPlayed: number;
  messagesSent: number;
  searchesMade: number;
  favoriteCount: number;
  noteCount: number;
}

const avatars = [
  { id: "wizard", emoji: "" },
  { id: "warrior", emoji: "" },
  { id: "rogue", emoji: "" },
  { id: "archer", emoji: "" },
  { id: "healer", emoji: "" },
  { id: "dragon", emoji: "" },
  { id: "ghost", emoji: "" },
  { id: "knight", emoji: "" },
  { id: "bard", emoji: "" },
  { id: "necro", emoji: "" },
  { id: "demon", emoji: "" },
  { id: "angel", emoji: "" },
  { id: "vampire", emoji: "" },
  { id: "elf", emoji: "" },
  { id: "dwarf", emoji: "" },
  { id: "cyber", emoji: "" },
];

const titles = [
  "Archmage of the Digital Gate",
  "Wanderer of the Void",
  "Champion of the Arcade",
  "Seeker of the Arcane",
  "Tavern Bard",
  "Portal Master",
  "Code Wizard",
  "Rune Forger",
  "Digital Paladin",
  "Shadow Coder",
  "Neon Druid",
  "Keeper of the Grimoire",
  "Slayer of Bugs",
  "Lord of the Realm",
  "Knight of the Portal",
  "Alchemist of Code",
];

const ranks = [
  { name: "Initiate", min: 1, color: "#64748b" },
  { name: "Apprentice", min: 5, color: "#10b981" },
  { name: "Adept", min: 10, color: "#3b82f6" },
  { name: "Veteran", min: 20, color: "#a855f7" },
  { name: "Champion", min: 30, color: "#fbbf24" },
  { name: "Legend", min: 50, color: "#f59e0b" },
  { name: "Mythic", min: 100, color: "#ef4444" },
];

export default function ProfileClient({ user, stats }: { user: User; stats: Stats }) {
  const [selAvatar, setSelAvatar] = useState(user.avatar);
  const [selTitle, setSelTitle] = useState(user.title);
  const [dName, setDName] = useState(user.displayName || "");
  const [bio, setBio] = useState(user.bio || "");
  const [pImg, setPImg] = useState(user.profileImage || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"stats" | "customize" | "settings">("stats");
  const fileRef = useRef<HTMLInputElement>(null);

  const xpProg = Math.min((user.xp % 1000) / 10, 100);
  const curRank = [...ranks].reverse().find((r) => user.level >= r.min) || ranks[0];
  const total = stats.gamesPlayed + stats.messagesSent + stats.searchesMade;

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avatar: selAvatar,
          title: selTitle,
          displayName: dName || null,
          bio,
          profileImage: pImg || null,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Handle error silently
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/profile/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.imageUrl) setPImg(data.imageUrl);
    } catch {
      // Handle error silently
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-rune text-portal-gold">Character Sheet</h1>
          <p className="text-sm text-portal-text-muted">Your legend awaits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="panel panel-gold">
            <div className="panel-header">
              <span className="icon"></span>
              <h3>{dName || user.username}</h3>
            </div>
            <div className="panel-body text-center">
              <div className="avatar avatar-lg mx-auto animate-glow mb-4">
                {pImg ? (
                  <img src={pImg} alt="" />
                ) : (
                  <span className="text-3xl">
                    {avatars.find((a) => a.id === selAvatar)?.emoji || ""}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-portal-text-primary">{dName || user.username}</h2>
              <p className="text-xs text-portal-text-dim font-mono">@{user.username}</p>
              <p className="text-sm text-portal-text-muted mt-2">{selTitle}</p>

              <div
                className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold mt-4"
                style={{
                  background: `${curRank.color}15`,
                  color: curRank.color,
                  border: `1px solid ${curRank.color}30`,
                }}
              >
                {curRank.name}
              </div>

              {bio && (
                <p className="text-sm text-portal-text-secondary mt-4 italic leading-relaxed">
                  "{bio}"
                </p>
              )}

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-portal-text-muted">Level {user.level}</span>
                  <span className="text-portal-gold font-mono">{user.xp.toLocaleString()} XP</span>
                </div>
                <div className="progress-bar progress-gold">
                  <div className="progress-fill" style={{ width: `${xpProg}%` }} />
                </div>
              </div>

              <div className="mt-4 px-4 py-3 rounded-lg bg-portal-bg-base border border-portal-border">
                <span className="text-portal-gold font-bold text-lg font-mono">{user.gold.toLocaleString()} Gold</span>
              </div>

              <div className="mt-6 pt-4 border-t border-portal-border text-xs text-portal-text-dim space-y-2">
                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-portal-border pb-2">
            {(["stats", "customize", "settings"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`btn ${tab === t ? "btn-primary" : "btn-ghost"}`}
              >
                {t === "stats" ? " Stats" : t === "customize" ? " Customize" : " Settings"}
              </button>
            ))}
          </div>

          {/* Stats Tab */}
          {tab === "stats" && (
            <>
              <div className="panel">
                <div className="panel-header">
                  <span className="icon"></span>
                  <h3>Adventure Statistics</h3>
                </div>
                <div className="panel-body">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[
                      { label: "Games", value: stats.gamesPlayed, icon: "" },
                      { label: "Messages", value: stats.messagesSent, icon: "" },
                      { label: "Searches", value: stats.searchesMade, icon: "" },
                      { label: "Favorites", value: stats.favoriteCount, icon: "" },
                      { label: "Notes", value: stats.noteCount, icon: "" },
                    ].map((s) => (
                      <div key={s.label} className="stat-box">
                        <div className="label">{s.icon} {s.label}</div>
                        <div className="value">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-lg text-center bg-portal-bg-elevated border border-portal-border">
                    <span className="text-portal-text-muted">Total Interactions: </span>
                    <span className="font-bold text-portal-sapphire font-mono">{total}</span>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="icon"></span>
                  <h3>Rank Progression</h3>
                </div>
                <div className="panel-body space-y-2">
                  {ranks.map((r) => {
                    const isActive = user.level >= r.min;
                    return (
                      <div
                        key={r.name}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive ? "bg-portal-bg-elevated" : "opacity-40"
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{
                            background: isActive ? r.color : "transparent",
                            border: `2px solid ${r.color}`,
                          }}
                        />
                        <div className="flex-1 flex justify-between text-sm">
                          <span style={{ color: isActive ? r.color : "#64748b" }}>{r.name}</span>
                          <span className="text-portal-text-dim">Level {r.min}+</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Customize Tab */}
          {tab === "customize" && (
            <div className="space-y-4">
              <div className="panel">
                <div className="panel-header">
                  <span className="icon"></span>
                  <h3>Display Name</h3>
                </div>
                <div className="panel-body">
                  <p className="text-sm text-portal-text-muted mb-3">
                    Shown instead of your login username.
                  </p>
                  <input
                    type="text"
                    value={dName}
                    onChange={(e) => setDName(e.target.value)}
                    placeholder="Enter display name..."
                    className="input"
                    maxLength={50}
                  />
                  <p className="text-xs text-portal-text-dim mt-2">Login: @{user.username}</p>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="icon"></span>
                  <h3>Biography</h3>
                </div>
                <div className="panel-body">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the realm about yourself..."
                    className="input min-h-[100px] resize-y"
                    maxLength={300}
                  />
                  <p className="text-xs text-portal-text-dim mt-2">{bio.length}/300 characters</p>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="icon"></span>
                  <h3>Profile Image</h3>
                </div>
                <div className="panel-body">
                  <p className="text-sm text-portal-text-muted mb-4">
                    Upload an image to use as your portrait. This overrides the emoji avatar.
                  </p>
                  <div className="flex items-center gap-6">
                    <div
                      className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-portal-gold"
                      style={{
                        background: pImg
                          ? "transparent"
                          : "linear-gradient(135deg, #f59e0b, #b45309)",
                      }}
                    >
                      {pImg ? (
                        <img src={pImg} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {avatars.find((a) => a.id === selAvatar)?.emoji || ""}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        ref={fileRef}
                        onChange={handleUpload}
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="btn btn-secondary disabled:opacity-50"
                      >
                        {uploading ? "Uploading..." : pImg ? " Change Photo" : " Upload Photo"}
                      </button>
                      {pImg && (
                        <button onClick={() => setPImg("")} className="btn btn-danger ml-3">
                          Remove
                        </button>
                      )}
                      <p className="text-xs text-portal-text-dim mt-3">
                        JPG, PNG, GIF, or WebP. Max 2MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="icon"></span>
                  <h3>Avatar Emoji</h3>
                </div>
                <div className="panel-body">
                  <p className="text-sm text-portal-text-muted mb-4">
                    Used when no profile image is set.
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {avatars.map((av) => (
                      <button
                        key={av.id}
                        onClick={() => setSelAvatar(av.id)}
                        className={`p-3 rounded-lg text-3xl transition-all ${
                          selAvatar === av.id
                            ? "bg-portal-gold/15 border-2 border-portal-gold scale-110"
                            : "bg-portal-bg-base border border-portal-border hover:scale-105"
                        }`}
                      >
                        {av.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="icon"></span>
                  <h3>Title</h3>
                </div>
                <div className="panel-body">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {titles.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelTitle(t)}
                        className={`text-left px-4 py-3 rounded-lg text-sm transition-all ${
                          selTitle === t
                            ? "text-portal-gold bg-portal-gold/10 border border-portal-gold"
                            : "text-portal-text-muted bg-portal-bg-base border border-portal-border hover:text-portal-text-primary"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button onClick={handleSave} disabled={saving} className="btn btn-primary disabled:opacity-50">
                  {saving ? "Saving..." : saved ? " Saved!" : " Save Changes"}
                </button>
                {saved && (
                  <span className="text-sm text-portal-emerald font-medium">Changes applied!</span>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {tab === "settings" && (
            <div className="space-y-4">
              <div className="panel">
                <div className="panel-header">
                  <span className="icon"></span>
                  <h3>Account</h3>
                </div>
                <div className="panel-body space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-portal-text-muted">Username</span>
                    <span className="text-portal-text-primary font-mono">@{user.username}</span>
                  </div>
                  <div className="divider" />
                  <div className="flex justify-between items-center">
                    <span className="text-portal-text-muted">Display Name</span>
                    <span className="text-portal-text-primary">{dName || "Not set"}</span>
                  </div>
                  <div className="divider" />
                  <div className="flex justify-between items-center">
                    <span className="text-portal-text-muted">User ID</span>
                    <span className="text-portal-text-dim font-mono text-xs">{user.id.substring(0, 12)}...</span>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="icon"></span>
                  <h3>Portal</h3>
                </div>
                <div className="panel-body">
                  <Link href="/login" className="btn btn-danger">
                    Logout & Return to Gate
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
