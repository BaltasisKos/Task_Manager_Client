import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
  DASHBOARD_SIDEBAR_LINKS,
} from './lib/consts/navigation';
import userIcon from '../assets/png-transparent-computer-icons-businessperson-senior-management-business-hand-people-business.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={`flex flex-col bg-white text-black p-3 transition-all duration-700 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-70'}`}
      style={{ minHeight: '100vh', overflow: 'hidden' }}
    >
      {/* Logo and Collapse Toggle */}
      <div
      className="flex items-center py-1 mt-1 cursor-pointer transition-all duration-700 ease-in-out justify-between"
    >
      <div
        className="flex items-center gap-2 transition-all duration-700 ease-in-out"
        onClick={() => {
          if (isCollapsed) {
            setIsCollapsed(false);
          } else {
            window.location.reload();
          }
        }}
        style={{ flexShrink: 0 }}
      >

          <img
            src={userIcon}
            alt="User Icon"
            className="ml-4 w-8 h-8 rounded-2xl flex-shrink-0"
          />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-700 ease-in-out
              ${isCollapsed ? 'w-0' : 'w-30'}`}
            style={{ display: 'inline-block' }}
          >
            Task Manager
          </span>
        </div>

        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="text-black hover:text-blue-500 transition-colors mr-2 cursor-pointer"
            aria-label="Collapse sidebar"
          >
            <FontAwesomeIcon icon={faXmark} />

          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 py-9 flex flex-col gap-3">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* Bottom Links */}
      <div className="flex flex-col gap-3 border-t pt-3 border-neutral-300">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} isCollapsed={isCollapsed} />
        ))}
      </div>
    </div>
  );
};

function SidebarLink({ item, isCollapsed }) {
  return (
    <Link
      to={item.path}
      className={`flex items-center font-light px-2 py-3 mt-1 rounded-lg text-base hover:bg-blue-500 hover:text-white transition-all duration-100 ease-in-out gap-3`}
    >
      <span className="text-xl w-10 flex justify-center flex-shrink-0">{item.icon}</span>

      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-100 ease-in-out
          ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}`}
        style={{ display: 'inline-block' }}
      >
        {item.label}
      </span>
    </Link>
  );
}


export default Sidebar;
