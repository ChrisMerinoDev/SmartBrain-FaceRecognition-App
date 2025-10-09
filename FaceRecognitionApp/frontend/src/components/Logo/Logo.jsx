import React from 'react'
import Tilt from 'react-parallax-tilt';
import icon from '/face-scan-icon.png'

export const Logo = () => {
  return (
    <div className='h-[150px] w-[150px] flex'>
    <Tilt>
        <img src={icon} alt='face-scan-icon' width={512} height={512} />
    </Tilt>
    </div>
  )
}

