import React from 'react'
import BellIconPop from './BellIconPop';
import ProfileDropdown from './ProfileDropdown';
import SearchInput from './SearchInput';

const Header = () => {
  return (
    <div className='bg-gradient-to-r from-blue-700  to-blue-400 h-16 w-auto px-4 flex justify-between items-center border-gray-200 '>
      <div className='relative'>
        <SearchInput/>
      </div>
      <div className='flex items-center gap-4 mr-3'>
         <BellIconPop/>  
         <ProfileDropdown/>    
      </div>
    </div>
  )
}

export default Header