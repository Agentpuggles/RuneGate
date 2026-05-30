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
  wizard: "",
  warrior: "",
  rogue: "",
  archer: "",
  healer: "",
  dragon: "",
  ghost: "",
  knight: "",
  bard: "",
  necro: "",
  demon: "",
  angel: "",
  vampire: "",
  elf: "",
  dwarf: "",
  cyber: "",
  default: "",
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
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-rune text-portal-gold">Chat Tavern</h1>
          <p className="text-sm text-portal-text-muted">The Gathering Hall</p>
        </div>
      </div>

      <div className="flex gap-4" style={{ height: "calc(100vh - 220px)" }}>
        {/* Channels sidebar */}
        <div className="w-48 flex-shrink-0 hidden md:block">
          <div className="panel h-full">
            <div className="panel-header">
              <span className="icon"></span>
              <h3>Channels</h3>
            </div>
            <div className="panel-body p-2 space-y-1">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.name)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
                    activeChannel === ch.name
                      ? "bg-portal-gold/10 text-portal-gold border-l-2 border-portal-gold"
                      : "text-portal-text-muted hover:bg-portal-bg-elevated hover:text-portal-text-primary"
                  }`}
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
          <div className="panel flex-1 flex flex-col overflow-hidden">
            <div className="panel-header">
              <span>{channels.find((c) => c.name === activeChannel)?.icon || ""}</span>
              <h3>#{activeChannel}</h3>
              <span className="text-xs text-portal-text-dim ml-2">
                {channels.find((c) => c.name === activeChannel)?.description}
              </span>
              <span className="text-xs text-portal-text-dim ml-auto">{messages.length} messages</span>
            </div>

            {/* Mobile channel select */}
            <select
              value={activeChannel}
              onChange={(e) => setActiveChannel(e.target.value)}
              className="md:hidden mx-4 mt-3 px-3 py-2 rounded-lg text-sm bg-portal-bg-base border border-portal-border text-portal-text-primary"
            >
              {channels.map((ch) => (
                <option key={ch.id} value={ch.name}>
                  {ch.icon} #{ch.name}
                </option>
              ))}
            </select>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4 opacity-30"></div>
                  <p className="text-portal-text-muted">The tavern is quiet...</p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className="chat-message">
                  {msg.type === "system" ? (
                    <span className="italic text-portal-text-dim text-xs text-center block py-2">
                      *** {msg.content} ***
                    </span>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="avatar avatar-sm">
                        {renderAvatar(msg.user)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-semibold text-portal-sapphire">
                            {getDisplayName(msg.user)}
                          </span>
                          <span className="text-2xs text-portal-text-dim">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-portal-text-secondary break-words">{msg.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-portal-border">
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
                  placeholder={`Message #${activeChannel}...`}
                  className="input flex-1"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="btn btn-primary px-4 disabled:opacity-50"
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
