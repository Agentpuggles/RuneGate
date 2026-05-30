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

const categories = [
  { id: "all", label: "All", icon: "music" },
  { id: "lofi", label: "Lofi & Chill", icon: "coffee" },
  { id: "fantasy", label: "Fantasy", icon: "castle" },
  { id: "epic", label: "Epic", icon: "swords" },
  { id: "ambient", label: "Ambient", icon: "moon" },
  { id: "medieval", label: "Medieval", icon: "dagger" },
  { id: "dark", label: "Dark", icon: "skull" },
  { id: "nature", label: "Nature", icon: "trees" },
  { id: "retro", label: "Retro", icon: "joystick" },
];

const iconMap: Record<string, string> = {
  music: "",
  coffee: "",
  castle: "",
  swords: "",
  moon: "",
  dagger: "",
  skull: "",
  trees: "",
  joystick: "",
};

const yt = (v: string) => `https://www.youtube.com/embed/${v}?autoplay=0&rel=0`;

const stations: Station[] = [
  {
    id: "lofi-girl",
    title: "Lofi Girl Radio",
    description: "The classic 24/7 lofi hip hop radio - beats to relax/study to",
    category: "lofi",
    icon: "",
    embedUrl: yt("EWrX250Zhko"),
    color: "#e8967a",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=180&fit=crop",
  },
  {
    id: "chill-lofi",
    title: "Chill Lofi Beats",
    description: "Late night chill beats - smooth and mellow vibes",
    category: "lofi",
    icon: "",
    embedUrl: yt("7NOSDKb0HlU"),
    color: "#7a96b0",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=180&fit=crop",
  },
  {
    id: "fantasy-ambient",
    title: "Fantasy Ambient Mix",
    description: "Atmospheric fantasy music for exploration and world-building",
    category: "fantasy",
    icon: "",
    embedUrl: yt("0p6UidTS7Ao"),
    color: "#a855f7",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=180&fit=crop",
  },
  {
    id: "tavern-music",
    title: "Fantasy Tavern Music",
    description: "Cozy tavern ambience - lutes, firesides, and merry company",
    category: "fantasy",
    icon: "",
    embedUrl: yt("vK5VwVyxkbI"),
    color: "#fbbf24",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=180&fit=crop",
  },
  {
    id: "epic-orchestral",
    title: "Epic Orchestral Music",
    description: "Grand orchestral pieces - for when you need to feel heroic",
    category: "epic",
    icon: "",
    embedUrl: yt("pqLozDMkEWM"),
    color: "#f59e0b",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&h=180&fit=crop",
  },
  {
    id: "epic-battle",
    title: "Epic Battle Music",
    description: "Intense battle anthems - charge into the fray!",
    category: "epic",
    icon: "",
    embedUrl: yt("CNYdzjS-dAE"),
    color: "#ef4444",
    image: "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=300&h=180&fit=crop",
  },
  {
    id: "space-ambient",
    title: "Space Ambience",
    description: "Deep space ambient - drift among the stars",
    category: "ambient",
    icon: "",
    embedUrl: yt("AXvnFk38sDQ"),
    color: "#3b82f6",
    image: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=300&h=180&fit=crop",
  },
  {
    id: "rain",
    title: "Rain & Thunder",
    description: "Gentle rain with distant thunder - perfect for reading scrolls",
    category: "ambient",
    icon: "",
    embedUrl: yt("42M3esYyHdw"),
    color: "#60a5fa",
    image: "https://images.unsplash.com/photo-1501691223387-dd0500403074?w=300&h=180&fit=crop",
  },
  {
    id: "medieval-folk",
    title: "Medieval Folk Music",
    description: "Authentic medieval and Renaissance folk melodies",
    category: "medieval",
    icon: "",
    embedUrl: yt("IxPANmjPaek"),
    color: "#b45309",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=180&fit=crop",
  },
  {
    id: "celtic-harp",
    title: "Celtic Harp Music",
    description: "Soothing Celtic harp melodies - the bards of old",
    category: "medieval",
    icon: "",
    embedUrl: yt("MpYNcBrQvkg"),
    color: "#10b981",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=180&fit=crop",
  },
  {
    id: "dark-dungeon",
    title: "Dark Ambient Dungeon",
    description: "Eerie dungeon ambience - explore the depths if you dare",
    category: "dark",
    icon: "",
    embedUrl: yt("Y4u7D7xCvtw"),
    color: "#a855f7",
    image: "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=300&h=180&fit=crop",
  },
  {
    id: "gothic-choir",
    title: "Gothic Choir Music",
    description: "Haunting gothic choir - echoes of the ancient cathedral",
    category: "dark",
    icon: "",
    embedUrl: yt("kGRiYFknx_c"),
    color: "#64748b",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=180&fit=crop",
  },
  {
    id: "forest",
    title: "Enchanted Forest",
    description: "Birds, streams, and forest sounds - nature's own symphony",
    category: "nature",
    icon: "",
    embedUrl: yt("Hp7QKP2FivA"),
    color: "#34d399",
    image: "https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=300&h=180&fit=crop",
  },
  {
    id: "ocean",
    title: "Ocean Waves",
    description: "Calm ocean waves on a mystical shore",
    category: "nature",
    icon: "",
    embedUrl: yt("_BMi3usEwi8"),
    color: "#3b82f6",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=300&h=180&fit=crop",
  },
  {
    id: "synthwave",
    title: "Synthwave / Retrowave",
    description: "80s-inspired synthwave - neon drives through fantasy",
    category: "retro",
    icon: "",
    embedUrl: yt("UedTcufyrHc"),
    color: "#ec4899",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=180&fit=crop",
  },
  {
    id: "dungeon-synth",
    title: "Dungeon Synth",
    description: "Medieval lo-fi dungeon synth from the underground",
    category: "retro",
    icon: "",
    embedUrl: yt("I7zSkdKdzGI"),
    color: "#c2410c",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=180&fit=crop",
  },
];

