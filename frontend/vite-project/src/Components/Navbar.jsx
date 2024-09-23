import React, { useState } from "react";
import { Link } from 'react-router-dom';
import SearchComponent from "./Search";

const Navbar = ({ setResponse }) => {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <div className="bg-blue-600 shadow-lg">
         <div className="flex flex-col sm:flex-row justify-between items-center w-full h-auto sm:h-16 border-b-2 border-white p-4">
            {/* Left Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center w-full sm:w-6/12 mb-4 sm:mb-0">
               <div className="logo flex items-center justify-center w-full sm:w-1/3 h-full p-2 mb-4 sm:mb-0">
                  <Link to='/' className="text-3xl font-bold text-white hover:text-yellow-300 transition duration-300">SearchImage</Link>
               </div>

               <div className="flex flex-col sm:flex-row justify-between items-center w-full sm:w-2/3 h-full">
                  <Link to='/upload' className="w-full text-center text-white p-2 hover:bg-blue-700 rounded transition duration-300 mb-2 sm:mb-0">Upload</Link>
                  <Link to='/uploads' className="w-full text-center text-white p-2 hover:bg-blue-700 rounded transition duration-300 mb-2 sm:mb-0">Uploaded</Link>

                  <Link to='/Recent' className="w-full text-center text-white p-2 hover:bg-blue-700 rounded transition duration-300 mb-2 sm:mb-0">Recently Searched</Link>
                  <Link to='/About' className="w-full text-center text-white p-2 hover:bg-blue-700 rounded transition duration-300">About</Link>
               </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center w-full sm:w-6/12">
               {/* Search Bar */}
               <div className="flex justify-center items-center w-full sm:w-2/3 mb-4 sm:mb-0 border-2 border-white rounded-full shadow-md p-2">
                  <SearchComponent setResponse={setResponse} />
               </div>

               {/* Sign-up Button */}
               <div className="flex justify-center items-center w-full sm:w-1/3 h-full">
                  <Link to='/sign-up'>
                     <button type="button" className="w-full text-center bg-yellow-500 hover:bg-yellow-400 text-white p-2 rounded transition duration-300">
                        SIGN-UP?
                     </button>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Navbar;