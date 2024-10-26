import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [val, setVal] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    confirmPassword: "",
    PhoneNumber: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVal(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (val.Password !== val.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/user/signup', val, {
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

  const initiateGoogleOAuth = async() => {
    const response = await axios.get("http://localhost:3000/api/user/google/signup", {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: (status) => status > 0,
      withCredentials: true
    });
    console.log(response.data);
    window.location.href = response.data;
  };

  return (
    <div className="flex flex-col lg:flex-row mx-auto w-full lg:w-11/12 h-full lg:h-screen justify-between my-3 bg-gray-50 z-10">
      {/* Left Side Form */}
      <div className="w-full lg:w-1/3 h-full mx-auto bg-white rounded-lg shadow-lg my-2 p-6">
        <h1 className="text-center text-3xl font-bold mb-6 text-teal-900">Create Your Account</h1>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          {['FirstName', 'LastName', 'Email', 'PhoneNumber', 'Password', 'confirmPassword'].map((field, index) => (
            <div key={index}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                {field.replace(/([A-Z])/g, ' $1').trim()} {/* Convert camelCase to readable text */}
              </label>
              <input
                type={field.includes('Password') ? 'password' : 'text'}
                name={field}
                value={val[field]}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').trim()}`}
              />
            </div>
          ))}
          
          <button type="submit" className="w-full text-white bg-teal-900 p-2 rounded-full hover:bg-teal-800 transition">Sign Up</button>
        </form>

        {/* Google Sign Up and Navigation Links */}
        <div className="flex flex-col items-center space-y-3 mt-4">
          <button className="flex justify-center items-center w-full py-2 bg-white border border-black text-black font-bold rounded-full hover:bg-gray-100 transition" onClick={initiateGoogleOAuth}>
            <img src="../logo-color.png" className="h-5 w-5 mr-2" alt="Google Logo" />
            Sign Up With Google
          </button>
          <p>Or</p>
          <p>Already Have an Account? <Link className="text-teal-900 font-bold" to='/sign-in'>Sign In</Link></p>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="hidden lg:block w-full lg:w-3/5 h-full">
        <img src="../image1.jpg" className="h-full w-full object-cover rounded-tl-lg rounded-bl-lg" alt="Background" />
      </div>
    </div>
  );
};

export default SignUp;