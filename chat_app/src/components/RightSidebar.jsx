import React from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { useState } from 'react'
import { useEffect } from 'react'

const RightSidebar = () => {

  const {selectedUser, messages} = useContext(ChatContext)
  const {logout, onlineUsers} = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])

  // get all  the images from messages and set them to state
  useEffect(()=> {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg=>msg.image)
    )
  },[messages])

  return selectedUser && (
    <div className={`bg-[#163f47]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className='w-20 aspect-[1/1] rounded-full'
        />
        <div className='px-10 text-xl font-medium mx-auto flex items-center gap-2 text-center break-words'>
          {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p> }
          <h1>{selectedUser.fullName}</h1>
        </div>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>
          <hr className="border-[#ffffff50] my-4"/>

          <div className="px-5 text-xs">
              <p>Media</p>
              <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2
              gap-4 opacity-80'>
                  {msgImages.map((url, index)=>(
                        <div key={index} onClick={()=> window.open(url)}
                        className='cursor-pointer rounded'>
                            <img src={url} alt="" className='h-full rounded-md'/>
                        </div>
                  ))}
               </div>
            </div>
             <button onClick={()=> logout()}
                style={{
                  background: 'linear-gradient(to right, #5ce1e6, #0097b2)'
                }}
                className='absolute bottom-2 left-1/2 transform -translate-x-1/2
                           text-white border-none text-sm font-light py-1 px-20
                           rounded-full cursor-pointer'
>
  Logout
</button>


         </div>
  )
}

export default RightSidebar
