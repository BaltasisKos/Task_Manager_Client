import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice"; // adjust path
import { logout } from "../redux/slices/authSlice"; // adjust path

const InitialsAvatar = ({ fullName }) => {
  const initials = fullName
    ?.split(" ")
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <div
      className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center select-none cursor-pointer"
      title={fullName}
    >
      {initials || "?"}
    </div>
  );
};

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.auth.user);
  const [triggerLogout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // if (!user) return null;

  return (
    <div className="relative z-50">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="focus:outline-none">
            {/* <InitialsAvatar fullName={user.name} /> */}
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
                {/* {user.name} */}
                <span
                  // className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  //   user.role === "admin"
                  //     ? "bg-red-100 text-red-600"
                  //     : "bg-green-100 text-green-600"
                  // }`}
                >
                  {/* {user.role} */}
                </span>
              </div>
              {/* <div className="text-xs text-gray-500">{user.email}</div> */}
            </div>

            <DropdownMenu.Item className="px-3 py-2 hover:bg-blue-500 hover:text-white rounded cursor-pointer mt-1">
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
    </div>
  );
};

export default ProfileDropdown;
