import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/login");
  }

  // Check if user is admin - only admin username can access
  if (session.username !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="frame frame-gold">
        <div className="frame-header">
          <span>🛡</span>
          <h3>Admin Control Panel</h3>
          <a href="/dashboard" className="btn btn-std text-xs ml-auto">
            ← Return to Portal
          </a>
        </div>
        <div className="frame-inner">
          <p className="text-sm text-guild-text-dim">
            Welcome, Administrator. Manage users, announcements, and site settings from this panel.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="frame p-4 text-center">
          <div className="text-2xl mb-1">👥</div>
          <div className="font-mono text-xl text-guild-gold">--</div>
          <div className="text-2xs text-guild-text-dim uppercase">Users</div>
        </div>
        <div className="frame p-4 text-center">
          <div className="text-2xl mb-1">🎮</div>
          <div className="font-mono text-xl text-guild-gold">10</div>
          <div className="text-2xs text-guild-text-dim uppercase">Games</div>
        </div>
        <div className="frame p-4 text-center">
          <div className="text-2xl mb-1">💬</div>
          <div className="font-mono text-xl text-guild-gold">6</div>
          <div className="text-2xs text-guild-text-dim uppercase">Channels</div>
        </div>
        <div className="frame p-4 text-center">
          <div className="text-2xl mb-1">🎵</div>
          <div className="font-mono text-xl text-guild-gold">16</div>
          <div className="text-2xs text-guild-text-dim uppercase">Stations</div>
        </div>
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Management */}
        <div className="frame">
          <div className="frame-header">
            <span>👥</span>
            <h3>User Management</h3>
          </div>
          <div className="frame-inner">
            <div className="flex gap-2 mb-4">
              <a href="/admin/users" className="btn btn-gold flex-1 text-center">
                [👥] Manage Users
              </a>
              <a href="/admin/bans" className="btn btn-blood flex-1 text-center">
                [🚫] View Bans
              </a>
            </div>
            <p className="text-xs text-guild-text-dim">
              View all users, edit their stats, manage roles, and handle bans.
            </p>
          </div>
        </div>

        {/* Announcements */}
        <div className="frame">
          <div className="frame-header">
            <span>📢</span>
            <h3>Announcements</h3>
          </div>
          <div className="frame-inner">
            <a href="/admin/announcements" className="btn btn-gold w-full mb-3 text-center">
              [📢] Manage Announcements
            </a>
            <p className="text-xs text-guild-text-dim">
              Create site-wide announcements for maintenance, events, or updates.
            </p>
          </div>
        </div>

        {/* Site Settings */}
        <div className="frame">
          <div className="frame-header">
            <span>⚙</span>
            <h3>Site Settings</h3>
          </div>
          <div className="frame-inner">
            <a href="/admin/settings" className="btn btn-gold w-full mb-3 text-center">
              [⚙] Configure Settings
            </a>
            <p className="text-xs text-guild-text-dim">
              Toggle maintenance mode, adjust XP multipliers, and more.
            </p>
          </div>
        </div>

        {/* Audit Log */}
        <div className="frame">
          <div className="frame-header">
            <span>📜</span>
            <h3>Audit Log</h3>
          </div>
          <div className="frame-inner">
            <a href="/admin/logs" className="btn btn-std w-full mb-3 text-center">
              [📜] View Activity Log
            </a>
            <p className="text-xs text-guild-text-dim">
              Review all administrative actions and changes.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="frame">
        <div className="frame-header">
          <span>⚡</span>
          <h3>Quick Actions</h3>
        </div>
        <div className="frame-inner">
          <div className="flex flex-wrap gap-2">
            <a href="/admin/users" className="btn btn-std text-xs">
              [+] Create User
            </a>
            <a href="/admin/announcements" className="btn btn-std text-xs">
              [+] New Announcement
            </a>
            <form action="/api/admin/gold-reset" method="POST" className="inline">
              <button type="submit" className="btn btn-std text-xs" onClick={(e) => { if(!confirm('Reset all user gold?')) e.preventDefault(); }}>
                [💰] Daily Gold Reset
              </button>
            </form>
            <form action="/api/admin/clear-chat" method="POST" className="inline">
              <button type="submit" className="btn btn-blood text-xs" onClick={(e) => { if(!confirm('Clear all chat messages?')) e.preventDefault(); }}>
                [🗑] Clear Chat Log
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
