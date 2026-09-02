import { useEffect, useMemo, useState } from "react";
import {
  usersApi,
  type CmsUser,
  type CmsUserRole,
  type CmsUserStatus,
} from "@/services/api";

interface UsersCMSProps {
  showNotification: (message: string, type?: "success" | "error") => void;
}

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "editor" as CmsUserRole,
  status: "active" as CmsUserStatus,
};

const inputClass =
  "w-full px-4 py-2.5 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UsersCMS({ showNotification }: UsersCMSProps) {
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | CmsUserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | CmsUserStatus>("all");
  const [formData, setFormData] = useState(emptyForm);
  const [selectedUser, setSelectedUser] = useState<CmsUser | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentUserId = Number(localStorage.getItem("adminUserId") || 0);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.list();
      setUsers(data);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to load users",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const resetForm = () => setFormData(emptyForm);

  const closeModals = () => {
    setShowCreate(false);
    setShowEdit(false);
    setShowDelete(false);
    setSelectedUser(null);
    resetForm();
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      showNotification("Name, email, and password are required", "error");
      return;
    }
    setSaving(true);
    try {
      const created = await usersApi.create(formData);
      setUsers((prev) => [...prev, created]);
      closeModals();
      showNotification("User created successfully");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to create user",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser || !formData.name.trim() || !formData.email.trim()) {
      showNotification("Name and email are required", "error");
      return;
    }
    setSaving(true);
    try {
      const payload: Parameters<typeof usersApi.update>[1] = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      };
      if (formData.password) payload.password = formData.password;

      const updated = await usersApi.update(selectedUser.id, payload);
      setUsers((prev) =>
        prev.map((user) => (user.id === updated.id ? updated : user)),
      );
      closeModals();
      showNotification("User updated successfully");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to update user",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await usersApi.delete(selectedUser.id);
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
      closeModals();
      showNotification("User deleted successfully");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to delete user",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user: CmsUser) => {
    const nextStatus: CmsUserStatus =
      user.status === "active" ? "inactive" : "active";
    try {
      const updated = await usersApi.update(user.id, { status: nextStatus });
      setUsers((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      showNotification(`User marked as ${nextStatus}`);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to update status",
        "error",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <i className="ri-loader-4-line animate-spin text-3xl text-primary-500"></i>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-background-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">
              User Management
            </h2>
            <p className="text-sm text-foreground-600 mt-1">
              Create and manage CMS admins and editors.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowCreate(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
          >
            <i className="ri-user-add-line"></i>
            Add User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-1">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400"></i>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className={`${inputClass} pl-9`}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value as "all" | CmsUserRole)
            }
            className={inputClass}
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | CmsUserStatus)
            }
            className={inputClass}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-background-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-background-50 border-b border-background-200">
              <tr className="text-left text-foreground-600">
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Last Active</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-foreground-500"
                  >
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-background-50/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-foreground-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          user.role === "admin"
                            ? "bg-primary-50 text-primary-700"
                            : "bg-background-100 text-foreground-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleStatus(user)}
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-foreground-600">
                      {formatDateTime(user.lastActive)}
                    </td>
                    <td className="px-4 py-3 text-foreground-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setFormData({
                              name: user.name,
                              email: user.email,
                              password: "",
                              role: user.role,
                              status: user.status,
                            });
                            setShowEdit(true);
                          }}
                          className="p-2 rounded-lg text-primary-600 hover:bg-primary-50"
                          title="Edit"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          type="button"
                          disabled={user.id === currentUserId}
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDelete(true);
                          }}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(showCreate || showEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-background-200">
            <div className="px-5 py-4 border-b border-background-200 flex items-center justify-between">
              <h3 className="font-semibold text-secondary-900">
                {showCreate ? "Add User" : "Edit User"}
              </h3>
              <button type="button" onClick={closeModals}>
                <i className="ri-close-line text-xl text-foreground-500"></i>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1">
                  Full Name *
                </label>
                <input
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  className={inputClass}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1">
                  {showCreate ? "Password *" : "New Password (optional)"}
                </label>
                <input
                  type="password"
                  className={inputClass}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder={
                    showEdit ? "Leave blank to keep current password" : ""
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1">
                    Role
                  </label>
                  <select
                    className={inputClass}
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        role: e.target.value as CmsUserRole,
                      }))
                    }
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1">
                    Status
                  </label>
                  <select
                    className={inputClass}
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as CmsUserStatus,
                      }))
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-foreground-500">
                Admins can manage users. Editors can edit website content only.
              </p>
            </div>
            <div className="px-5 py-4 border-t border-background-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground-700 hover:bg-background-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={showCreate ? handleCreate : handleUpdate}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : showCreate ? "Create User" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-background-200 p-5">
            <h3 className="font-semibold text-secondary-900 mb-2">
              Delete user?
            </h3>
            <p className="text-sm text-foreground-600 mb-5">
              This will permanently remove{" "}
              <strong>{selectedUser.name}</strong> ({selectedUser.email}) from
              CMS access.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground-700 hover:bg-background-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
