import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const{login} = useContext(AuthContext)

  const onSubmitHandler = (event)=>{
    event.preventDefault();
   if(currState === 'Sign up' && !isDataSubmitted){
    setIsDataSubmitted(true)
    return;
   }

   login(currState === "Sign up" ? 'signup' : 'login', {fullName, email, password, bio})
  }


  return (
    <div className="relative min-h-screen w-full flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col">

      
      <div className="absolute inset-0 z-0">
        <img
  src={assets.bgImage}
  alt="bg"
  className="absolute inset-0 w-full h-full object-contain object-center z-0 mx-auto translate-x-[0%]"
/>

        <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />
      </div>

      
      <div className="relative z-10 flex items-center justify-center gap-77 sm:justify-evenly max-sm:flex-col -translate-x-[80px] ml-[80px]">
        {/* ---left logo--- */}
        <img src={assets.logo_big} alt="logo" className="w-[min(40vw,350px)] ml-[35px]" />
        {/* ---right form--- */}
        <form onSubmit={onSubmitHandler} className="border-2 bg-white/10 text-white border-gray-500 p-3 flex flex-col gap-3 rounded-lg shadow-lg w-fit max-w-[260px] w-full">
          <h2 className="font-medium text-lg flex justify-between items-center px-1 py-1">
            {currState}
            {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className="w-4 cursor-pointer" />
            }
          </h2>
           {currState === "Sign up" && !isDataSubmitted && (
            <input onChange={(e)=>setFullName(e.target.value)} value={fullName}
            type="text" className='text-sm px-2 py-2 border border-gray-500 rounded-md
            focus:outline-none focus:ring-2 focus:ring-[#0cc0df]' placeholder="Full Name" required/>
           )}

           {!isDataSubmitted && (
            <>
            <input onChange={(e)=>setEmail(e.target.value)} value={email}
            type="email" placeholder='Email Address' required className=' text-sm px-2 py-2 border border-gray-500 rounded-md
            focus:outline-none focus:ring-2 focus:ring-[#0cc0df]' /> 
             <input onChange={(e)=>setPassword(e.target.value)} value={password}
            type="password" placeholder='Password' required className='text-sm px-2 py-2 border border-gray-500 rounded-md
            focus:outline-none focus:ring-2 focus:ring-[#0cc0df]' /> 
            </>
           )}

           {currState === "Sign up" && isDataSubmitted &&(
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
            rows={4} className='p-2 border border-gray-500 rounded-md
            focus:outline-none focus:ring-2 focus:ring-[#0cc0df]'
            placeholder='Provide a short bio...' required></textarea>
           )

           }

           <button
                  type='submit'
                  className='py-2 text-white rounded-md cursor-pointer w-full'
                 style={{
                 background: 'linear-gradient(to right, #5ce1e6, #0097b2)'
                 }}
>
                {currState === "Sign up" ? "Create Account" : "Login Now"}
           </button>

           <div className='flex items-center gap-2 text-[12px] text-gray-500'>
            <input type="checkbox" />
            <p>Agree to new terms of use & privacy policy.</p>
           </div>
           <div className='flex flex-col gap-2 ml-4'>
            {currState === "Sign up" ? (
            <p className='text-xs text-gray-600'>
             Already have an account?{' '}
             <span
             onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}}
             className='font-medium cursor-pointer'
             style={{ color: '#0cc0df' }}
            >
              Login here
             </span>
            </p>

            ): (
            <p className='text-xs text-gray-600'>
             Create an account{' '}
              <span className='cursor-pointer' style={{ color: '#0cc0df' }}
              onClick={()=> setCurrState("Sign up")}>
               Click here
               </span>
               </p>

           )}
          </div>

        </form>
      </div>
    </div>
  )
}

export default LoginPage
