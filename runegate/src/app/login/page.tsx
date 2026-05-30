import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session.isLoggedIn) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-login flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radiating circles */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-portal-gold/10 animate-spin"
          style={{ animationDuration: "40s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-portal-amethyst/10 animate-spin"
          style={{ animationDuration: "30s", animationDirection: "reverse" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-portal-gold/15 animate-spin"
          style={{ animationDuration: "20s" }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: `${3 + Math.random() * 4}px`,
              height: `${3 + Math.random() * 4}px`,
              background: i % 3 === 0
                ? "rgba(251, 191, 36, 0.4)"
                : i % 3 === 1
                  ? "rgba(168, 85, 247, 0.4)"
                  : "rgba(59, 130, 246, 0.4)",
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-portal-gold to-portal-gold-dark mb-6 animate-glow shadow-glow-gold">
            <span className="text-4xl animate-float">Portal</span>
          </div>
          <h1 className="text-5xl font-rune text-shimmer mb-3">RUNEGATE</h1>
          <p className="text-portal-text-muted font-mono text-xs tracking-widest uppercase">
            Fantasy Portal • Private Realm Access
          </p>
        </div>

        <LoginForm />

        <div className="text-center mt-8">
          <p className="text-portal-text-dim/50 text-xs font-mono">
            RuneGate v2.0 • The realm awaits
          </p>
        </div>
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3 text-portal-text-dim/30">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-portal-gold/30 to-transparent" />
          <span className="text-portal-gold/40">Auth</span>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-portal-gold/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}
