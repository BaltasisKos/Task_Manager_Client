import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const Dashboard = () => {
  return (
    <div className='flex flex-row bg-neutral-100 min-h-screen w-full'>
      <Sidebar/>
      <div className='flex-1 w-full overflow-y-auto'>
      <Header/>
      </div>
    </div>
  )
}

export default Dashboard