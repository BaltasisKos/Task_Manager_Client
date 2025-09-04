import React from 'react';
import { useSelector } from 'react-redux';
import BellIconPop from './BellIconPop';
import ProfileDropdown from './ProfileDropdown';
import SearchInput from './SearchInput';

const Header = () => {
  const user = useSelector((state) => state.auth.user); // get user from Redux

  // Capitalize function
  const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);

  return (
    <div className='bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-400 h-16 w-auto px-4 flex justify-between items-center border-gray-200'>
      <div className='relative'>
        <SearchInput />
      </div>
      <div className='flex items-center gap-4 mr-3'>
        <BellIconPop />
        {user && (
          <span className='text-white font-medium'>
            Welcome : {capitalize(user.name)}
          </span>
        )}
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default Header;
