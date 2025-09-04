import React, { useState } from "react";
import { Plus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Tabs, Tab, Box, TextField, MenuItem, Autocomplete, Chip } from "@mui/material";

import {
  useGetTeamListsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUserActionMutation,
} from "../redux/slices/api/userApiSlice";

import {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} from "../redux/slices/api/teamApiSlice";

// Tab Panel Component
const CustomTabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
);

const TeamsTable = () => {
  // Tabs
  const [tabIndex, setTabIndex] = useState(0);

  // Users
  const { data: usersData = [], refetch: refetchUsers } = useGetTeamListsQuery({ search: "" });
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  // Teams
  const { data: teamsData = [], refetch: refetchTeams } = useGetTeamsQuery();
  const [createTeam] = useCreateTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();

  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", role: "", title: "", isActive: true });

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamForm, setTeamForm] = useState({ name: "", members: [], description: "" });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ type: "", id: null });

  // Handlers
  const handleTabChange = (e, newVal) => setTabIndex(newVal);

  const handleUserFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleTeamFormChange = (e) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMembersChange = (e) => {
    const value = e.target.value;
    setTeamForm((prev) => ({
      ...prev,
      members: Array.isArray(value) ? value : [value],
    }));
  };

  // User Modals
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
      if (editingUser) await userAction({ id: editingUser._id, ...userForm }).unwrap();
      else await createUser(userForm).unwrap();

      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({ name: "", email: "", role: "", title: "", isActive: true });
      refetchUsers();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to save user");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id).unwrap();
      setDeleteConfirm({ type: "", id: null });
      refetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Team Modals
  const openAddTeamModal = () => {
    setEditingTeam(null);
    setTeamForm({ name: "", members: [], description: "" });
    setShowTeamModal(true);
  };

  const openEditTeamModal = (team) => {
    setEditingTeam(team);
    setTeamForm({
      name: team.name,
      members: team.members?.map(member => member._id) || [],
    });
    setShowTeamModal(true);
  };

  const handleSaveTeam = async () => {
    try {
      if (editingTeam) await updateTeam({ id: editingTeam._id, ...teamForm }).unwrap();
      else await createTeam(teamForm).unwrap();

      setShowTeamModal(false);
      setEditingTeam(null);
      setTeamForm({ name: "", members: [], description: "" });
      refetchTeams();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to save team");
    }
  };

  const handleDeleteTeam = async (id) => {
    try {
      await deleteTeam(id).unwrap();
      setDeleteConfirm({ type: "", id: null });
      refetchTeams();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full py-5 px-4">
      {/* Header */}
      <div className="flex items-center gap-14 mb-6">
        <div className="flex-grow border-t border-white opacity-100"></div>
        <h2 className="text-2xl font-bold text-white whitespace-nowrap">Teams & Users</h2>
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
                      <button onClick={() => openEditUserModal(user)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-yellow-500 cursor-pointer">Edit</button>
                      <button onClick={() => setDeleteConfirm({ type: "user", id: user._id })} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CustomTabPanel>

      {/* Teams Tab */}
      <CustomTabPanel value={tabIndex} index={1}>
  <div className="flex justify-start mb-6">
    <button
      onClick={openAddTeamModal}
      className="border text-white px-6 py-2 rounded hover:bg-blue-500 flex items-center gap-1 cursor-pointer"
    >
      <Plus size={18} /> Add Team
    </button>
  </div>

  <div className="overflow-x-auto shadow-2xl rounded">
    <table className="min-w-full bg-gray-100">
      <thead>
        <tr className="bg-gradient-to-r from-cyan-500 to-cyan-400">
          <th className="p-3 border-b text-center">Team Name</th>
          <th className="p-3 border-b text-center">Description</th>
          <th className="p-3 border-b text-center">Members</th>
          <th className="p-3 border-b text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {teamsData.length === 0 ? (
          <tr>
            <td colSpan={4} className="p-4 text-center text-gray-500">
              No teams found.
            </td>
          </tr>
        ) : (
          teamsData.map((team) => (
            <tr key={team._id} className="text-center">
              <td className="p-3">{team.name}</td>
              <td className="p-3">{team.description || "-"}</td>
              <td className="p-3">
            <div className="flex justify-center items-center gap-1 flex-wrap w-full">
              {team.members && team.members.length > 0 ? (
                team.members.map((m) => (
                  <div
                    key={m._id}
                    className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-semibold"
                    title={`${m.name} (${m.email})`}
                  >
                    {m.name[0].toUpperCase()}
                  </div>
                ))
              ) : (
                "-"
              )}
            </div>
          </td>

          <td className="p-3 text-center items-center space-x-2">
            <button
              onClick={() => openEditTeamModal(team)}
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-yellow-500 cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => setDeleteConfirm({ type: "team", id: team._id })}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
            >
              Delete
            </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] relative">
            <button onClick={() => setShowUserModal(false)} className="absolute top-2 right-2 text-gray-500 cursor-pointer">
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h3 className="text-lg font-semibold mb-6">{editingUser ? "Edit User" : "Add User"}</h3>
            <div className="space-y-3">
              <TextField fullWidth label="Full Name" name="name" value={userForm.name} onChange={handleUserFormChange} />
              <TextField fullWidth label="Email" name="email" value={userForm.email} onChange={handleUserFormChange} />
              <TextField select fullWidth label="Role" name="role" value={userForm.role} onChange={handleUserFormChange}>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </TextField>
              <TextField fullWidth label="Title" name="title" value={userForm.title} onChange={handleUserFormChange} />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" checked={userForm.isActive} onChange={handleUserFormChange} />
                Active
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUserModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
              <button onClick={handleSaveUser} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {showTeamModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-[400px] relative">
      <button
        onClick={() => setShowTeamModal(false)}
        className="absolute top-2 right-2 text-gray-500 cursor-pointer"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <h3 className="text-lg font-semibold mb-6">
        {editingTeam ? "Edit Team" : "Add Team"}
      </h3>

      <div className="space-y-3">
        {/* Team Name */}
        <TextField
          fullWidth
          label="Team Name"
          name="name"
          value={teamForm.name}
          onChange={handleTeamFormChange}
        />

        {/* Members Autocomplete */}
        <Autocomplete
          multiple
          options={usersData}
          getOptionLabel={(option) => `${option.name} (${option.email})`}
          value={usersData.filter((user) => teamForm.members.includes(user._id))}
          onChange={(event, newValue) => {
            setTeamForm({
              ...teamForm,
              members: newValue.map((user) => user._id),
            });
          }}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                label={`${option.name} (${option.email})`}
                {...getTagProps({ index })}
                color="primary"
              />
            ))
          }
          renderInput={(params) => <TextField {...params} label="Members" />}
        />

        {/* Description */}
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={teamForm.description}
          onChange={handleTeamFormChange}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowTeamModal(false)}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveTeam}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}


      {/* Delete Confirmation */}
      {deleteConfirm.id && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this {deleteConfirm.type}?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setDeleteConfirm({ type: "", id: null })} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === "user") handleDeleteUser(deleteConfirm.id);
                  else if (deleteConfirm.type === "team") handleDeleteTeam(deleteConfirm.id);
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsTable;
