import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session.isLoggedIn) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-login flex items-center justify-center relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Runed circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-forum-gold-dim/20" style={{ animation: "spin 30s linear infinite" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-forum-border/20" style={{ animation: "spin 20s linear infinite reverse" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-forum-gold-dim/10" style={{ animation: "spin 25s linear infinite" }} />
        
        {/* Scattered rune dots */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: `${2 + Math.random() * 2}px`,
              height: `${2 + Math.random() * 2}px`,
              background: i % 2 === 0 ? "#c9a84c" : "#8b6cc4",
              opacity: 0.3 + Math.random() * 0.3,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">🌀</div>
          <h1 className="text-4xl font-rune text-shimmer mb-2">RUNEGATE</h1>
          <p className="text-forum-text-dim font-mono text-xs tracking-wider">
            Fantasy Portal &bull; Private Realm Access
          </p>
          <hr className="divider mt-4" />
        </div>

        <LoginForm />

        <div className="text-center mt-6">
          <p className="text-forum-text-dim/40 text-[10px] font-mono">
            RuneGate v2.0 — The realm awaits
          </p>
        </div>
      </div>
    </div>
  );
}