export default function MusicClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStations = stations.filter((station) => {
    if (activeCategory !== "all" && station.category !== activeCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        station.title.toLowerCase().includes(query) ||
        station.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const currentStation = stations.find((s) => s.id === activeStation);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-rune text-portal-gold">Bard's Hall</h1>
          <p className="text-sm text-portal-text-muted">Music & Ambience - {stations.length} stations</p>
        </div>
      </div>

      {/* Now Playing */}
      {currentStation && (
        <div className="panel panel-gold">
          <div className="panel-header">
            <span className="icon"></span>
            <h3>Now Playing: {currentStation.title}</h3>
            <button
              onClick={() => setActiveStation(null)}
              className="btn btn-ghost text-sm ml-auto"
            >
              Stop
            </button>
          </div>
          <div className="p-0">
            <div className="relative">
              <img
                src={currentStation.image}
                alt=""
                className="w-full h-56 object-cover"
                style={{ filter: "brightness(0.5)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-portal-bg-base via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 flex items-center gap-3">
                <span className="text-4xl">{currentStation.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-portal-text-primary">{currentStation.title}</h3>
                  <p className="text-sm text-portal-text-muted">{currentStation.category}</p>
                </div>
              </div>
            </div>
            <div className="aspect-video">
              <iframe
                src={currentStation.embedUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={currentStation.title}
                style={{ border: "none" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Browse Stations */}
      <div className="panel">
        <div className="panel-header">
          <span className="icon"></span>
          <h3>Browse Stations</h3>
        </div>
        <div className="panel-body space-y-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stations..."
            className="input"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`btn ${activeCategory === cat.id ? "btn-primary" : "btn-ghost"}`}
              >
                {iconMap[cat.icon]} {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                className={`mcard ${activeStation === station.id ? "active" : ""}`}
                onClick={() => setActiveStation(activeStation === station.id ? null : station.id)}
                style={{
                  borderLeft: `4px solid ${station.color}`,
                }}
              >
                <div className="relative">
                  <img
                    src={station.image}
                    alt=""
                    className="w-full h-32 object-cover"
                    loading="lazy"
                    style={{
                      filter: activeStation === station.id
                        ? "brightness(0.7)"
                        : "brightness(0.5)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-portal-bg-base via-transparent to-transparent" />
                  {activeStation === station.id && (
                    <div className="absolute top-3 right-3">
                      <div className="badge badge-arcade">Playing</div>
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{station.icon}</span>
                    <h4 className="text-sm font-semibold text-portal-text-primary truncate">
                      {station.title}
                    </h4>
                  </div>
                  <p className="text-xs text-portal-text-muted line-clamp-2 mb-3">
                    {station.description}
                  </p>
                  <div
                    className="badge text-2xs"
                    style={{
                      background: `${station.color}15`,
                      color: station.color,
                    }}
                  >
                    {station.category}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-portal-text-muted">No stations found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
