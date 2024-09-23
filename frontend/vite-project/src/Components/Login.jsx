import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login form submission here
    try {
      // Send data to server using axios
      const data={
        Email:email,
        Password:password
      }
      const response = await axios.post('http://localhost:3000/api/user/Login',data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials:true,
        validateStatus:function(status){
          return status>0;
        },
       
      });
      console.log(response)
    //  if(response.data.success){
    //   navigate('/')
    //  };
      if(response.success!=true){

      } // Handle response from server
    } catch (error) {
      console.log("Entering to the error section :")
      console.error('Error login:', error);
    }
   
  };

  return (
    <>
      <div className="flex mx-auto items-center w-11/12 h-screen justify-center my-3 bg-slate-50">
        <div className="w-full max-w-md h-auto bg-slate-200 rounded-lg shadow-lg">
          <div className="p-6">
            <h1 className="text-center text-3xl font-bold mb-6">Welcome Back</h1>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 text-white bg-teal-900 rounded-full hover:bg-teal-700 transition duration-300"
              >
               Sign-in
                
              </button>
            </form>
            <div className="flex flex-col items-center mt-6">
              <button className="flex justify-center items-center px-4 py-2 w-full text-black rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition duration-300">
                <img src="../logo-color.png" className="h-5 w-5 mr-2" alt="Google Logo" />
                Sign In With Google
              </button>
              <p className="mt-4 text-gray-500">Or</p>
              <p className="mt-2">
                Don't have an account?{' '}
                <Link className="text-teal-600 hover:underline" to="/sign-up">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;