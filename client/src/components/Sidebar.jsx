import React from 'react'
import { FaTasks } from "react-icons/fa";
import {Link} from 'react-router-dom'
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from './lib/consts/navigation';
import { HiOutlineLogout } from 'react-icons/hi';

const linkClass =
	'flex items-center gap-2 font-light px-2 py-4 mt-3  hover:bg-blue-500 hover:text-white hover:no-underline active:bg-neutral-600 rounded-lg text-base'

const Sidebar = () => {
  return (
    <div className='flex flex-col bg-white w-60 p-3 text-black'>
      <div className='flex items-center gap-2 py-3 mt-5'>
        <FaTasks fontSize={24}/>
        <span className='text-neutr text-lg'>Task Management</span>
      </div>
      <div className='flex-1 py-8 flex flex-col gap-0.5'>
          {DASHBOARD_SIDEBAR_LINKS.map((item) => (
            <SidebarLink key={item.key} item={item} />
            
          ))}
        </div>
      <div className='flex flex-col gap-0.5 border-t border-neutral-700'>
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map(item => (
          <SidebarLink key={item.key} item={item}/>
        ))}
        <div className='flex items-center gap-2 px-2 py-4 rounded-lg hover:bg-red-500 hover:text-white hover:no-underline text-red-500 cursor-pointer'>
          <span className='text-xl'><HiOutlineLogout/></span>
          Logout
       </div>
      </div>
    </div>
  )
}

function SidebarLink({ item }) {
  return (
    <Link to={item.path} className={linkClass}>
      <span className='text-xl'>{item.icon}</span>
      {item.label} 
    </Link>
  )
}

export default Sidebar