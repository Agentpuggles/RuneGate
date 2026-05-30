"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ChatUser {
  username: string;
  displayName: string | null;
  avatar: string;
  profileImage: string | null;
}

interface ChatMessage {
  id: string;
  content: string;
  type: string;
  createdAt: string;
  user: ChatUser;
}

const avatarEmojis: Record<string, string> = {
  wizard: "🧙", warrior: "⚔", rogue: "🗡", archer: "🏹", healer: "✨",
  dragon: "🐉", ghost: "👻", knight: "🛡", bard: "🎵", necro: "💀",
  demon: "😈", angel: "😇", vampire: "🧛", elf: "🧝", dwarf: "⛏", cyber: "🤖",
};

function getDisplayName(u: ChatUser): string {
  return u.displayName || u.username;
}

function renderAvatar(u: ChatUser) {
  if (u.profileImage) {
    return <img src={u.profileImage} alt="" className="w-full h-full object-cover" />;
  }
  return <span className="text-2xl">{avatarEmojis[u.avatar] || "👤"}</span>;
}

export default function ChatClient({ username, userId }: { username: string; userId: string }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState("lobby");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMessageIdRef = useRef<string>("");

  const fetchChannels = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/channels");
      const data = await res.json();
      if (data.channels) setChannels(data.channels);
    } catch {
      // Handle error silently
    }
  }, []);

  const fetchMessages = useCallback(async (scrollToBottom = true) => {
    try {
      const params = new URLSearchParams({ channel: activeChannel, limit: "50" });
      if (lastMessageIdRef.current) {
        params.set("after", lastMessageIdRef.current);
      }
      const res = await fetch(`/api/chat/messages?${params}`);
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMsgs = data.messages.filter((m: ChatMessage) => !existingIds.has(m.id));
          if (newMsgs.length === 0) return prev;
          return [...prev, ...newMsgs];
        });
        lastMessageIdRef.current = data.messages[data.messages.length - 1].id;
        if (scrollToBottom) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    } catch {
      // Handle error silently
    }
  }, [activeChannel]);

  useEffect(() => {
    fetchChannels();
    setLoading(false);
  }, [fetchChannels]);

  useEffect(() => {
    setMessages([]);
    lastMessageIdRef.current = "";
    fetchMessages();
  }, [activeChannel, fetchMessages]);

  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => {
      fetchMessages(false);
    }, 3000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchMessages]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input, channelName: activeChannel }),
      });
      if (res.ok) {
        setInput("");
        await fetchMessages();
      }
    } catch {
      // Handle error silently
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="frame">
        <div className="frame-header">
          <span className="text-2xl">💬</span>
          <h3 className="text-lg">Chat Tavern — The Gathering Hall</h3>
        </div>
      </div>

      <div className="flex gap-4" style={{ height: "calc(100vh - 240px)", minHeight: "500px" }}>
        {/* Channels */}
        <div className="w-48 flex-shrink-0 hidden md:block">
          <div className="frame h-full">
            <div className="frame-header">
              <span>📢</span> <h3>Channels</h3>
            </div>
            <div className="frame-inner p-2">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.name)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors border mb-2 ${
                    activeChannel === ch.name
                      ? "border-guild-gold bg-guild-gold bg-opacity-10 text-guild-gold"
                      : "border-transparent text-guild-text-dim hover:text-guild-text-light hover:bg-guild-bg-alt"
                  }`}
                >
                  <span className="text-xl mr-2">{ch.icon}</span>
                  #{ch.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="frame flex-1 flex flex-col">
            <div className="frame-header">
              <span className="text-xl">{channels.find((c) => c.name === activeChannel)?.icon || "💬"}</span>
              <h3 className="text-base">#{activeChannel}</h3>
              <span className="ml-auto text-guild-text-dim text-xs">
                {channels.find((c) => c.name === activeChannel)?.description}
              </span>
            </div>

            {/* Mobile channel select */}
            <select
              value={activeChannel}
              onChange={(e) => setActiveChannel(e.target.value)}
              className="md:hidden mx-3 mt-3 bg-guild-bg border border-guild-border text-guild-text p-3"
            >
              {channels.map((ch) => (
                <option key={ch.id} value={ch.name}>
                  {ch.icon} #{ch.name}
                </option>
              ))}
            </select>

            {/* Messages */}
            <div className="frame-inner flex-1 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="text-center py-12 text-guild-text-dim">
                  <div className="text-5xl mb-4">🍺</div>
                  <p>The tavern is quiet...</p>
                </div>
              )}

              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="border-b border-guild-border border-opacity-30 pb-3">
                    {msg.type === "system" ? (
                      <p className="text-guild-text-dim text-sm italic text-center py-2">
                        *** {msg.content} ***
                      </p>
                    ) : (
                      <div className="flex gap-4">
                        {/* Large Avatar */}
                        <div className="avatar-frame avatar-frame-gold w-14 h-14 flex-shrink-0">
                          <div className="avatar-inner w-full h-full flex items-center justify-center">
                            {renderAvatar(msg.user)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-base text-guild-gold">
                              {getDisplayName(msg.user)}
                            </span>
                            <span className="text-xs text-guild-text-dim font-mono">
                              [{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}]
                            </span>
                          </div>
                          <p className="text-sm text-guild-text leading-relaxed break-words">{msg.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-guild-border p-3">
              <form onSubmit={sendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (input.startsWith("/join ")) {
                        setActiveChannel(input.slice(6).trim());
                        setInput("");
                      } else {
                        sendMessage();
                      }
                    }
                  }}
                  placeholder={`Message #${activeChannel}... (Enter to send)`}
                  className="inp flex-1 py-3"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="btn btn-gold disabled:opacity-50 px-6"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
