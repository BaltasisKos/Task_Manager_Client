// PopoverIcon.tsx
import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { HiOutlineBell } from "react-icons/hi";

const BellIconPop = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="text-gray-600 hover:text-black p-1"
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
          className="bg-white p-3 rounded shadow border w-64 text-sm z-50"
        >
          This is the popover content. You can place help text or tips here.
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default BellIconPop;
