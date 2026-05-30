"use client";

export default function AdminQuickActions() {
  return (
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
  );
}
