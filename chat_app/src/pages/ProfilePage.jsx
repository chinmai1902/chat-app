import React, { useContext, useState } from 'react';
import bgImage from '../assets/bgImage.svg'; 
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const{authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name,bio});
      navigate('/');
        return;
        }
       const reader = new FileReader();
       reader.readAsDataURL(selectedImg);
       reader.onload = async ()=>{
       const base64Image = reader.result;
       await updateProfile({profilePic: base64Image, fullName: name,bio});
       navigate('/');
       }
  }
  return (
    <div
      className='relative min-h-screen w-full flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col bg-no-repeat bg-center bg-cover'
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className=' h-[400px] w-[600px] max-w-2xl backdrop-blur-2xl text-gray-300 border-2 
      border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
  <h3 className='text-lg'>Profile details</h3>

  <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
    <input
      onChange={(e) => setSelectedImg(e.target.files[0])}
      type="file"
      id="avatar"
      accept=".png, .jpg, .jpeg"
      hidden
    />
    <img
      src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
      alt="avatar"
      className={`w-10 h-10 ${selectedImg ? 'rounded-full' : ''}`}
    />
    upload profile image
  </label>

  <input
    onChange={(e) => setName(e.target.value)}
    value={name}
    type="text"
    required
    placeholder="Your name"
    className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0cc0df]"
  />
 <textarea
  onChange={(e) => setBio(e.target.value)}
  value={bio}
  placeholder="Write profile bio"
  required
  className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0cc0df]"
  rows={4}
/>
<button
  type="submit"
  className="bg-gradient-to-r from-[#5ce1e6] to-[#0097b2] text-white p-2 rounded-full text-lg cursor-pointer"
>
  Save
</button>

</form>

      <div className="pr-8 mt-12 max10 max-sm:mt-10">
  <img 
    className={`w-44 aspect-square rounded-full ${selectedImg && 'rounded-full'}` }
    src={authUser?.profilePic || assets.logo_icon} 
    alt="avatar" 
  />
</div>


      </div>
    </div>
  );
};

export default ProfilePage;
