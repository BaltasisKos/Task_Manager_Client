import React from 'react'
import Sidebar from '../components/Sidebar'

const Dashboard = () => {
  return (
    <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
      <Sidebar/>
      <div className='p-4'>
      <div className='bg-teal-200'>Header</div>
      </div>
    </div>
  )
}

export default Dashboard