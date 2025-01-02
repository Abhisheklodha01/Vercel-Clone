import React from 'react'

const Footer = () => {
  return (
    <div className='md:h-44  bg-gray-100'
    >
        <div className='text-gray-700 '>
          <p className='text-center text-xl pt-10'>Contect Us</p>
          <ul className='flex justify-center items-center flex-col 
          md:flex-row mt-5 gap-4 md:gap-10 pb-5'>
            <li>Email: support@deployease.com</li>
            <li>LinkedIn</li>
            <li>Github</li>
            <li>Instagram</li>
            <li>Facebook</li>
            </ul> 
        </div>
    </div>
  )
}

export default Footer