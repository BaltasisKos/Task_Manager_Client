// PopoverIcon.tsx
import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { HiOutlineBell } from "react-icons/hi";

const BellIconPop = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="text-white hover:text-blue-800 p-1 cursor-pointer"
          aria-label="More info"
        >
          <HiOutlineBell fontSize={24}/>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={8}
          className="bg-white p-3 rounded-md shadow-lg  w-64 text-sm z-50"
        ><div className="bg-white px-2 py-3 mb-1">
            <strong>Notifications:</strong>
          </div>
          <div className="px-2 border-t pt-2">
            This is notification panel.
          </div>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default BellIconPop;
