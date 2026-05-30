# 🌀 RUNEGATE — Fantasy Portal v2.0

> *A private, login-only fantasy forum-style portal — games, music, chat, search, and more.*

---

## 🚀 Quick Start

```bash
cd runegate
npm install
npm run setup     # Init DB + seed
npm run dev       # http://localhost:3000
```

**Login:** `admin` / `runegate`

---

## 🧩 Core Systems

| System | Description |
|--------|-------------|
| 🏰 **Portal Hub** | Forum-style dashboard with realm tiles, bulletin board, XP/gold |
| 🎮 **Games Realm** | 10 HTML5 games, categories, favorites, fullscreen, CRT filter |
| 🎵 **Bard's Hall** | 16 music stations (lofi, fantasy, epic, ambient, medieval, etc.) |
| 🔍 **Arcane Search** | Server-side proxy with Scroll/Portal/Terminal modes |
| 💬 **Chat Tavern** | 6 channels, real-time polling, IRC-inspired |
| 👤 **Character Sheet** | Display name, bio, avatar, title, profile image, stats |

## 🎵 Music Stations

Bard's Hall features embedded YouTube streams:
- ☕ Lofi & Chill (Lofi Girl, Chill Beats)
- 🏰 Fantasy (Ambient, Tavern Music)
- ⚔️ Epic & Orchestral (Battle, Heroic)
- 🌙 Ambient (Space, Rain & Thunder)
- 🗡️ Medieval (Folk, Celtic Harp)
- 💀 Dark & Gothic (Dungeon, Choir)
- 🌿 Nature (Forest, Ocean)
- 🕹️ Retro (Synthwave, Dungeon Synth)

## 🎮 10 Playable Games

Snake, Memory, Tetris, Dungeon Crawler, Space Invaders, Tic-Tac-Toe, Platformer, Word Puzzle, Strategy, Reaction

## 🎨 Visual Style

2010s fantasy forum aesthetic:
- Gold/bronze borders and accents
- Gradient panel headers
- MedievalSharp font for headings
- Forum-style badges and stat bars
- Warm cream text on deep dark backgrounds
- Corner ornaments and dividers

## 📂 Key Files

```
src/
├── app/
│   ├── login/          # Public login
│   ├── (portal)/       # Authenticated routes
│   │   ├── dashboard/  # Hub
│   │   ├── games/      # Arcade + player
│   │   ├── music/      # Bard's Hall (NEW)
│   │   ├── search/     # Arcane Search
│   │   ├── chat/       # Tavern
│   │   └── profile/    # Character Sheet
│   └── api/            # All API routes
├── components/
│   └── PortalShell.tsx # Nav + layout
├── lib/
│   ├── auth.ts         # Session management
│   ├── db.ts           # Prisma client
│   └── search-proxy.ts # Secure search proxy
└── middleware.ts        # Auth guard
```
