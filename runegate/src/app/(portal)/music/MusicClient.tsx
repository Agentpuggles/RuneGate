"use client";

import { useState } from "react";

interface Station {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  embedUrl: string;
  color: string;
  image: string;
}

const cats = [
  { id: "all", label: "All", icon: "🎵" },
  { id: "lofi", label: "Lofi & Chill", icon: "☕" },
  { id: "fantasy", label: "Fantasy", icon: "🏰" },
  { id: "epic", label: "Epic", icon: "⚔️" },
  { id: "ambient", label: "Ambient", icon: "🌙" },
  { id: "medieval", label: "Medieval", icon: "🗡️" },
  { id: "dark", label: "Dark", icon: "💀" },
  { id: "nature", label: "Nature", icon: "🌿" },
  { id: "retro", label: "Retro", icon: "🕹️" },
];

const yt = (v: string) => `https://www.youtube.com/embed/${v}?autoplay=0&rel=0`;

const stations: Station[] = [
  {
    id: "lofi-girl", title: "Lofi Girl Radio", description: "The classic 24/7 lofi hip hop radio — beats to relax/study to",
    category: "lofi", icon: "☕", embedUrl: yt("EWrX250Zhko"), color: "#e8967a",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=180&fit=crop",
  },
  {
    id: "chill-lofi", title: "Chill Lofi Beats", description: "Late night chill beats — smooth and mellow vibes",
    category: "lofi", icon: "🌙", embedUrl: yt("7NOSDKb0HlU"), color: "#7a96b0",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=180&fit=crop",
  },
  {
    id: "fantasy-ambient", title: "Fantasy Ambient Mix", description: "Atmospheric fantasy music for exploration and world-building",
    category: "fantasy", icon: "🏰", embedUrl: yt("0p6UidTS7Ao"), color: "#7b6cc4",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=180&fit=crop",
  },
  {
    id: "tavern-music", title: "Fantasy Tavern Music", description: "Cozy tavern ambience — lutes, firesides, and merry company",
    category: "fantasy", icon: "🍺", embedUrl: yt("vK5VwVyxkbI"), color: "#c9a84c",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=180&fit=crop",
  },
  {
    id: "epic-orchestral", title: "Epic Orchestral Music", description: "Grand orchestral pieces — for when you need to feel heroic",
    category: "epic", icon: "⚔️", embedUrl: yt("pqLozDMkEWM"), color: "#c48840",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&h=180&fit=crop",
  },
  {
    id: "epic-battle", title: "Epic Battle Music", description: "Intense battle anthems — charge into the fray!",
    category: "epic", icon: "🛡️", embedUrl: yt("CNYdzjS-dAE"), color: "#c45050",
    image: "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=300&h=180&fit=crop",
  },
  {
    id: "space-ambient", title: "Space Ambience", description: "Deep space ambient — drift among the stars",
    category: "ambient", icon: "🌌", embedUrl: yt("AXvnFk38sDQ"), color: "#3a5a8c",
    image: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=300&h=180&fit=crop",
  },
  {
    id: "rain", title: "Rain & Thunder", description: "Gentle rain with distant thunder — perfect for reading scrolls",
    category: "ambient", icon: "🌧️", embedUrl: yt("42M3esYyHdw"), color: "#5882b0",
    image: "https://images.unsplash.com/photo-1501691223387-dd0500403074?w=300&h=180&fit=crop",
  },
  {
    id: "medieval-folk", title: "Medieval Folk Music", description: "Authentic medieval and Renaissance folk melodies",
    category: "medieval", icon: "🗡️", embedUrl: yt("IxPANmjPaek"), color: "#8a6d3b",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=180&fit=crop",
  },
  {
    id: "celtic-harp", title: "Celtic Harp Music", description: "Soothing Celtic harp melodies — the bards of old",
    category: "medieval", icon: "🎶", embedUrl: yt("MpYNcBrQvkg"), color: "#5da06a",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=180&fit=crop",
  },
  {
    id: "dark-dungeon", title: "Dark Ambient Dungeon", description: "Eerie dungeon ambience — explore the depths if you dare",
    category: "dark", icon: "💀", embedUrl: yt("Y4u7D7xCvtw"), color: "#5a3a6a",
    image: "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=300&h=180&fit=crop",
  },
  {
    id: "gothic-choir", title: "Gothic Choir Music", description: "Haunting gothic choir — echoes of the ancient cathedral",
    category: "dark", icon: "🏚️", embedUrl: yt("kGRiYFknx_c"), color: "#3d3560",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=180&fit=crop",
  },
  {
    id: "forest", title: "Enchanted Forest", description: "Birds, streams, and forest sounds — nature's own symphony",
    category: "nature", icon: "🌿", embedUrl: yt("Hp7QKP2FivA"), color: "#4a8a5a",
    image: "https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=300&h=180&fit=crop",
  },
  {
    id: "ocean", title: "Ocean Waves", description: "Calm ocean waves on a mystical shore",
    category: "nature", icon: "🌊", embedUrl: yt("_BMi3usEwi8"), color: "#4a7a9a",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=300&h=180&fit=crop",
  },
  {
    id: "synthwave", title: "Synthwave / Retrowave", description: "80s-inspired synthwave — neon drives through fantasy",
    category: "retro", icon: "🕹️", embedUrl: yt("UedTcufyrHc"), color: "#c4508a",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=180&fit=crop",
  },
  {
    id: "dungeon-synth", title: "Dungeon Synth", description: "Medieval lo-fi dungeon synth from the underground",
    category: "retro", icon: "🗝️", embedUrl: yt("I7zSkdKdzGI"), color: "#6a5a3a",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=180&fit=crop",
  },
];

