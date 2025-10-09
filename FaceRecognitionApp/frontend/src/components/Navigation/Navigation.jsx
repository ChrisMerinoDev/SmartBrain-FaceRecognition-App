import React from 'react'

const Navigation = ({ onRouteChange }) => {
  return (
    <nav className='flex justify-end'>
        <button 
          className='underline hover:cursor-pointer hover:text-blue-500'
          onClick={() => onRouteChange("signin")}
        >
          Sign Out
        </button>
    </nav>
  )
}

export default Navigation;