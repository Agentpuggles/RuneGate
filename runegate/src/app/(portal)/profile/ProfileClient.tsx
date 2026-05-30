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
  { id: "wizard", emoji: "🧙" }, { id: "warrior", emoji: "⚔" }, { id: "rogue", emoji: "🗡" }, { id: "archer", emoji: "🏹" },
  { id: "healer", emoji: "✨" }, { id: "dragon", emoji: "🐉" }, { id: "ghost", emoji: "👻" }, { id: "knight", emoji: "🛡" },
  { id: "bard", emoji: "🎵" }, { id: "necro", emoji: "💀" }, { id: "demon", emoji: "😈" }, { id: "angel", emoji: "😇" },
  { id: "vampire", emoji: "🧛" }, { id: "elf", emoji: "🧝" }, { id: "dwarf", emoji: "⛏" }, { id: "cyber", emoji: "🤖" },
];

const titles = [
  "Archmage of the Digital Gate", "Wanderer of the Void", "Champion of the Arcade", "Seeker of the Arcane",
  "Tavern Bard", "Portal Master", "Code Wizard", "Rune Forger", "Digital Paladin", "Shadow Coder",
  "Neon Druid", "Keeper of the Grimoire", "Slayer of Bugs", "Lord of the Realm", "Knight of the Portal", "Alchemist of Code",
];

