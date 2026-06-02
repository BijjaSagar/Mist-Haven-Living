"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AdminSaveButton,
  AdminMessage,
  AdminCard,
} from "@/components/admin/AdminShell";
import { getApiData, getApiErrorMessage } from "@/lib/api-response";

export type AdminUserData = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "editor";
};

const emptyForm: FormState = {
  name: "",
  email: "",
  password: "",
  role: "editor",
};

export function UsersEditor({ initial }: { initial: AdminUserData[] }) {
  const [users, setUsers] = useState(initial);
  const [createForm, setCreateForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    role: "admin" | "editor";
    active: boolean;
    password: string;
  }>({ name: "", role: "editor", active: true, password: "" });
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  function startEdit(user: AdminUserData) {
    setEditingId(user.id);
    setEditForm({
      name: user.name ?? "",
      role: user.role as "admin" | "editor",
      active: user.active,
      password: "",
    });
    setMessage(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({ name: "", role: "editor", active: true, password: "" });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setMessage(null);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });

    const json = await res.json();
    if (res.ok) {
      setUsers((prev) => [...prev, getApiData<AdminUserData>(json)]);
      setCreateForm(emptyForm);
      setMessage({ text: "User created.", type: "success" });
    } else {
      setMessage({ text: getApiErrorMessage(json), type: "error" });
    }
    setCreating(false);
  }

  async function handleUpdate(id: string) {
    setSavingId(id);
    setMessage(null);

    const payload: Record<string, unknown> = {
      name: editForm.name.trim() || null,
      role: editForm.role,
      active: editForm.active,
    };
    if (editForm.password.trim()) {
      payload.password = editForm.password;
    }

    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? getApiData<AdminUserData>(json) : u)),
      );
      cancelEdit();
      setMessage({ text: "User updated.", type: "success" });
    } else {
      setMessage({ text: getApiErrorMessage(json), type: "error" });
    }
    setSavingId(null);
  }

  async function handleDeactivate(id: string) {
    if (!confirm("Deactivate this user? They will no longer be able to sign in.")) {
      return;
    }

    setMessage(null);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const json = await res.json();

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? getApiData<AdminUserData>(json) : u)),
      );
      if (editingId === id) cancelEdit();
      setMessage({ text: "User deactivated.", type: "success" });
    } else {
      setMessage({ text: getApiErrorMessage(json), type: "error" });
    }
  }

  return (
    <div className="space-y-8">
      <AdminMessage
        message={message?.text ?? null}
        type={message?.type ?? "success"}
      />

      <AdminCard>
        <h2 className="font-display text-xl text-taupe">Create User</h2>
        <p className="mt-1 font-body text-sm text-muted">
          Add a new admin or editor account. Password must be at least 8 characters.
        </p>
        <form onSubmit={handleCreate} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="create-name">Name</Label>
            <Input
              id="create-name"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1"
              placeholder="Optional"
            />
          </div>
          <div>
            <Label htmlFor="create-email">Email</Label>
            <Input
              id="create-email"
              type="email"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="create-password">Password</Label>
            <Input
              id="create-password"
              type="password"
              value={createForm.password}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              minLength={8}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="create-role">Role</Label>
            <select
              id="create-role"
              value={createForm.role}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  role: e.target.value as "admin" | "editor",
                }))
              }
              className="mt-1 flex h-10 w-full rounded-md border border-hairline bg-white px-3 py-2 font-body text-sm"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create user"}
            </Button>
          </div>
        </form>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display text-xl text-taupe">All Users</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] font-body text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-muted">
                <th className="pb-3 pr-4 font-medium">Email</th>
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Role</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Created</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-hairline/60">
                  {editingId === user.id ? (
                    <>
                      <td className="py-4 pr-4 text-taupe">{user.email}</td>
                      <td className="py-4 pr-4">
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <select
                          value={editForm.role}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              role: e.target.value as "admin" | "editor",
                            }))
                          }
                          className="flex h-10 w-full rounded-md border border-hairline bg-white px-3 py-2 font-body text-sm"
                        >
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-4 pr-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editForm.active}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                active: e.target.checked,
                              }))
                            }
                          />
                          Active
                        </label>
                      </td>
                      <td className="py-4 pr-4 text-muted">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <div className="space-y-2">
                          <Input
                            type="password"
                            placeholder="New password (optional)"
                            value={editForm.password}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            minLength={8}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdate(user.id)}
                              disabled={savingId === user.id}
                            >
                              {savingId === user.id ? "Saving…" : "Save"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-4 pr-4 text-taupe">{user.email}</td>
                      <td className="py-4 pr-4">{user.name ?? "—"}</td>
                      <td className="py-4 pr-4 capitalize">{user.role}</td>
                      <td className="py-4 pr-4">
                        <span
                          className={
                            user.active ? "text-sage-deep" : "text-muted"
                          }
                        >
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-muted">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(user)}
                          >
                            Edit
                          </Button>
                          {user.active && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600"
                              onClick={() => handleDeactivate(user.id)}
                            >
                              Deactivate
                            </Button>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="py-8 text-center font-body text-sm text-muted">
              No users found. Create one above or run the database seed.
            </p>
          )}
        </div>
      </AdminCard>
    </div>
  );
}
