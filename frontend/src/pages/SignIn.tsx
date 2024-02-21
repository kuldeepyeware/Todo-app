/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal } from "../components/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const SignIn: React.FC = () => {
  type EventType = React.ChangeEvent<HTMLInputElement>;

  const link = import.meta.env.VITE_APP_LINK;
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const loginAccount = async (email: string, password: string) => {
    const response = await axios.post(`${link}api/v1/user/signin`, {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    setEmail("");
    setPassword("");
    navigate("/");
  };

  const validUser = async (token: string) => {
    try {
      const response = await axios.post(`${link}api/v1/user/me`, {
        token,
      });
      response.data.validUser && navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = `Bearer ${localStorage.getItem("token")}`;
    validUser(token);
  }, []);

  return (
    <Modal>
      <div className='text-center '>
        <h1 className='text-3xl font-semibold '>Login</h1>
        <p className='wrap text-sm text-[#707070]'>
          Enter your credentials to access your account
        </p>
      </div>
      <div className='flex flex-col w-full px-[40px] gap-3'>
        <label htmlFor='Email'>Email</label>
        <input
          type='email'
          placeholder='johndoe@gmail.com'
          name='Email'
          onChange={(e: EventType) => setEmail(e.target.value)}
          className='p-1 rounded-lg placeholder-[#707070] outline-none bg-black text-white border border-[#27272a]'
        />
        <label htmlFor='Password'>Password</label>
        <input
          type='password'
          name='Password'
          onChange={(e: EventType) => setPassword(e.target.value)}
          className='p-1 rounded-lg placeholder-[#707070] outline-none text-white bg-black border border-[#27272a]'
        />
      </div>
      <div className='w-full px-[40px] '>
        <button
          onClick={() => loginAccount(email.toLowerCase(), password)}
          className='bg-white text-black h-9 w-full font-medium py-2 px-4 rounded-md cursor-pointer flex justify-center'>
          Login
        </button>
      </div>
      <div className='text-sm'>
        Don't have an account?
        <span
          className='underline cursor-pointer'
          onClick={() => navigate("/signup")}>
          Sign Up
        </span>
      </div>
    </Modal>
  );
};
