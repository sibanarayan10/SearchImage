import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
const SignUp = () => {
  const [val, setVal] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    confirmPassword: "",
    PhoneNumber: ""
  });
  const navigate = useNavigate("");
  const[url,setUrl]=useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVal(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/api/user/SignUp', val, {
        headers: {
          'Content-Type': 'application/json'
        },
        validateStatus: function(status) {
          return status > 0;
        }
      });

      if (response.status >= 400) {
        alert(response.data.msg);
      } else {
        navigate('/sign-in');
      }

    } catch (error) {
      console.error('Error signing up:', error);
    }
  };
 useEffect(()=>{
   const fetchData=async()=>{
  const response=await axios.get('http://localhost:3000/api/user/signUp_google',{
    headers:{
      'Content-Type': 'application/json'
},
    withCredentials:true,
    validateStatus:function(status){
      return status>0;
    }
  });
  if(response.status==200){
    setUrl(response.data.data);
  };}
  fetchData();

},[]);
// useEffect(()=>{
//   const fetchData=async()=>{
//  const response=await axios.get('http://localhost:3000/api/user/oauthcallback',{
//    headers:{
//      'Content-Type': 'application/json'
// },
//    withCredentials:true,
//    validateStatus:function(status){
//      return status>0;
//    }
//  });
//  if(response.status==200){
//    navigate('/');
//  };}
//  fetchData();

// },[]);
  return (
    <div className="flex flex-col lg:flex-row mx-auto w-full lg:w-11/12 h-full lg:h-screen justify-between my-3 bg-slate-50 z-10">
      {/* Left Side Form */}
      <div className="w-full lg:w-1/3 h-full mx-auto bg-slate-200 rounded-lg my-2 p-4">
        <div className="h-auto lg:h-5/6 w-full lg:w-11/12 mx-4 my-3">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <h1 className="text-center text-2xl font-bold mb-4">Get Started Now..</h1>
            
            {/* First Name */}
            <div>
              <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="FirstName"
                value={val.FirstName}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="First Name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="LastName"
                value={val.LastName}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Last Name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="Email"
                value={val.Email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="PhoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="PhoneNumber"
                value={val.PhoneNumber}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your Phone Number"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="Password"
                value={val.Password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={val.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm your password"
              />
            </div>

            {/* Sign Up Button */}
            <button type="submit" className="w-full text-white rounded-full bg-teal-900 p-2">Sign Up</button>
          </form>
        </div>
        
        {/* Google Sign Up and Navigation Links */}
        <div className="flex flex-col items-center space-y-3 mt-4">
          <button className="flex justify-center items-center w-full lg:w-11/12 py-1 bg-white border border-black text-black font-bold rounded-full">
            <img src="../logo-color.png" className="h-5 w-5 mr-2" alt="Google Logo" />
           <Link to={url}> Sign Up With Google</Link>
          </button>
          <p>Or</p>
          <p>Already Have an Account? <Link className="text-blue-800" to='/sign-in'>Sign In</Link></p>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="hidden lg:block w-full lg:w-3/5 h-full">
        <img src="../image1.jpg" className="h-full w-full rounded-tl-lg rounded-bl-lg" alt="Background" />
      </div>
    </div>
  );
};

export default SignUp;