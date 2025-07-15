import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {

  const{getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);

  const {authUser, logout, onlineUsers} = useContext(AuthContext);

  const[input, setInput] = useState(false)

  const navigate = useNavigate();

  const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())): users;

  useEffect(() => {
  if (authUser) {
    console.log("authUser exists, calling getUsers()");
    getUsers();
  } else {
    console.log("authUser is null");
  }
}, [onlineUsers, authUser]);


  return (
    <div className={`bg-[#8185B2]/10 p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      
      <div className="flex justify-between items-start mb-0">
        {/* Logo */}
        <img src={assets.logo} alt='logo' className='max-w-40 mt-[-60px] ml-[-30px]' />
        
        {/* Menu Icon with Dropdown */}
        <div className="relative group">
          <img src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer mt-[10px]' />
          <div className='absolute top-[30px] right-0 z-20 w-32 p-5 rounded-md bg-[#163f47] border border-gray-600 text-gray-100 hidden group-hover:block'>
            <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
            <hr className="my-2 border-t border-gray-500" />
            <p onClick={()=> logout()}className='cursor-pointer text-sm'>Logout</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
        <div className='bg-[#163f47] rounded-full flex items-center gap-2 h-9 px-4 w-full mt-[-45px]'>
        <img src={assets.search_icon} alt="Search" className='w-4' />
        <input onChange={(e)=>setInput(e.target.value)}
          type="text"
          className='bg-transparent border-none outline-none text-white text-sm placeholder-[#c8c8c8] flex-1'
          placeholder='Search User'
        />
      </div>

      <div className='flex flex-col mt-4'>
        {filteredUsers.map((user, index) => (
          <div onClick={() => { setSelectedUser(user); setUnseenMessages(prev=>({...prev, [user._id]:0}))}}
            key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id ? 'bg-[#00788d]/50' : ''}`}>
            <img src={user?.profilePic || assets.avatar_icon} alt=""
              className='w-[26px] aspect-[1/1] rounded-full' />
            <div className='flex flex-col leading-5'>
              <p className="text-xs">{user.fullName}</p>
              {
                onlineUsers.includes(user._id)
                  ? <span className='text-green-400 text-xs'>Online</span>
                  : <span className='text-neutral-400 text-xs'>Offline</span>
              }
            </div>
            {unseenMessages[user._id] > 0 && 
              <p style={{ backgroundColor: '#007084' }} className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full text-white'>

                {unseenMessages[user._id]}
              </p>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar;
