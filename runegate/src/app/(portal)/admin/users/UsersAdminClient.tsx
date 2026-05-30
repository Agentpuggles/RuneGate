"use client";

import { useState } from "react";

interface User {
  id: string;
  username: string;
  displayName: string | null;
  title: string;
  rank: string;
  level: number;
  xp: number;
  gold: number;
  createdAt: string;
  lastLogin: string;
  avatar: string;
  profileImage: string | null;
  bio: string;
}

export default function UsersAdminClient({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newUserPassword, setNewUserPassword] = useState("");

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      (u.displayName?.toLowerCase().includes(q)) ||
      u.title.toLowerCase().includes(q)
    );
  });

  const handleUpdateUser = async (user: User) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
        setShowModal(false);
        setEditingUser(null);
      }
    } catch {
      // Handle error
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editingUser.username,
          password: newUserPassword,
          displayName: editingUser.displayName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) => [data.user, ...prev]);
        setShowModal(false);
        setEditingUser(null);
        setNewUserPassword("");
      }
    } catch {
      // Handle error
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch {
      // Handle error
    }
  };

  const handleAddGold = async (userId: string, amount: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/gold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, gold: data.gold } : u)));
      }
    } catch {
      // Handle error
    }
  };

  const handleAddXP = async (userId: string, amount: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/xp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, xp: data.xp, level: data.level } : u)));
      }
    } catch {
      // Handle error
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="frame">
        <div className="frame-header">
          <span>👥</span>
          <h3>User Management</h3>
          <a href="/admin" className="btn btn-std text-xs ml-auto">
            ← Back to Admin
          </a>
        </div>
      </div>

      {/* Toolbar */}
      <div className="frame">
        <div className="frame-inner flex flex-wrap gap-3 items-center justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="inp w-64"
          />
          <button
            onClick={() => {
              setEditingUser({
                id: "",
                username: "",
                displayName: "",
                title: "Seeker of the Arcane",
                rank: "Initiate",
                level: 1,
                xp: 0,
                gold: 0,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                avatar: "wizard",
                profileImage: null,
                bio: "",
              });
              setShowModal(true);
            }}
            className="btn btn-gold"
          >
            [+ New User]
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="frame">
        <div className="frame-inner p-0 overflow-x-auto">
          <table className="guild-table text-xs">
            <thead>
              <tr>
                <th>Username</th>
                <th>Title</th>
                <th>Rank</th>
                <th>Level</th>
                <th>XP</th>
                <th>Gold</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="font-bold">{user.displayName || user.username}</td>
                  <td className="text-guild-gold text-xs">{user.title}</td>
                  <td>{user.rank}</td>
                  <td className="font-mono">{user.level}</td>
                  <td className="font-mono">{user.xp}</td>
                  <td className="font-mono text-guild-gold">💰 {user.gold}</td>
                  <td className="text-guild-text-dim">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowModal(true);
                        }}
                        className="btn btn-std text-xs px-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAddGold(user.id, 100)}
                        className="btn btn-gold text-xs px-2"
                      >
                        +100💰
                      </button>
                      <button
                        onClick={() => handleAddXP(user.id, 100)}
                        className="btn btn-std text-xs px-2"
                      >
                        +100XP
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn btn-blood text-xs px-2"
                      >
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="frame max-w-md w-full mx-4">
            <div className="frame-header">
              <span>{editingUser.id ? "✏" : "+"}</span>
              <h3>{editingUser.id ? "Edit User" : "Create New User"}</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-blood text-xs ml-auto">
                ✕
              </button>
            </div>
            <div className="frame-inner">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingUser.id) {
                    handleUpdateUser(editingUser);
                  } else {
                    handleCreateUser(e);
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs text-guild-text-dim mb-1">Username</label>
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="inp"
                    readOnly={!!editingUser.id}
                  />
                </div>
                {!editingUser.id && (
                  <div>
                    <label className="block text-xs text-guild-text-dim mb-1">Password</label>
                    <input
                      type="text"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="inp"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-guild-text-dim mb-1">Display Name</label>
                  <input
                    type="text"
                    value={editingUser.displayName || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })}
                    className="inp"
                  />
                </div>
                <div>
                  <label className="block text-xs text-guild-text-dim mb-1">Display Name</label>
                  <input
                    type="text"
                    value={editingUser.displayName || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })}
                    className="inp"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-guild-text-dim mb-1">Level</label>
                    <input
                      type="number"
                      value={editingUser.level}
                      onChange={(e) => setEditingUser({ ...editingUser, level: parseInt(e.target.value) || 1 })}
                      className="inp"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-guild-text-dim mb-1">Gold</label>
                    <input
                      type="number"
                      value={editingUser.gold}
                      onChange={(e) => setEditingUser({ ...editingUser, gold: parseInt(e.target.value) || 0 })}
                      className="inp"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-guild-text-dim mb-1">XP</label>
                    <input
                      type="number"
                      value={editingUser.xp}
                      onChange={(e) => setEditingUser({ ...editingUser, xp: parseInt(e.target.value) || 0 })}
                      className="inp"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-guild-text-dim mb-1">Rank</label>
                    <input
                      type="text"
                      value={editingUser.rank}
                      onChange={(e) => setEditingUser({ ...editingUser, rank: e.target.value })}
                      className="inp"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-guild-text-dim mb-1">Title</label>
                  <input
                    type="text"
                    value={editingUser.title}
                    onChange={(e) => setEditingUser({ ...editingUser, title: e.target.value })}
                    className="inp"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-gold flex-1">
                    {editingUser.id ? "Save Changes" : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
