// PopoverIcon.tsx
import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { HiOutlineChatAlt } from "react-icons/hi";

const ChatIconPopover = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="text-gray-600 hover:text-black p-1"
          aria-label="More info"
        >
          <HiOutlineChatAlt fontSize={24}/>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={8}
          className="bg-white p-3 rounded-md shadow-lg w-64 text-sm z-50"
        >
          <div className="bg-white px-2 py-3 mb-1">
            <strong>Messanger:</strong>
          </div>
          <div className="px-2 border-t pt-2">
            This is a message panel.
          </div>
          
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default ChatIconPopover;
