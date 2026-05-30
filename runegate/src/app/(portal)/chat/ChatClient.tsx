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
  wizard: "🧙",
  warrior: "⚔️",
  rogue: "🗡️",
  archer: "🏹",
  healer: "✨",
  dragon: "🐉",
  ghost: "👻",
  knight: "🛡️",
  bard: "🎵",
  necro: "💀",
  demon: "😈",
  angel: "😇",
  vampire: "🧛",
  elf: "🧝",
  dwarf: "⛏️",
  cyber: "🤖",
  default: "👤",
};

function getDisplayName(u: ChatUser): string {
  return u.displayName || u.username;
}

function renderAvatar(u: ChatUser) {
  if (u.profileImage) {
    return (
      <img src={u.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
    );
  }
  return <span>{avatarEmojis[u.avatar] || avatarEmojis.default}</span>;
}

export default function ChatClient({ username }: { username: string; userId: string }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState("lobby");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMessageIdRef = useRef<string>("");

  const fetchChannels = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/channels");
      const data = await res.json();
      if (data.channels) setChannels(data.channels);
    } catch {
      // ignore
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
      // ignore
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
      // ignore
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="rloader" />
      </div>
    );
  }

  return (
    <div className="anim-in">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl t-title flex items-center gap-2">💬 Chat Tavern</h1>
        <span className="t-dim text-xs font-mono">The Gathering Hall</span>
      </div>

      <div className="flex gap-4" style={{ height: "calc(100vh - 200px)" }}>
        {/* Channels sidebar */}
        <div className="w-44 flex-shrink-0 hidden md:block">
          <div className="fp h-full">
            <div className="fp-head">
              <span>📢</span>
              <h3>Channels</h3>
            </div>
            <div className="fp-body space-y-1">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.name)}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs transition-all flex items-center gap-2 cursor-pointer ${
                    activeChannel === ch.name ? "t-gold" : "t-dim hover:t-cream"
                  }`}
                  style={
                    activeChannel === ch.name
                      ? { background: "rgba(201,168,76,0.1)", borderLeft: "2px solid var(--border-gold)" }
                      : {}
                  }
                >
                  <span>{ch.icon}</span>
                  <span>#{ch.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="fp flex-1 flex flex-col overflow-hidden">
            <div className="fp-head">
              <span>{channels.find((c) => c.name === activeChannel)?.icon || "💬"}</span>
              <h3>#{activeChannel}</h3>
              <span className="t-dim text-[10px] ml-2">
                {channels.find((c) => c.name === activeChannel)?.description}
              </span>
              <span className="t-dim text-[10px] ml-auto">{messages.length} messages</span>
            </div>

            {/* Mobile channel select */}
            <select
              value={activeChannel}
              onChange={(e) => setActiveChannel(e.target.value)}
              className="md:hidden mx-3 mt-2 px-2 py-1 rounded text-xs cursor-pointer"
              style={{ background: "var(--bg-dark)", border: "1px solid var(--border-light)", color: "var(--text-main)" }}
            >
              {channels.map((ch) => (
                <option key={ch.id} value={ch.name}>
                  {ch.icon} #{ch.name}
                </option>
              ))}
            </select>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {messages.length === 0 && (
                <div className="text-center py-10 t-dim">
                  <div className="text-2xl mb-2">🍺</div>
                  <p className="text-sm">The tavern is quiet...</p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className="cmsg">
                  {msg.type === "system" ? (
                    <span className="italic t-dim text-xs text-center block">
                      *** {msg.content} ***
                    </span>
                  ) : (
                    <div className="flex items-start gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 overflow-hidden"
                        style={{ background: "linear-gradient(135deg, var(--gold-dim), var(--brown))" }}
                      >
                        {renderAvatar(msg.user)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-semibold t-link">
                            {getDisplayName(msg.user)}
                          </span>
                          <span className="text-[9px] t-dim">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-xs t-cream-dim break-words">{msg.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3" style={{ borderTop: "1px solid var(--border-light)" }}>
              <form onSubmit={sendMessage} className="flex gap-2">
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
                  placeholder={`Message #${activeChannel}...`}
                  className="inp flex-1 text-xs"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="btn btn-p px-3 text-xs disabled:opacity-50 cursor-pointer"
                >
                  ⚡
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
