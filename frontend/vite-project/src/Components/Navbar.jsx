import React, { useState } from "react";
import { Link } from 'react-router-dom';
import SearchComponent from "./Search";

const Navbar = ({ setResponse }) => {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <div className="bg-black shadow-lg">
         <div className="flex flex-col sm:flex-row justify-between items-center w-full h-auto sm:h-16 border-b-2 border-gray-700 p-4">
            {/* Left Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center w-full sm:w-6/12 mb-4 sm:mb-0">
               <div className="logo flex items-center justify-center w-full sm:w-1/3 h-full p-2 mb-4 sm:mb-0">
                  <Link to='/' className="text-3xl font-extrabold text-gray-100 hover:text-yellow-300 transition duration-300 font-serif">SearchImage</Link>
               </div>

               <div className="flex flex-col sm:flex-row justify-between items-center w-full sm:w-2/3 h-full">
                  <Link to='/upload' className="w-full text-center text-gray-100 p-2 hover:bg-gray-800 rounded transition duration-300 mb-2 sm:mb-0 font-medium">Upload</Link>
                  <Link to='/uploads' className="w-full text-center text-gray-100 p-2 hover:bg-gray-800 rounded transition duration-300 mb-2 sm:mb-0 font-medium">Uploaded</Link>
                  <Link to='/Recent' className="w-full text-center text-gray-100 p-2 hover:bg-gray-800 rounded transition duration-300 mb-2 sm:mb-0 font-medium">Recently Searched</Link>
                  <Link to='/About' className="w-full text-center text-gray-100 p-2 hover:bg-gray-800 rounded transition duration-300 font-medium">About</Link>
               </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center w-full sm:w-6/12">
               {/* Search Bar */}
               <div className="flex justify-center items-center w-full sm:w-2/3 mb-4 sm:mb-0 border-2 border-gray-700 rounded-full shadow-md p-2">
                  <SearchComponent setResponse={setResponse} />
               </div>

               {/* Sign-up Button */}
               <div className="flex justify-center items-center w-full sm:w-1/3 h-full">
                  <Link to='/sign-up'>
                     <button type="button" className="w-full text-center bg-yellow-500 hover:bg-yellow-400 text-gray-900 p-2 rounded transition duration-300 font-semibold">
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