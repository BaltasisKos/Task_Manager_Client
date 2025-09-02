import React, { useState } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../store/users";
import { Plus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import TextField from '@mui/material/TextField';
import { Tabs, Tab, Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const CustomTabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const TeamsTable = () => {
  const [users, setUsers] = useState(getUsers());
  const [teams, setTeams] = useState([]);

  // User modals & editing
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Team modals & editing
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  // Common
  const [tabIndex, setTabIndex] = useState(0);

  // Delete confirmation modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmType, setDeleteConfirmType] = useState(null); // 'user' or 'team'
  const [confirmationText, setConfirmationText] = useState("");

  // User form state
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "",
    title: "",
    active: true,
  });

  // Team form state
  const [teamName, setTeamName] = useState("");
  const [selectedTeamUserIds, setSelectedTeamUserIds] = useState([]);

  // --------- Handlers -------------

  // Tabs
  const handleTabChange = (e, newVal) => setTabIndex(newVal);

  // User form change
  const handleUserFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Open Add User modal
  const openAddUserModal = () => {
    setUserForm({ name: "", email: "", role: "", title: "", active: true });
    setShowAddUserModal(true);
  };

  // Open Edit User modal
  const openEditUserModal = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role || "",
      title: user.title || "",
      active: user.active || false,
    });
    setShowEditUserModal(true);
  };

  // Add User
  const handleAddUser = () => {
    if (!userForm.name.trim() || !userForm.email.trim()) {
      alert("Name and email are required.");
      return;
    }
    addUser(userForm);
    setUsers(getUsers());
    setShowAddUserModal(false);
  };

  // Update User
  const handleEditUser = () => {
    if (!userForm.name.trim() || !userForm.email.trim()) {
      alert("Name and email are required.");
      return;
    }
    updateUser(editingUser.id, userForm);
    setUsers(getUsers());
    setShowEditUserModal(false);
    setEditingUser(null);
  };

  // Delete User
  const handleDeleteUser = (id) => {
    deleteUser(id);
    setUsers(getUsers());
  };

  // Open Create Team modal
  const openCreateTeamModal = () => {
    setTeamName("");
    setSelectedTeamUserIds([]);
    setShowCreateTeamModal(true);
  };

  // Open Edit Team modal
  const openEditTeamModal = (team) => {
    setEditingTeam(team);
    setTeamName(team.name);
    setSelectedTeamUserIds(team.members.map(m => m.id));
    setShowEditTeamModal(true);
  };

  // Create Team
  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      alert("Team name is required.");
      return;
    }
    if (selectedTeamUserIds.length === 0) {
      alert("Select at least one member for the team.");
      return;
    }

    const teamUsers = users.filter(user => selectedTeamUserIds.includes(user.id));

    const newTeam = {
      id: Date.now(),
      name: teamName,
      status: 'Active',
      members: teamUsers,
      createdAt: new Date().toISOString(),
    };

    setTeams(prev => [...prev, newTeam]);
    setShowCreateTeamModal(false);
  };

  // Update Team
  const handleEditTeam = () => {
    if (!teamName.trim()) {
      alert("Team name is required.");
      return;
    }
    if (selectedTeamUserIds.length === 0) {
      alert("Select at least one member for the team.");
      return;
    }

    const teamUsers = users.filter(user => selectedTeamUserIds.includes(user.id));

    setTeams((prev) =>
      prev.map((team) =>
        team.id === editingTeam.id
          ? { ...team, name: teamName, members: teamUsers }
          : team
      )
    );
    setShowEditTeamModal(false);
    setEditingTeam(null);
  };

  // Delete Team
  const handleDeleteTeam = (id) => {
    setTeams((prev) => prev.filter((team) => team.id !== id));
  };

  // Delete confirmation handler
  const confirmDelete = () => {
    if (deleteConfirmType === "user") {
      handleDeleteUser(deleteConfirmId);
    } else if (deleteConfirmType === "team") {
      handleDeleteTeam(deleteConfirmId);
    }
    setDeleteConfirmId(null);
    setDeleteConfirmType(null);
    setConfirmationText("");
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirmId(null);
    setDeleteConfirmType(null);
    setConfirmationText("");
  };

  return (
    <div className="w-full py-5 px-4">
      {/* Title */}
      <div className="flex items-center gap-14 mb-6">
        <div className="flex-grow border-t border-white opacity-100"></div>
        <h2 className="text-2xl font-bold text-white whitespace-nowrap">Teams</h2>
        <div className="flex-grow border-t border-white opacity-100"></div>
      </div>

      {/* Tabs */}
      <Box className="mb-4">
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          className="mb-4"
          TabIndicatorProps={{ style: { backgroundColor: "white" } }}
        >
          <Tab
            label="USERS"
            sx={{
              color: "white",
              textTransform: "none",
              '&.Mui-selected': { color: "white" },
              '&:hover': { color: "#67e8f9" },
            }}
          />
          <Tab
            label="TEAMS"
            sx={{
              color: "white",
              textTransform: "none",
              '&.Mui-selected': { color: "white" },
              '&:hover': { color: "#67e8f9" },
            }}
          />
        </Tabs>
      </Box>

      {/* Users Tab Panel */}
      <CustomTabPanel value={tabIndex} index={0}>
        <div className="flex justify-start mb-6">
          <button
            onClick={openAddUserModal}
            className="border text-white px-6 py-2 rounded hover:bg-blue-500 cursor-pointer flex items-center gap-1"
          >
            <Plus size={18} />
            Add User
          </button>
        </div>

        <div className="overflow-x-auto shadow-2xl rounded">
          <table className="min-w-full bg-gray-100">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-500 to-cyan-400">
                <th className="p-3 border-b border-b-blue-700 text-center">Full Name</th>
                <th className="p-3 border-b border-b-blue-700 text-center">Title</th>
                <th className="p-3 border-b border-b-blue-700 text-center">Email</th>
                <th className="p-3 border-b border-b-blue-700 text-center">Role</th>
                <th className="p-3 border-b border-b-blue-700 text-center">Active</th>
                <th className="p-3 border-b border-b-blue-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="text-center">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.title || "-"}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">{user.active ? "Yes" : "No"}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => openEditUserModal(user)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-yellow-500 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirmId(user.id);
                          setDeleteConfirmType("user");
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
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
      </CustomTabPanel>

      {/* Teams Tab Panel */}
      <CustomTabPanel value={tabIndex} index={1}>
        <div className="flex justify-start mb-6">
          <button
            onClick={openCreateTeamModal}
            className="border text-white px-6 py-2 rounded hover:bg-blue-500 cursor-pointer flex items-center gap-1"
          >
            <Plus size={18} />
            Create Team
          </button>
        </div>

        <div className="overflow-x-auto shadow-2xl rounded">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-500 to-cyan-400">
                <th className="p-3 border-b border-b-blue-700 text-center">Team Name</th>
                <th className="p-3 border-b border-b-blue-700 text-center">Status</th>
                <th className="p-3 border-b text-center">Members</th>
                <th className="p-3 border-b text-center">Created At</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No teams found.
                  </td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team.id} className="text-center">
                    <td className="p-3">{team.name}</td>
                    <td className="p-3">{team.status}</td>
                    <td className="p-3 max-w-[300px] truncate whitespace-nowrap overflow-hidden">
                      {team.members.map((m) => m.name).join(", ")}
                    </td>
                    <td className="p-3">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => openEditTeamModal(team)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-yellow-500 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirmId(team.id);
                          setDeleteConfirmType("team");
                        }}
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

      {/* Delete Confirmation Modal */}
      {(deleteConfirmId !== null) && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Deletion
            </h3>
            <p className="mb-6">
              Are you sure you want to delete this {deleteConfirmType}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddUserModal(false)} // clicking on the backdrop closes it
        >
          <div
            className="relative bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // prevent inner clicks from closing the modal
          >
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-4 right-4 text-black hover:text-cyan-500"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl cursor-pointer" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Add User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddUser();
              }}
            >
              <TextField
                label="Name"
                name="name"
                value={userForm.name}
                onChange={handleUserFormChange}
                fullWidth
                variant="filled"
                margin="dense"
                required
                sx={{
                  backgroundColor: 'white', // sets the background
                  '& .MuiFilledInput-root': {
                  backgroundColor: 'white', // targets the input field itself
                },
              }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleUserFormChange}
                fullWidth
                variant="filled"
                margin="dense"
                required
                sx={{
                  backgroundColor: 'white', // sets the background
                  '& .MuiFilledInput-root': {
                  backgroundColor: 'white', // targets the input field itself
                },
              }}
              />
              <TextField
                label="Title"
                name="title"
                value={userForm.title}
                onChange={handleUserFormChange}
                fullWidth
                variant="filled"
                margin="dense"
                sx={{
                  backgroundColor: 'white', // sets the background
                  '& .MuiFilledInput-root': {
                  backgroundColor: 'white', // targets the input field itself
                },
              }}
              />
              <TextField
                label="Role"
                name="role"
                value={userForm.role}
                onChange={handleUserFormChange}
                fullWidth
                variant="filled"
                margin="dense"
                sx={{
                  backgroundColor: 'white', // sets the background
                  '& .MuiFilledInput-root': {
                  backgroundColor: 'white', // targets the input field itself
                },
              }}
              />
              <div className="flex items-center gap-2 my-4">
                <input
                  type="checkbox"
                  name="active"
                  id="activeUser"
                  checked={userForm.active}
                  onChange={handleUserFormChange}
                />
                <label htmlFor="activeUser">Active</label>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowEditUserModal(false)} // clicking on the backdrop closes it
        >
          <div
            className="relative bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // prevent inner clicks from closing the modal
          >
            <button
              onClick={() => setShowEditUserModal(false)}
              className="absolute top-4 right-4 text-black hover:text-cyan-500"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl cursor-pointer" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddUser();
              }}
            >
              <TextField
                label="Name"
                name="name"
                value={userForm.name}
                onChange={handleUserFormChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleUserFormChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Title"
                name="title"
                value={userForm.title}
                onChange={handleUserFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Role"
                name="role"
                value={userForm.role}
                onChange={handleUserFormChange}
                fullWidth
                margin="normal"
              />
              <div className="flex items-center gap-2 my-4">
                <input
                  type="checkbox"
                  name="active"
                  id="activeEditUser"
                  checked={userForm.active}
                  onChange={handleUserFormChange}
                />
                <label htmlFor="activeEditUser">Active</label>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Create Team</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateTeam();
              }}
            >
              <TextField
                label="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Autocomplete
                multiple
                options={users}
                getOptionLabel={(option) => option.name}
                value={users.filter((u) => selectedTeamUserIds.includes(u.id))}
                onChange={(e, newValue) => {
                  setSelectedTeamUserIds(newValue.map((u) => u.id));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Members" placeholder="Select members" />
                )}
                sx={{ marginY: 2 }}
              />
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateTeamModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Team</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditTeam();
              }}
            >
              <TextField
                label="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Autocomplete
                multiple
                options={users}
                getOptionLabel={(option) => option.name}
                value={users.filter((u) => selectedTeamUserIds.includes(u.id))}
                onChange={(e, newValue) => {
                  setSelectedTeamUserIds(newValue.map((u) => u.id));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Members" placeholder="Select members" />
                )}
                sx={{ marginY: 2 }}
              />
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditTeamModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsTable;
