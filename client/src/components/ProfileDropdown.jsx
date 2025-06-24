import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import avatar from "../assets/profilePic.png"; 

const ProfileDropdown = () => {
  return (
    <div className="relative z-50">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="focus:outline-none">
            <img
              src={avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full border cursor-pointer"
            />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={8}
            align="end"
            className="bg-white rounded-md shadow-lg p-2 w-40 z-50"
          >
            <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
              Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
              Settings
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
            <DropdownMenu.Item className="px-3 py-2 text-red-600 hover:bg-red-100 rounded cursor-pointer">
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default ProfileDropdown;
