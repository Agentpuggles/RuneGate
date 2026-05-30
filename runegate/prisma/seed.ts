import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("runegate", 12);
  const user = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      displayName: "Archmage Zephyr",
      passwordHash,
      avatar: "wizard",
      bio: "Keeper of the RuneGate and master of the digital realm.",
      title: "Archmage of the Digital Gate",
      rank: "Portal Master",
      level: 42,
      xp: 13370,
      gold: 9999,
    },
  });

  const channels = [
    { name: "lobby", description: "The main tavern hall — gather and share tales", icon: "🍺" },
    { name: "raids", description: "Party up for epic quests and battles", icon: "⚔️" },
    { name: "dungeon", description: "Deep dives into the unknown abyss", icon: "🏰" },
    { name: "dev", description: "Portal construction & arcane engineering", icon: "🔧" },
    { name: "market", description: "Trade routes and bazaar gossip", icon: "🏪" },
    { name: "music", description: "Share songs and discuss bards' tales", icon: "🎵" },
  ];
  for (const ch of channels) {
    await prisma.channel.upsert({ where: { name: ch.name }, update: {}, create: ch });
  }

  const games = [
    {
      title: "Neon Serpent", slug: "neon-serpent",
      description: "Guide the cyber-serpent through the digital void. Collect energy orbs to grow longer.",
      category: "arcade", thumbnail: "🐍",
      image: "https://images.unsplash.com/photo-1615886541776-3b271e14c079?w=400&h=250&fit=crop",
      embedUrl: "/games/snake.html", controls: "keyboard", rating: 4.5,
    },
    {
      title: "Rune Memory", slug: "rune-memory",
      description: "Match pairs of ancient runes to unlock the sealed vault.",
      category: "puzzle", thumbnail: "🔮",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      embedUrl: "/games/memory.html", controls: "mouse", rating: 4.2,
    },
    {
      title: "Block Forge", slug: "block-forge",
      description: "Forge lines of enchanted blocks in this mystical tetromino challenge.",
      category: "puzzle", thumbnail: "🧱",
      image: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=400&h=250&fit=crop",
      embedUrl: "/games/tetris.html", controls: "keyboard", rating: 4.8,
    },
    {
      title: "Dungeon Depths", slug: "dungeon-depths",
      description: "Descend into dark dungeons. Battle monsters and find epic loot.",
      category: "rpg", thumbnail: "⚔️",
      image: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=400&h=250&fit=crop",
      embedUrl: "/games/dungeon.html", controls: "mouse", rating: 4.6,
    },
    {
      title: "Void Invaders", slug: "void-invaders",
      description: "Defend the realm from interdimensional invaders in this retro space shooter.",
      category: "arcade", thumbnail: "🚀",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=250&fit=crop",
      embedUrl: "/games/invaders.html", controls: "keyboard", rating: 4.3,
    },
    {
      title: "Tic Tac Rune", slug: "tic-tac-rune",
      description: "Ancient strategy game inscribed in magical rune stones.",
      category: "strategy", thumbnail: "⭕",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop",
      embedUrl: "/games/tictactoe.html", controls: "mouse", rating: 3.9,
    },
    {
      title: "Pixel Quest", slug: "pixel-quest",
      description: "Navigate treacherous pixel platforms through the enchanted forest.",
      category: "arcade", thumbnail: "🏃",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=250&fit=crop",
      embedUrl: "/games/platformer.html", controls: "keyboard", rating: 4.4,
    },
    {
      title: "Mind Tower", slug: "mind-tower",
      description: "Solve word puzzles to ascend the Tower of Knowledge.",
      category: "puzzle", thumbnail: "🗼",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=250&fit=crop",
      embedUrl: "/games/tower.html", controls: "keyboard", rating: 4.1,
    },
    {
      title: "Realm Conqueror", slug: "realm-conqueror",
      description: "Turn-based strategy. Expand your territory across the mystical lands.",
      category: "strategy", thumbnail: "👑",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop",
      embedUrl: "/games/strategy.html", controls: "mouse", rating: 4.7,
    },
    {
      title: "Reaction Bolt", slug: "reaction-bolt",
      description: "Test your reflexes — click the lightning runes before they fade.",
      category: "arcade", thumbnail: "⚡",
      image: "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=400&h=250&fit=crop",
      embedUrl: "/games/reaction.html", controls: "mouse", rating: 4.0,
    },
  ];

  for (const game of games) {
    await prisma.game.upsert({ where: { slug: game.slug }, update: {}, create: game as any });
  }

  await prisma.note.create({
    data: {
      userId: user.id,
      title: "Welcome to RuneGate",
      content: "This is your personal grimoire. Write notes, quests, and plans here!",
    },
  });

  console.log("🌱 Database seeded!");
  console.log("👤 Login: admin / runegate");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
