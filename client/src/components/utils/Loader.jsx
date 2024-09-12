import React from 'react'

const Loader = (props) => {
  return (
    <>
    <div className="flex items-center justify-center flex-col h-screen">
        <div className="w-16 h-16 bg-gradient-to-br from-lightskyblue via-rebeccapurple to-sandybrown  rounded-full animate-pulse"></div>
        <p className='font-bold text-md mt-2 animate-bounce'>{props.text}</p>
    </div>
    </>
  )
}

export default Loader
