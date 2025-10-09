import React from 'react'

const Rank = ({name, entries}) => {

  
  return (
    <div className='flex flex-col items-center justify-center text-2xl font-semibold'>
    <div>
        {`${name}, your number of entries is:`}
    </div>
    <div className='text-4xl'>
      {entries}
    </div>
    </div>
  )
}

export default Rank;