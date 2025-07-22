import React, { useState } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../store/users";

const TeamsTable = () => {
  const [users, setUsers] = useState(getUsers());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", title: "", active: true });
  const [editingUserId, setEditingUserId] = useState(null);

  const resetForm = () => setNewUser({ name: "", email: "", role: "", title: "", active: true });

  const handleAddUser = () => {
    addUser(newUser);
    setUsers(getUsers());
    setShowAddModal(false);
    resetForm();
  };

  const handleEditUser = () => {
    updateUser(editingUserId, newUser);
    setUsers(getUsers());
    setShowEditModal(false);
    setEditingUserId(null);
    resetForm();
  };

  const handleDeleteUser = (id) => {
    deleteUser(id);
    setUsers(getUsers());
  };

  const openEditModal = (user) => {
    setEditingUserId(user.id);
    setNewUser(user);
    setShowEditModal(true);
  };

  return (
    <div className="w-full py-5 px-4">
      <h2 className="flex justify-start text-2xl font-bold mb-4">Team Members</h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add New User
        </button>
      </div>

      <div className="overflow-x-auto shadow-2xl rounded">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b text-center">Full Name</th>
              <th className="p-3 border-b text-center">Title</th>
              <th className="p-3 border-b text-center">Email</th>
              <th className="p-3 border-b text-center">Role</th>
              <th className="p-3 border-b text-center">Active</th>
              <th className="p-3 border-b text-center"></th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="text-center border-t">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.title || "-"}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">{user.active ? "Yes" : "No"}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add New User" onClose={() => setShowAddModal(false)} onSubmit={handleAddUser}>
          <UserForm user={newUser} setUser={setNewUser} />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal title="Edit User" onClose={() => setShowEditModal(false)} onSubmit={handleEditUser}>
          <UserForm user={newUser} setUser={setNewUser} />
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ title, onClose, onSubmit, children }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
    <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
      <div className="flex justify-end mt-4 gap-2">
        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
        <button onClick={onSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  </div>
);

const UserForm = ({ user, setUser }) => (
  <div className="flex flex-col gap-3">
    <input
      type="text"
      placeholder="Full Name"
      className="border p-2 rounded"
      value={user.name}
      onChange={(e) => setUser({ ...user, name: e.target.value })}
    />
    <input
      type="text"
      placeholder="Title"
      className="border p-2 rounded"
      value={user.title || ""}
      onChange={(e) => setUser({ ...user, title: e.target.value })}
    />
    <input
      type="email"
      placeholder="Email"
      className="border p-2 rounded"
      value={user.email}
      onChange={(e) => setUser({ ...user, email: e.target.value })}
    />
    <input
      type="text"
      placeholder="Role"
      className="border p-2 rounded"
      value={user.role}
      onChange={(e) => setUser({ ...user, role: e.target.value })}
    />
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={user.active}
        onChange={(e) => setUser({ ...user, active: e.target.checked })}
      />
      Active
    </label>
  </div>
);

export default TeamsTable;
