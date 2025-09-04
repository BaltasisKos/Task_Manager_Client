import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation, useUpdateUserMutation } from "../redux/slices/api/userApiSlice";
import { logout, setCredentials } from "../redux/slices/authSlice";

// Avatar component showing initials
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

// Modal component for editing profile
const ProfileModal = ({ user, onClose, onSave }) => {
  const dispatch = useDispatch();
  const [updateUser] = useUpdateUserMutation(); // RTK Query mutation
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    try {
      const payload = { name, email };
      if (password) payload.password = password; // optional password update

      const updatedUser = await updateUser(payload).unwrap(); // save to backend
      dispatch(setCredentials(updatedUser)); // update Redux state immediately
      onSave(updatedUser);
      onClose();
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err.data?.message || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative">
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
        <input
          type="text"
          className="w-full p-2 border mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="w-full p-2 border mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 border mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="title"
          placeholder="Title"
          className="w-full p-2 border mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main ProfileDropdown component
const ProfileDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [triggerLogout] = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      dispatch(logout());
      navigate("/log-in");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleProfileSave = (updatedUser) => {
    // Redux state is already updated in modal save
  };

  if (!user) return null;

  const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);


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
          onSave={handleProfileSave}
        />
      )}
    </div>
  );
};

export default ProfileDropdown;