export default function MusicClient() {
  const [activeCat, setActiveCat] = useState("all");
  const [active, setActive] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = stations.filter((s) => {
    if (activeCat !== "all" && s.category !== activeCat) return false;
    if (search) { const q = search.toLowerCase(); return s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q); }
    return true;
  });

  const cur = stations.find((s) => s.id === active);

  return (
    <div className="anim-in">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl t-title flex items-center gap-2">🎵 Bard&apos;s Hall</h1>
        <span className="t-dim text-xs font-mono">Music &amp; Ambience</span>
      </div>

      {/* Player */}
      {cur && (
        <div className="fp fp-gold mb-4">
          <div className="fp-head">
            <span>▶</span>
            <h3>{cur.title}</h3>
            <button onClick={() => setActive(null)} className="ml-auto t-dim hover:text-red-400 text-xs cursor-pointer">Stop</button>
          </div>
          <div className="p-0">
            <img src={cur.image} alt="" className="w-full h-48 object-cover" style={{ filter: "brightness(0.6)" }} />
            <div className="w-full" style={{ aspectRatio: "16/9" }}>
              <iframe src={cur.embedUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={cur.title} style={{ border: "none" }} />
            </div>
          </div>
        </div>
      )}

      {/* Browse */}
      <div className="fp mb-4">
        <div className="fp-head"><span>📻</span><h3>Browse Stations</h3></div>
        <div className="fp-body">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search stations..." className="inp mb-3" />
          <div className="flex flex-wrap gap-1.5 mb-4">
            {cats.map((c) => (
              <button key={c.id} onClick={() => setActiveCat(c.id)}
                className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-all ${
                  activeCat === c.id ? "t-gold border" : "t-dim hover:t-cream border border-transparent"
                }`}
                style={activeCat === c.id ? { background: "rgba(201,168,76,0.1)", borderColor: "var(--gold-dim)" } : {}}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((s) => (
              <div key={s.id} className={`mcard ${active === s.id ? "on" : ""}`}
                onClick={() => setActive(active === s.id ? null : s.id)}>
                <img src={s.image} alt="" className="w-full h-28 object-cover" loading="lazy"
                  style={{ filter: active === s.id ? "brightness(0.8)" : "brightness(0.6)" }} />
                <div className="p-3" style={{ borderLeft: `3px solid ${s.color}` }}>
                  <h4 className="text-sm font-semibold t-cream truncate">{s.icon} {s.title}</h4>
                  <p className="text-[10px] t-dim mt-0.5 line-clamp-2">{s.description}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="badge text-[9px] px-1.5 py-0" style={{ background: `${s.color}12`, color: s.color, borderColor: `${s.color}30` }}>{s.category}</span>
                    {active === s.id && <span className="text-[10px] t-gold">♪ Playing</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <div className="text-center py-10 t-dim text-sm">No stations found.</div>}
        </div>
      </div>
    </div>
  );
}