const ranks = [
  { name: "Initiate", min: 1, color: "#666655" },
  { name: "Apprentice", min: 5, color: "#00cc66" },
  { name: "Adept", min: 10, color: "#3366cc" },
  { name: "Veteran", min: 20, color: "#9933cc" },
  { name: "Champion", min: 30, color: "#d4af37" },
  { name: "Legend", min: 50, color: "#ff9900" },
  { name: "Mythic", min: 100, color: "#cc0000" },
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
    <div className="space-y-4">
      {/* Header */}
      <div className="frame">
        <div className="frame-header">
          <span>👤</span> <h3>Character Sheet</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="frame frame-gold">
            <div className="frame-header">
              <span>⚔</span> <h3>{dName || user.username}</h3>
            </div>
            <div className="frame-inner text-center">
              {/* Avatar */}
              <div className="avatar-frame avatar-frame-gold w-20 h-20 mx-auto mb-3">
                <div className="avatar-inner w-full h-full flex items-center justify-center text-4xl">
                  {pImg ? (
                    <img src={pImg} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{avatars.find((a) => a.id === selAvatar)?.emoji || "👤"}</span>
                  )}
                </div>
              </div>

              <h2 className="text-lg font-rune text-guild-gold">{dName || user.username}</h2>
              <p className="font-mono text-2xs text-guild-text-dim">@{user.username}</p>
              <p className="text-xs text-guild-text-dim mt-1">{selTitle}</p>

              <div className="badge badge-gold mt-3" style={{ borderColor: curRank.color }}>
                {curRank.name}
              </div>

              {bio && (
                <p className="text-xs text-guild-text italic mt-3 px-2">&quot;{bio}&quot;</p>
              )}

              <div className="divider-double my-3" />

              {/* Stats */}
              <div className="stat-row">
                <span className="stat-label">LEVEL {user.level}</span>
                <span className="stat-value text-guild-gold">{user.xp.toLocaleString()} XP</span>
              </div>
              <div className="bar bar-xp">
                <div className="bar-fill" style={{ width: `${xpProg}%` }} />
                <span className="bar-text">{xpProg.toFixed(0)}%</span>
              </div>

              <div className="mt-3">
                <span className="counter text-base">💰 {user.gold.toLocaleString()} Gold</span>
              </div>

              <div className="divider-gold my-3" />

              <div className="text-2xs text-guild-text-dim space-y-1">
                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab Navigation */}
          <div className="nav-bar px-0">
            <button onClick={() => setTab("stats")} className={`nav-item ${tab === "stats" ? "active" : ""}`}>
              [📊] Stats
            </button>
            <span className="nav-divider">|</span>
            <button onClick={() => setTab("customize")} className={`nav-item ${tab === "customize" ? "active" : ""}`}>
              [🎨] Customize
            </button>
            <span className="nav-divider">|</span>
            <button onClick={() => setTab("settings")} className={`nav-item ${tab === "settings" ? "active" : ""}`}>
              [⚙] Settings
            </button>
          </div>

          {/* Stats Tab */}
          {tab === "stats" && (
            <>
              <div className="frame">
                <div className="frame-header">
                  <span>📊</span> <h3>Adventure Statistics</h3>
                </div>
                <div className="frame-inner">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { label: "Games", value: stats.gamesPlayed, icon: "🎮", color: "emerald" },
                      { label: "Messages", value: stats.messagesSent, icon: "💬", color: "gold" },
                      { label: "Searches", value: stats.searchesMade, icon: "🔍", color: "sapphire" },
                      { label: "Favorites", value: stats.favoriteCount, icon: "⭐", color: "amethyst" },
                      { label: "Notes", value: stats.noteCount, icon: "📜", color: "topaz" },
                    ].map((s) => (
                      <div key={s.label} className="frame p-2 text-center">
                        <div className="text-base">{s.icon}</div>
                        <div className="text-sm font-bold font-mono text-guild-text-light">{s.value}</div>
                        <div className="text-2xs text-guild-text-dim uppercase">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="divider-double" />
                  <div className="text-center">
                    <span className="text-guild-text-dim">Total Interactions:</span>{" "}
                    <span className="font-bold text-guild-gold font-mono">{total}</span>
                  </div>
                </div>
              </div>

              <div className="frame">
                <div className="frame-header">
                  <span>🏆</span> <h3>Rank Progression</h3>
                </div>
                <div className="frame-inner p-0">
                  <table className="guild-table">
                    <tbody>
                      {ranks.map((r) => {
                        const isActive = user.level >= r.min;
                        return (
                          <tr key={r.name} className={!isActive ? "opacity-40" : ""}>
                            <td className="w-12 text-center">
                              <div
                                className="w-4 h-4 rounded-full mx-auto"
                                style={{
                                  background: isActive ? r.color : "transparent",
                                  border: `2px solid ${r.color}`,
                                }}
                              />
                            </td>
                            <td style={{ color: isActive ? r.color : undefined }}>{r.name}</td>
                            <td className="text-right text-guild-text-dim">Level {r.min}+</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Customize Tab */}
          {tab === "customize" && (
            <div className="space-y-3">
              <div className="frame">
                <div className="frame-header">
                  <span>✏</span> <h3>Display Name</h3>
                </div>
                <div className="frame-inner">
                  <p className="text-xs text-guild-text-dim mb-2">Shown instead of your login username.</p>
                  <input type="text" value={dName} onChange={(e) => setDName(e.target.value)} placeholder="Enter display name..." className="inp" maxLength={50} />
                  <p className="text-2xs text-guild-text-dim mt-1">Login: @{user.username}</p>
                </div>
              </div>

              <div className="frame">
                <div className="frame-header">
                  <span>📜</span> <h3>Biography</h3>
                </div>
                <div className="frame-inner">
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell the realm about yourself..." className="inp" style={{ minHeight: "80px" }} maxLength={300} />
                  <p className="text-2xs text-guild-text-dim mt-1">{bio.length}/300</p>
                </div>
              </div>

              <div className="frame">
                <div className="frame-header">
                  <span>🖼</span> <h3>Profile Image</h3>
                </div>
                <div className="frame-inner">
                  <p className="text-xs text-guild-text-dim mb-3">Upload an image to use as your portrait.</p>
                  <div className="flex items-center gap-4">
                    <div className="avatar-frame avatar-frame-gold w-16 h-16">
                      <div className="avatar-inner w-full h-full flex items-center justify-center text-2xl">
                        {pImg ? (
                          <img src={pImg} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>{avatars.find((a) => a.id === selAvatar)?.emoji || "👤"}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <input type="file" ref={fileRef} onChange={handleUpload} accept="image/*" className="hidden" />
                      <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn-std text-xs mb-2">
                        {uploading ? "Uploading..." : pImg ? "[📷 Change]" : "[📷 Upload]"}
                      </button>
                      {pImg && (
                        <button onClick={() => setPImg("")} className="btn btn-blood text-xs ml-2">
                          [X] Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="frame">
                <div className="frame-header">
                  <span>🎭</span> <h3>Avatar Emoji</h3>
                </div>
                <div className="frame-inner">
                  <p className="text-xs text-guild-text-dim mb-2">Used when no profile image is set.</p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {avatars.map((av) => (
                      <button
                        key={av.id}
                        onClick={() => setSelAvatar(av.id)}
                        className={`frame p-2 text-2xl text-center ${selAvatar === av.id ? "border-guild-gold" : ""}`}
                      >
                        {av.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="frame">
                <div className="frame-header">
                  <span>🏅</span> <h3>Title</h3>
                </div>
                <div className="frame-inner p-0">
                  <table className="guild-table">
                    <tbody>
                      {titles.map((t) => (
                        <tr
                          key={t}
                          onClick={() => setSelTitle(t)}
                          className={`cursor-pointer ${selTitle === t ? "bg-guild-gold bg-opacity-10" : ""}`}
                        >
                          <td className="w-8 text-center">
                            {selTitle === t ? <span className="text-guild-gold">★</span> : ""}
                          </td>
                          <td className={selTitle === t ? "text-guild-gold" : ""}>{t}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handleSave} disabled={saving} className="btn btn-gold disabled:opacity-50">
                  {saving ? "Saving..." : saved ? "[✓] Saved!" : "[💾] Save Changes"}
                </button>
                {saved && <span className="text-xs text-guild-emerald">Changes applied!</span>}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {tab === "settings" && (
            <div className="space-y-3">
              <div className="frame">
                <div className="frame-header">
                  <span>🔑</span> <h3>Account</h3>
                </div>
                <div className="frame-inner">
                  <table className="guild-table">
                    <tbody>
                      <tr>
                        <td className="w-32">Username</td>
                        <td className="font-mono text-guild-text-light">@{user.username}</td>
                      </tr>
                      <tr>
                        <td>Display Name</td>
                        <td className="text-guild-text-light">{dName || "Not set"}</td>
                      </tr>
                      <tr>
                        <td>User ID</td>
                        <td className="font-mono text-xs text-guild-text-dim">{user.id.substring(0, 12)}...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="frame">
                <div className="frame-header">
                  <span>🚪</span> <h3>Portal</h3>
                </div>
                <div className="frame-inner">
                  <Link href="/login" className="btn btn-blood">
                    [X] Logout & Return to Gate
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
