import React from 'react'
import { FaTasks } from "react-icons/fa";
import {Link} from 'react-router-dom'
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from './lib/consts/navigation';
import userIcon from "../assets/png-transparent-computer-icons-businessperson-senior-management-business-hand-people-business.png"

const linkClass =
	'flex items-center gap-2 font-light px-2 py-4 mt-3  hover:bg-blue-500 hover:text-white hover:no-underline active:bg-neutral-600 rounded-lg text-base'

const Sidebar = () => {
  return (
    <div className='flex flex-col bg-white w-60 p-3 text-black'>
      <div 
        onClick={() => window.location.reload()}
        className='flex items-center gap-2 py-3 mt-5 cursor-pointer'>
        {/* <FaTasks fontSize={24}/> */}
        <img src={userIcon} alt="User Icon" className="w-8 h-8 mr-3 rounded-2xl" />
        <span className='text-neutr text-lg'>Task Manager</span>
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