import React, { useState } from "react";
import { Plus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Tabs, Tab, Box, TextField, MenuItem } from "@mui/material";

import {
  useGetTeamListsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../redux/slices/api/userApiSlice";

const CustomTabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
);

const TeamsTable = () => {
  const { data: usersData = [], refetch } = useGetTeamListsQuery({ search: ""});
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [tabIndex, setTabIndex] = useState(0);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "",
    title: "",
    isActive: true,
  });

  const handleTabChange = (e, newVal) => setTabIndex(newVal);

  const handleUserFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    setUserForm({ name: "", email: "", role: "", title: "", isActive: true });
    setShowUserModal(true);
  };

  const openEditUserModal = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      isActive: user.isActive,
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
  try {
    if (editingUser) {
      // Admin editing another user (activate/deactivate or update fields)
      // Use userAction for admin updates
      await userAction({ id: editingUser._id, ...userForm }).unwrap();
    } else {
      // Add new user as admin (POST /users)
      await createUser(userForm).unwrap();
    }

    // Reset modal and form
    setShowUserModal(false);
    setEditingUser(null);
    setUserForm({ name: "", email: "", role: "", title: "", isActive: true });

    // Refresh the user list
    refetch();
  } catch (err) {
    console.error("Failed to save user:", err);
    alert(err?.data?.message || "Failed to save user");
  }
};




  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id).unwrap();
      setDeleteConfirmId(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full py-5 px-4">
      {/* Header */}
      <div className="flex items-center gap-14 mb-6">
        <div className="flex-grow border-t border-white opacity-100"></div>
        <h2 className="text-2xl font-bold text-white whitespace-nowrap">Teams</h2>
        <div className="flex-grow border-t border-white opacity-100"></div>
      </div>

      {/* Tabs */}
      <Box className="mb-4">
        <Tabs value={tabIndex} onChange={handleTabChange} TabIndicatorProps={{ style: { backgroundColor: "white" } }}>
          <Tab label="USERS" sx={{ color: "white", textTransform: "none", "&.Mui-selected": { color: "white" } }} />
          <Tab label="TEAMS" sx={{ color: "white", textTransform: "none", "&.Mui-selected": { color: "white" } }} />
        </Tabs>
      </Box>

      {/* Users Tab */}
      <CustomTabPanel value={tabIndex} index={0}>
        <div className="flex justify-start mb-6">
          <button onClick={openAddUserModal} className="border text-white px-6 py-2 rounded hover:bg-blue-500 flex items-center gap-1 cursor-pointer">
            <Plus size={18} /> Add User
          </button>
        </div>

        <div className="overflow-x-auto shadow-2xl rounded">
          <table className="min-w-full bg-gray-100">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-500 to-cyan-400">
                <th className="p-3 border-b text-center">Full Name</th>
                <th className="p-3 border-b text-center">Title</th>
                <th className="p-3 border-b text-center">Email</th>
                <th className="p-3 border-b text-center">Role</th>
                <th className="p-3 border-b text-center">Active</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">No members found.</td>
                </tr>
              ) : (
                usersData.map((user) => (
                  <tr key={user._id} className="text-center">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.title || "-"}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">{user.isActive ? "Yes" : "No"}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button onClick={() => openEditUserModal(user)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
                      <button onClick={() => setDeleteConfirmId(user._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CustomTabPanel>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] relative">
            <button onClick={() => setShowUserModal(false)} className="absolute top-2 right-2 text-gray-500">
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h3 className="text-lg font-semibold mb-6">{editingUser ? "Edit User" : "Add User"}</h3>
            <div className="space-y-3">
              <div>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={userForm.name}
                  onChange={handleUserFormChange}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={userForm.email}
                  onChange={handleUserFormChange}
                />
              </div>
              <div>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  name="role"
                  value={userForm.role}
                  onChange={handleUserFormChange}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </TextField>

              </div>
              <div>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={userForm.title}
                  onChange={handleUserFormChange}
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={userForm.isActive}
                  onChange={handleUserFormChange}
                />
                Active
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUserModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer">Cancel</button>
              <button onClick={handleSaveUser} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
              <button onClick={() => handleDeleteUser(deleteConfirmId)} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsTable;
