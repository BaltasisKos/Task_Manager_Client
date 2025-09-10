import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useLogoutMutation,
  useUpdateUserMutation,
  useChangePasswordMutation,
} from "../redux/slices/api/userApiSlice";
import { logout, updateUserProfile } from "../redux/slices/authSlice";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// ---------------- Avatar Component ----------------
const InitialsAvatar = ({ fullName }) => {
  const initials = fullName
    ?.split(" ")
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <div
      className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center select-none cursor-pointer"
      title={fullName || "Guest"}
    >
      {initials || "?"}
    </div>
  );
};

// ---------------- Profile Modal ----------------
const ProfileModal = ({ user, onClose, onSave }) => {
  const dispatch = useDispatch();
  const [updateUser] = useUpdateUserMutation();
  const [changePassword] = useChangePasswordMutation();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [title, setTitle] = useState(user.title || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
  try {
    const payload = {};
    if (name.trim() !== user.name) payload.name = name.trim();
    if (email.trim() !== user.email) payload.email = email.trim();
    if (title.trim() !== user.title) payload.title = title.trim();

    if (Object.keys(payload).length > 0) {
      const response = await updateUser(payload).unwrap();
      // Update only the changed fields in Redux state
      if (response.user) {
        dispatch(updateUserProfile({
          name: response.user.name,
          email: response.user.email,
          title: response.user.title,
          role: response.user.role,
          isAdmin: response.user.isAdmin,
        }));
      }
      onSave(response);
    }

    if (password.trim()) {
      await changePassword({ password: password.trim() }).unwrap();
      alert("Password updated successfully");
    }

    onClose();
  } catch (err) {
    console.error("Failed to update profile:", err);
    alert(err.data?.message || "Update failed");
  }
};

  return (
    <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative">
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="dense"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="New Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          margin="dense"
          placeholder="Leave blank to keep current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------- Profile Dropdown ----------------
const ProfileDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [triggerLogout] = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) return null;

  const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      dispatch(logout());
      navigate("/log-in");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="relative z-50">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="focus:outline-none">
            <InitialsAvatar fullName={user?.name} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={8}
            align="end"
            className="bg-white rounded-md shadow-lg p-2 w-52 z-50"
          >
            <div className="px-3 py-2 text-sm text-gray-700 border-b">
              <div className="font-medium flex items-center justify-between">
                {capitalize(user?.name || "Guest")}
                <span
                  className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    user?.role === "admin"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {capitalize(user?.role || "user")}
                </span>
              </div>
              <div className="text-xs text-gray-500">{user?.email || "-"}</div>
            </div>

            <DropdownMenu.Item
              onSelect={() => setIsModalOpen(true)}
              className="px-3 py-2 hover:bg-blue-500 hover:text-white rounded cursor-pointer mt-1"
            >
              Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item className="px-3 py-2 hover:bg-blue-500 hover:text-white rounded cursor-pointer mt-1">
              Settings
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
            <DropdownMenu.Item
              onSelect={handleLogout}
              className="px-3 py-2 text-red-600 hover:bg-red-500 hover:text-white rounded cursor-pointer"
            >
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {isModalOpen && (
        <ProfileModal
          user={user}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {}}
        />
      )}
    </div>
  );
};

export default ProfileDropdown;
