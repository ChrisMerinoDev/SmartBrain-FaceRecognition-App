import React from 'react'

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div className='flex flex-col justify-center items-center gap-4'>
        <p className='text-lg'>
            {'This Magic Brain will detect faces in your pictures. Give it a Try.'}
        </p>
        <div className='px-12 py-4 rounded-lg shadow-black shadow-md'>
            <div className='flex flex-col justify-center items-center space-y-3'>
                <input 
                  type='text' 
                  name='imageUrl'
                  required
                  placeholder='Paste Image URL'
                  className="bg-white rounded-sm py-0.5 px-2 w-80" 
                  onChange={onInputChange}
                 />
                <button 
                  className=' bg-purple-500 rounded-md text-white px-4 py-1 border hover:bg-purple-600 hover:cursor-pointer transition-all hover:scale-105'
                  onClick={onButtonSubmit}>
                    Detect
                </button>
            </div>
        </div>
    </div>
  )
}

export default ImageLinkForm;