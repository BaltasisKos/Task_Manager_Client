import React from 'react'
import { HiOutlineSearch, HiOutlineChatAlt, HiOutlineBell } from 'react-icons/hi'
import MyPopover from "./ChatIconPopover";
import BellIconPop from './BellIconPop';
import ProfileDropdown from './ProfileDropdown';

const Header = () => {
  return (
    <div className='bg-white h-16 w-auto px-4 flex justify-between items-center border-b border-gray-200'>
      <div className='relative'>
        <HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3'/>
        <input type="text" placeholder='Search...' className='text-sm focus:outline-none active:outline-none h-10 w-120 border border-gray-300 rounded-lg pl-11 pr-4'/>
      </div>
      <div className='flex items-center gap-2 mr-2'>
         <MyPopover/>
         <BellIconPop/>  
         <ProfileDropdown/>    
      </div>
    </div>
  )
}

export default Header