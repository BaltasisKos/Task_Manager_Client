import React, { useState } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../store/users";
import { Plus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import TextField from '@mui/material/TextField';
import { Tabs, Tab, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem'; 

const CustomTabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const TeamsTable = () => {
  const [users, setUsers] = useState(getUsers());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", title: "", active: true });
  const [editingUserId, setEditingUserId] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [teams, setTeams] = useState([]);

  const resetForm = () => setNewUser({ name: "", email: "", role: "", title: "", active: true });


  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert("Name and email are required.");
      return;
    }
    addUser(newUser);
    setUsers(getUsers());
    setShowAddModal(false);
    resetForm();
  };

  const handleEditUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert("Name and email are required.");
      return;
    }
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

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [confirmationText, setConfirmationText] = useState("");

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [selectedTeamUserIds, setSelectedTeamUserIds] = useState([]);

  // Handle change for user select dropdown in Create Team modal
  const handleTeamUserSelectChange = (e) => {
    // multiple select so convert selected options to array of IDs (numbers)
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(Number(options[i].value));
    }
    setSelectedTeamUserIds(selected);
  };

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

    // You can do API call or update your state here
    console.log("Creating team:", teamName, "with users:", teamUsers);

    setShowCreateTeamModal(false);
    setTeamName("");
    setSelectedTeamUserIds([]);
  };

  return (
    <div className="w-full py-5 px-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-grow border-t border-white opacity-100"></div>
        <h2 className="text-2xl font-bold text-white whitespace-nowrap">Teams</h2>
        <div className="flex-grow border-t border-white opacity-100"></div>
      </div>

      {/* TABS */}
      <Box className="mb-4">
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          className="mb-4"
          TabIndicatorProps={{
            style: {
              backgroundColor: "white",
            },
          }}
        >
          <Tab
            label="USERS"
            sx={{
              color: "white",
              textTransform: "none",
              '&.Mui-selected': {
                color: "white",
              },
              '&:hover': {
                color: "#67e8f9",
              },
            }}
          />
          <Tab
            label="TEAMS"
            sx={{
              color: "white",
              textTransform: "none",
              '&.Mui-selected': {
                color: "white",
              },
              '&:hover': {
                color: "#67e8f9",
              },
            }}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={tabIndex} index={0}>
        <div className="flex justify-start mb-6">
          <button
            onClick={() => setShowAddModal(true)}
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
                <th className="p-3 border-b text-center">Role</th>
                <th className="p-3 border-b border-b-blue-700 text-center">Active</th>
                <th className="p-3 border-b border-b-blue-700 text-center"></th>
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
                        onClick={() => openEditModal(user)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-yellow-500 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(user.id)}
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

      <CustomTabPanel value={tabIndex} index={1}>
        <div className="flex justify-start mb-6">
          <button
            onClick={() => setShowCreateTeamModal(true)}
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
        <th className="p-3 border-b text-center">Team Name</th>
        <th className="p-3 border-b text-center">Status</th>
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
          <tr key={team.id} className="border-b">
            <td className="p-2">{team.name}</td>
            <td className="p-2">{team.status || '—'}</td>
            <td className="p-2">
              {team.members && team.members.length > 0
                ? team.members.map(m => m.name).join(", ")
                : '—'}
            </td>
            <td className="p-2">
              {team.createdAt ? new Date(team.createdAt).toLocaleDateString() : '—'}
            </td>
            <td className="p-2">
              {/* Replace with your actual action buttons */}
              <button className="text-blue-600 hover:underline mr-2">Edit</button>
              <button className="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

        
        

      </CustomTabPanel>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl relative">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>

            <button
              onClick={() => {
                setDeleteConfirmId(null);
                setConfirmationText("");
              }}
              className="absolute top-4 right-4 text-black hover:text-cyan-500 cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>

            <p className="mb-4">
              Please type <strong>"permanently delete"</strong> to confirm:
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Type here"
            />
            <div className="flex justify-center gap-2">
              <button
                disabled={confirmationText.toLowerCase() !== "permanently delete"}
                onClick={() => {
                  handleDeleteUser(deleteConfirmId);
                  setDeleteConfirmId(null);
                  setConfirmationText("");
                }}
                className={`px-4 py-2 rounded-4xl cursor-pointer text-white ${
                  confirmationText.toLowerCase() === "permanently delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <Modal title="Create Team" onClose={() => setShowCreateTeamModal(false)} onSubmit={handleCreateTeam}>
          <div className="flex flex-col gap-3">
            <TextField
              label="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              variant="filled"
              fullWidth
              margin="dense"
              sx={{ backgroundColor: 'white', '& .MuiFilledInput-root': { backgroundColor: 'white' } }}
            />
            <div className="w-full sm:w-1/2">
  <TextField
    required
    select
    label="Select Members"
    value={selectedTeamUserIds}  // selected IDs as strings
    onChange={handleTeamUserSelectChange}
    fullWidth
    margin="dense"
    variant="filled"
    sx={{
      backgroundColor: 'white',
      '& .MuiInputBase-root': {
        backgroundColor: 'white',
      },
    }}
    SelectProps={{
      multiple: true  // allow multiple selection if needed
    }}
  >
    {users.map(user => (
      <MenuItem key={user.id} value={(user.id)}>
        {user.name} ({user.email})
      </MenuItem>
    ))}
  </TextField>
</div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Modal component used for all modals
const Modal = ({ title, onClose, onSubmit, children }) => (
  <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-black hover:text-cyan-500 cursor-pointer"
      >
        <FontAwesomeIcon icon={faXmark} className="text-xl" />
      </button>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {children}
        <button
          type="submit"
          className="mt-4 bg-cyan-500 px-4 py-2 rounded hover:bg-cyan-600 text-white"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
);

// UserForm component reused in Add/Edit modals
const UserForm = ({ user, setUser }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="flex flex-col gap-3">
      <TextField
        label="Full Name"
        name="name"
        value={user.name}
        onChange={handleChange}
        variant="filled"
        fullWidth
        margin="dense"
        sx={{ backgroundColor: 'white', '& .MuiFilledInput-root': { backgroundColor: 'white' } }}
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={user.email}
        onChange={handleChange}
        variant="filled"
        fullWidth
        margin="dense"
        sx={{ backgroundColor: 'white', '& .MuiFilledInput-root': { backgroundColor: 'white' } }}
        required
      />
      <TextField
        label="Role"
        name="role"
        value={user.role}
        onChange={handleChange}
        variant="filled"
        fullWidth
        margin="dense"
        sx={{ backgroundColor: 'white', '& .MuiFilledInput-root': { backgroundColor: 'white' } }}
      />
      <TextField
        label="Title"
        name="title"
        value={user.title}
        onChange={handleChange}
        variant="filled"
        fullWidth
        margin="dense"
        sx={{ backgroundColor: 'white', '& .MuiFilledInput-root': { backgroundColor: 'white' } }}
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="active"
          checked={user.active}
          onChange={handleChange}
        />
        Active
      </label>
    </div>
  );
};

export default TeamsTable;
