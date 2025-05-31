import React, { useState } from 'react'
import axiosInstance from "../utils/axiosInstance";

const NewsLetterBox = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const res = await axiosInstance.post("/subscribe", { email });
            setMessage(res.data.message || "Check your email for your discount code!");
        } catch (error) {
            setMessage(error.response?.data?.message || "Subscription failed.");
        }
    }
    
  return (
    <div className='mt-10 text-center '>
        <p className='text-2xl font-medium text-gray-800'>Unlock 20% Off | Subscribe Today!</p>
        <p className='mt-3 text-gray-400'>Don't miss out—unlock your savings now by subscribing below!</p>
        <form onSubmit={onSubmitHandler} className='flex items-center w-full gap-3 pl-3 mx-auto my-6 border sm:w-1/2'>
            <input 
                className='w-full outline-none sm:flex-1' 
                type="email" 
                placeholder='hello@gmail.com'
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <button type='submit' className='px-10 py-4 text-xs text-white bg-black'>SUBSCRIBE</button>
        </form>
        {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  )
}

export default NewsLetterBox
