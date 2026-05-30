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
  wizard: "🧙", warrior: "⚔", rogue: "🗡", archer: "🏹"
};

function getDisplayName(u: ChatUser): string {
  return u.displayName || u.username;
}

function renderAvatar(u: ChatUser) {
  if (u.profileImage) {
    return <img src={u.profileImage} alt="" className="w-full h-full object-cover" />;
  }
  return <span>{avatarEmojis[u.avatar] || "👤"}</span>;
}

export default function ChatClient({ username, userId }: { username: string; userId: string }) {
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
          <span>💬</span> <h3>Chat Tavern — The Gathering Hall</h3>
        </div>
      </div>

      <div className="flex gap-4" style={{ height: "calc(100vh - 220px)" }}>
        {/* Channels */}
        <div className="w-40 flex-shrink-0 hidden md:block">
          <div className="frame h-full">
            <div className="frame-header">
              <span>📢</span> <h3>Channels</h3>
            </div>
            <div className="frame-inner p-1">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.name)}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors border mb-1 ${
                    activeChannel === ch.name
                      ? "border-guild-gold bg-guild-gold bg-opacity-10 text-guild-gold"
                      : "border-transparent text-guild-text-dim hover:text-guild-text-light hover:bg-guild-bg-alt"
                  }`}
                >
                  {ch.icon} #{ch.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="frame flex-1 flex flex-col">
            <div className="frame-header">
              <span>{channels.find((c) => c.name === activeChannel)?.icon || "💬"}</span>
              <h3>#{activeChannel}</h3>
              <span className="ml-auto text-guild-text-dim text-xs">
                [{messages.length} messages]
              </span>
            </div>

            {/* Mobile channel select */}
            <select
              value={activeChannel}
              onChange={(e) => setActiveChannel(e.target.value)}
              className="md:hidden mx-2 mt-2 bg-guild-bg border border-guild-border text-guild-text p-2 text-xs"
            >
              {channels.map((ch) => (
                <option key={ch.id} value={ch.name}>
                  {ch.icon} #{ch.name}
                </option>
              ))}
            </select>

            {/* Messages */}
            <div className="frame-inner flex-1 overflow-y-auto p-2">
              {messages.length === 0 && (
                <div className="text-center py-8 text-guild-text-dim">
                  <div className="text-3xl mb-2">🍺</div>
                  <p className="text-xs">The tavern is quiet...</p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className="border-b border-guild-border border-opacity-50 py-2 mb-1">
                  {msg.type === "system" ? (
                    <p className="text-guild-text-dim text-xs italic text-center">
                      *** {msg.content} ***
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <div className="avatar-frame w-6 h-6 flex-shrink-0">
                        <div className="avatar-inner w-full h-full flex items-center justify-center text-xs">
                          {renderAvatar(msg.user)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-guild-gold">
                            {getDisplayName(msg.user)}
                          </span>
                          <span className="text-2xs text-guild-text-dim font-mono">
                            [{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}]
                          </span>
                        </div>
                        <p className="text-xs text-guild-text mt-1 break-words">{msg.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-guild-border p-2">
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
                  className="inp flex-1"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="btn btn-gold disabled:opacity-50"
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
