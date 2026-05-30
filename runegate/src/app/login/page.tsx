import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session.isLoggedIn) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-guild-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-6">
          <div className="inline-block frame frame-gold p-4 mb-4">
            <div className="frame-inner text-5xl">
              ⚔
            </div>
          </div>
          <h1 className="font-rune text-4xl text-guild-gold glow-gold tracking-widest">
            RUNEGATE
          </h1>
          <p className="font-mono text-xs text-guild-text-dim mt-2 tracking-widest">
            [ FANTASY PORTAL v2.0 ]
          </p>
          <div className="divider-ornate mt-4" />
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer Text */}
        <div className="text-center mt-6">
          <div className="divider-gold max-w-xs mx-auto" />
          <p className="font-mono text-2xs text-guild-text-dim mt-3">
            Best viewed at 1024x768 • IE 6.0+ compatible
          </p>
          <p className="font-mono text-2xs text-guild-gold mt-1">
            ★ The realm awaits ★
          </p>
        </div>
      </div>
    </div>
  );
}
