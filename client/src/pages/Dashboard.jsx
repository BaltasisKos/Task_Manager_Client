import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import DashStats from '../components/DashStats'

const Dashboard = () => {
  return (
    <>
    <div className='flex flex-row bg-neutral-100 min-h-screen w-full'>
      <Sidebar/>
      <div className='flex-1 w-full overflow-y-auto'>
      <Header/>
      <div className='px-3 py-2  flex-row gap-4'>
        <DashStats/>
      </div>
      </div>
    </div>
    
  
  </>  
  )
}

export default Dashboard