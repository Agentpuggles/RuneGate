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
}

const categories = [
  { id: "all", label: "All" },
  { id: "lofi", label: "Lofi" },
  { id: "fantasy", label: "Fantasy" },
  { id: "epic", label: "Epic" },
  { id: "ambient", label: "Ambient" },
  { id: "medieval", label: "Medieval" },
  { id: "dark", label: "Dark" },
  { id: "nature", label: "Nature" },
  { id: "retro", label: "Retro" },
];

const yt = (v: string) => `https://www.youtube.com/embed/${v}?autoplay=0&rel=0`;

const stations: Station[] = [
  { id: "lofi-girl", title: "Lofi Girl Radio", description: "24/7 lofi hip hop — beats to relax/study", category: "lofi", icon: "☕", embedUrl: yt("EWrX250Zhko"), color: "gold" },
  { id: "chill-lofi", title: "Chill Lofi Beats", description: "Late night chill — smooth and mellow", category: "lofi", icon: "🌙", embedUrl: yt("7NOSDKb0HlU"), color: "amethyst" },
  { id: "fantasy-ambient", title: "Fantasy Ambient Mix", description: "Atmospheric fantasy for exploration", category: "fantasy", icon: "🏰", embedUrl: yt("0p6UidTS7Ao"), color: "amethyst" },
  { id: "tavern-music", title: "Fantasy Tavern Music", description: "Cozy tavern — lutes and firesides", category: "fantasy", icon: "🍺", embedUrl: yt("vK5VwVyxkbI"), color: "gold" },
  { id: "epic-orchestral", title: "Epic Orchestral", description: "Grand pieces — feel heroic!", category: "epic", icon: "⚔", embedUrl: yt("pqLozDMkEWM"), color: "gold" },
  { id: "epic-battle", title: "Epic Battle Music", description: "Intense battle anthems!", category: "epic", icon: "🛡", embedUrl: yt("CNYdzjS-dAE"), color: "blood" },
  { id: "space-ambient", title: "Space Ambience", description: "Deep space — drift among stars", category: "ambient", icon: "🌌", embedUrl: yt("AXvnFk38sDQ"), color: "sapphire" },
  { id: "rain", title: "Rain & Thunder", description: "Gentle rain with distant thunder", category: "ambient", icon: "🌧", embedUrl: yt("42M3esYyHdw"), color: "sapphire" },
  { id: "medieval-folk", title: "Medieval Folk Music", description: "Authentic medieval melodies", category: "medieval", icon: "🗡", embedUrl: yt("IxPANmjPaek"), color: "gold" },
  { id: "celtic-harp", title: "Celtic Harp Music", description: "Soothing Celtic harp — bards of old", category: "medieval", icon: "🎶", embedUrl: yt("MpYNcBrQvkg"), color: "emerald" },
  { id: "dark-dungeon", title: "Dark Dungeon Ambient", description: "Eerie dungeon — explore the depths", category: "dark", icon: "💀", embedUrl: yt("Y4u7D7xCvtw"), color: "amethyst" },
  { id: "gothic-choir", title: "Gothic Choir Music", description: "Haunting gothic choir echoes", category: "dark", icon: "🏚", embedUrl: yt("kGRiYFknx_c"), color: "amethyst" },
  { id: "forest", title: "Enchanted Forest", description: "Birds, streams, and forest sounds", category: "nature", icon: "🌿", embedUrl: yt("Hp7QKP2FivA"), color: "emerald" },
  { id: "ocean", title: "Ocean Waves", description: "Calm ocean on a mystical shore", category: "nature", icon: "🌊", embedUrl: yt("_BMi3usEwi8"), color: "sapphire" },
  { id: "synthwave", title: "Synthwave / Retrowave", description: "80s-inspired neon drives", category: "retro", icon: "🕹", embedUrl: yt("UedTcufyrHc"), color: "blood" },
  { id: "dungeon-synth", title: "Dungeon Synth", description: "Medieval lo-fi from the underground", category: "retro", icon: "🗝", embedUrl: yt("I7zSkdKdzGI"), color: "gold" },
];

export default function MusicClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStations = stations.filter((station) => {
    if (activeCategory !== "all" && station.category !== activeCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return station.title.toLowerCase().includes(query) || station.description.toLowerCase().includes(query);
    }
    return true;
  });

  const currentStation = stations.find((s) => s.id === activeStation);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="frame">
        <div className="frame-header">
          <span>🎵</span> <h3>Bard's Hall — Music & Ambience</h3>
          <span className="ml-auto text-guild-text-dim text-xs">[{stations.length} stations]</span>
        </div>
      </div>

      {/* Now Playing */}
      {currentStation && (
        <div className="frame frame-gold">
          <div className="frame-header">
            <span>▶</span> <h3>Now Playing: {currentStation.title}</h3>
            <button onClick={() => setActiveStation(null)} className="btn btn-blood ml-auto text-xs">
              [X] Stop
            </button>
          </div>
          <div className="frame-inner p-0">
            <div className="aspect-video bg-black" style={{ maxWidth: "100%" }}>
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

      {/* Filter */}
      <div className="frame">
        <div className="frame-header">
          <span>📻</span> <h3>Browse Stations</h3>
        </div>
        <div className="frame-inner">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stations..."
            className="inp mb-3"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`btn ${activeCategory === cat.id ? "btn-gold" : "btn-std"} text-xs`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stations List */}
      <div className="frame">
        <div className="frame-inner p-0">
          {filteredStations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🎵</div>
              <p className="text-guild-text-dim">No stations found.</p>
            </div>
          ) : (
            <table className="guild-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>Icon</th>
                  <th>Station</th>
                  <th style={{ width: "100px" }}>Category</th>
                  <th style={{ width: "80px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStations.map((station) => (
                  <tr key={station.id} className={activeStation === station.id ? "bg-guild-gold bg-opacity-10" : ""}>
                    <td className="text-2xl text-center">{station.icon}</td>
                    <td>
                      <div className="font-bold text-guild-text-light">{station.title}</div>
                      <p className="text-xs text-guild-text-dim">{station.description}</p>
                    </td>
                    <td>
                      <span className={`badge badge-${station.color as string}`}>
                        {station.category}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setActiveStation(activeStation === station.id ? null : station.id)}
                        className={`btn ${activeStation === station.id ? "btn-blood" : "btn-gold"} text-xs`}
                      >
                        {activeStation === station.id ? "[X]" : "[▶]"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
