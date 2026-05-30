"use client";
import { useState, useRef } from "react";
import Link from "next/link";

interface User { id: string; username: string; displayName: string | null; avatar: string; profileImage: string | null; bio: string; title: string; rank: string; level: number; xp: number; gold: number; createdAt: string | Date; lastLogin: string | Date; }
interface Stats { gamesPlayed: number; messagesSent: number; searchesMade: number; favoriteCount: number; noteCount: number; }

const avatars = [
  { id: "wizard", emoji: "🧙" },{ id: "warrior", emoji: "⚔️" },{ id: "rogue", emoji: "🗡️" },{ id: "archer", emoji: "🏹" },
  { id: "healer", emoji: "✨" },{ id: "dragon", emoji: "🐉" },{ id: "ghost", emoji: "👻" },{ id: "knight", emoji: "🛡️" },
  { id: "bard", emoji: "🎵" },{ id: "necro", emoji: "💀" },{ id: "demon", emoji: "😈" },{ id: "angel", emoji: "😇" },
  { id: "vampire", emoji: "🧛" },{ id: "elf", emoji: "🧝" },{ id: "dwarf", emoji: "⛏️" },{ id: "cyber", emoji: "🤖" },
];
const titles = [
  "Archmage of the Digital Gate","Wanderer of the Void","Champion of the Arcade","Seeker of the Arcane",
  "Tavern Bard","Portal Master","Code Wizard","Rune Forger","Digital Paladin","Shadow Coder",
  "Neon Druid","Keeper of the Grimoire","Slayer of Bugs","Lord of the Realm","Knight of the Portal","Alchemist of Code",
];
const ranks = [
  { name: "Initiate", min: 1, color: "#7a7268" },{ name: "Apprentice", min: 5, color: "#5da06a" },
  { name: "Adept", min: 10, color: "#5882b0" },{ name: "Veteran", min: 20, color: "#8b6cc4" },
  { name: "Champion", min: 30, color: "#c9a84c" },{ name: "Legend", min: 50, color: "#c48840" },
  { name: "Mythic", min: 100, color: "#c45050" },
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
      await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: selAvatar, title: selTitle, displayName: dName || null, bio, profileImage: pImg || null }),
      });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch {} finally { setSaving(false); }
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
    } catch {} finally { setUploading(false); }
  };

  return (
    <div className="anim-in">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl t-title flex items-center gap-2">👤 Character Sheet</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card */}
        <div className="lg:col-span-1">
          <div className="fp fp-gold">
            <div className="fp-head"><span>⚔️</span><h3>{dName || user.username}</h3></div>
            <div className="fp-body text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden anim-glow mb-3"
                style={{ border: "3px solid var(--border-gold)", background: "linear-gradient(135deg, var(--gold-dim), var(--brown))" }}>
                {pImg ? (
                  <img src={pImg} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {avatars.find((a) => a.id === selAvatar)?.emoji || "👤"}
                  </div>
                )}
              </div>
              <h2 className="text-lg font-bold t-cream">{dName || user.username}</h2>
              <p className="text-[10px] font-mono" style={{ color: "var(--gold-dim)" }}>@{user.username}</p>
              <p className="text-xs t-dim mt-1">{selTitle}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-3"
                style={{ background: `${curRank.color}20`, color: curRank.color, border: `1px solid ${curRank.color}40` }}>
                {curRank.name}
              </div>
              {bio && <p className="text-xs t-dim mt-3 italic leading-relaxed">&quot;{bio}&quot;</p>}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="t-dim">Level {user.level}</span>
                  <span className="t-gold">{user.xp.toLocaleString()} XP</span>
                </div>
                <div className="sbar sbar-gold"><div className="sbar-fill" style={{ width: `${xpProg}%` }} /></div>
              </div>
              <div className="mt-3 text-sm"><span className="t-gold font-bold">💰 {user.gold} Gold</span></div>
              <div className="mt-3 pt-3 text-[10px] t-dim" style={{ borderTop: "1px solid var(--border-light)" }}>
                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="lg:col-span-2">
          <div className="flex border-b mb-4" style={{ borderColor: "var(--border-main)" }}>
            {(["stats", "customize", "settings"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`ntab ${tab === t ? "on" : ""} cursor-pointer`}>
                {t === "stats" ? "📊 Stats" : t === "customize" ? "🎨 Customize" : "⚙️ Settings"}
              </button>
            ))}
          </div>

          {tab === "stats" && (
            <div className="space-y-4">
              <div className="fp">
                <div className="fp-head"><span>📊</span><h3>Adventure Statistics</h3></div>
                <div className="fp-body">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { l: "Games", v: stats.gamesPlayed, i: "🎮", c: "#5da06a" },
                      { l: "Messages", v: stats.messagesSent, i: "💬", c: "#c9a84c" },
                      { l: "Searches", v: stats.searchesMade, i: "🔍", c: "#5882b0" },
                      { l: "Favorites", v: stats.favoriteCount, i: "⭐", c: "#8b6cc4" },
                      { l: "Notes", v: stats.noteCount, i: "📜", c: "#c48840" },
                    ].map((s) => (
                      <div key={s.l} className="text-center p-3 rounded-md" style={{ background: "var(--bg-dark)", border: "1px solid var(--border-light)" }}>
                        <div className="text-lg mb-0.5">{s.i}</div>
                        <div className="text-lg font-bold" style={{ color: s.c }}>{s.v}</div>
                        <div className="text-[9px] t-dim uppercase">{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 rounded-md text-center text-xs" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-light)" }}>
                    <span className="t-dim">Total Interactions: </span><span className="font-bold" style={{ color: "var(--blue)" }}>{total}</span>
                  </div>
                </div>
              </div>
              <div className="fp">
                <div className="fp-head"><span>🏆</span><h3>Rank Progression</h3></div>
                <div className="fp-body space-y-2">
                  {ranks.map((r) => {
                    const cur = user.level >= r.min;
                    return (
                      <div key={r.name} className={`flex items-center gap-3 px-3 py-2 rounded-md ${cur ? "" : "opacity-40"}`}
                        style={{ background: cur ? "rgba(255,255,255,0.02)" : "transparent" }}>
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cur ? r.color : "transparent", border: `2px solid ${r.color}` }} />
                        <div className="flex-1 flex justify-between text-xs">
                          <span style={{ color: cur ? r.color : "#7a7268" }}>{r.name}</span>
                          <span className="t-dim">Lv.{r.min}+</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === "customize" && (
            <div className="space-y-4">
              <div className="fp">
                <div className="fp-head"><span>✏️</span><h3>Display Name</h3></div>
                <div className="fp-body">
                  <p className="text-xs t-dim mb-2">Shown instead of your login username.</p>
                  <input type="text" value={dName} onChange={(e) => setDName(e.target.value)} placeholder="Enter display name..." className="inp" maxLength={50} />
                  <p className="text-[10px] t-dim mt-1">Login: @{user.username}</p>
                </div>
              </div>
              <div className="fp">
                <div className="fp-head"><span>📜</span><h3>Biography</h3></div>
                <div className="fp-body">
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell the realm about yourself..." className="inp min-h-[80px] resize-y" maxLength={300} />
                  <p className="text-[10px] t-dim mt-1">{bio.length}/300</p>
                </div>
              </div>
              {/* IMAGE UPLOAD */}
              <div className="fp">
                <div className="fp-head"><span>🖼️</span><h3>Profile Image</h3></div>
                <div className="fp-body">
                  <p className="text-xs t-dim mb-3">Upload an image to use as your portrait. This overrides the emoji avatar.</p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0"
                      style={{ border: "2px solid var(--border-gold)", background: pImg ? "transparent" : "linear-gradient(135deg, var(--gold-dim), var(--brown))" }}>
                      {pImg ? (
                        <img src={pImg} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          {avatars.find((a) => a.id === selAvatar)?.emoji || "👤"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input type="file" ref={fileRef} onChange={handleUpload} accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" />
                      <button onClick={() => fileRef.current?.click()} disabled={uploading}
                        className="btn btn-p text-xs cursor-pointer disabled:opacity-50">
                        {uploading ? "Uploading..." : pImg ? "📷 Change Photo" : "📷 Upload Photo"}
                      </button>
                      {pImg && (
                        <button onClick={() => setPImg("")} className="btn btn-r text-xs ml-2 cursor-pointer">Remove</button>
                      )}
                      <p className="text-[10px] t-dim mt-2">JPG, PNG, GIF, or WebP. Max 2MB.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fp">
                <div className="fp-head"><span>🎭</span><h3>Avatar Emoji</h3></div>
                <div className="fp-body">
                  <p className="text-xs t-dim mb-2">Used when no profile image is set.</p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {avatars.map((av) => (
                      <button key={av.id} onClick={() => setSelAvatar(av.id)}
                        className={`p-2 rounded-md text-2xl cursor-pointer transition-all ${selAvatar === av.id ? "scale-110" : "hover:scale-105"}`}
                        style={selAvatar === av.id ? { background: "rgba(201,168,76,0.15)", border: "2px solid var(--border-gold)" } : { background: "var(--bg-dark)", border: "1px solid var(--border-light)" }}>
                        {av.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="fp">
                <div className="fp-head"><span>🏅</span><h3>Title</h3></div>
                <div className="fp-body">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {titles.map((t) => (
                      <button key={t} onClick={() => setSelTitle(t)}
                        className={`text-left px-3 py-2 rounded-md text-xs cursor-pointer transition-all ${selTitle === t ? "t-gold" : "t-dim hover:t-cream"}`}
                        style={selTitle === t ? { background: "rgba(201,168,76,0.1)", border: "1px solid var(--border-gold)" } : { background: "var(--bg-dark)", border: "1px solid var(--border-light)" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleSave} disabled={saving} className="btn btn-g disabled:opacity-50 cursor-pointer">
                  {saving ? "Saving..." : saved ? "✅ Saved!" : "💾 Save Changes"}
                </button>
                {saved && <span className="text-xs font-mono" style={{ color: "var(--green)" }}>Changes applied!</span>}
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="space-y-4">
              <div className="fp">
                <div className="fp-head"><span>🔑</span><h3>Account</h3></div>
                <div className="fp-body space-y-3">
                  <div className="flex justify-between items-center text-sm"><span className="t-dim">Username</span><span className="t-cream font-mono">@{user.username}</span></div>
                  <hr className="divider" />
                  <div className="flex justify-between items-center text-sm"><span className="t-dim">Display Name</span><span className="t-cream">{dName || "Not set"}</span></div>
                  <hr className="divider" />
                  <div className="flex justify-between items-center text-sm"><span className="t-dim">ID</span><span className="t-dim font-mono text-xs">{user.id.substring(0, 12)}...</span></div>
                </div>
              </div>
              <div className="fp">
                <div className="fp-head"><span>🚪</span><h3>Portal</h3></div>
                <div className="fp-body"><Link href="/login" className="btn btn-r text-xs inline-block">Logout &amp; Return to Gate</Link></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
