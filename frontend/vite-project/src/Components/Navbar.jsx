import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchComponent from "./Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { LogOut, TableOfContents, UserRoundPen } from "lucide-react";
import { Context } from "../Context/globalContext";

const Navbar = ({ setResponse, setLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navItems = ["upload", "uploads", "about"];
  const { userAuth } = useContext(Context);
  const [navigate, setNavigate] = useState("");
  const location = useLocation();

  const handleUserAuth = async () => {
    if (!userAuth) {
      return;
    }
    setLogout(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/log-out",
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
          validateStatus: (status) => status > 0,
        }
      );
      if (response.status == 200) {
        setNavigate("/sign-in");
      }
    } catch (error) {
      console.log("error in navbar", error);
    }
  };
  const hideNavbar = ["/sign-up", "/sign-in"];

  return hideNavbar.includes(location.pathname) ? null : (
    <div className="flex justify-center">
      <div className="bg-black shadow-lg container mx-auto max-w-screen-2xl w-screen fixed z-50">
        <div className="flex   flex-row justify-between items-center max-[768px]:items-start border-b-2 border-gray-700 p-2 w-full bg-black/80">
          <div className="flex flex-col md:flex-row justify-center items-center min-[475px]:w-1/2 w-1/3 ">
            <div className="logo flex items-center justify-center w-full  p-2 md:w-1/3 ">
              <Link
                to="/"
                className="heading font-bold text-gray-100 hover:text-yellow-300 transition-all duration-300 font-serif w-full"
              >
                SearchImage
              </Link>
            </div>

            <div
              className={`relative top-full flex-col md:flex-row justify-center min-[768px]:flex items-center  md:w-2/3  nav-items ${
                isOpen ? "flex " : "hidden"
              } dropdown-drop   max-w-screen-2xl min-[475px]:left-1/2 md:left-0 max-[475px]:-right-full max-[768px]:w-screen`}
            >
              {navItems.map((item, index) => (
                <Link
                  to={`/${item}`}
                  className="w-full text-center text-gray-100 p-2 hover:bg-gray-800 rounded transition duration-300 font-medium capitalize"
                  key={index}
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-row items-center justify-end  gap-x-2 min-[475px]:w-1/2 w-2/3 ">
            <div className="flex justify-center items-center  shadow-md w-3/5 max-[400px]:w-2/3 ">
              <SearchComponent setResponse={setResponse} />
            </div>

            <div className="flex justify-center items-center">
              {/* <Link to="/sign-in">
                <button
                  type="button"
                  className="text-center bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-2 py-1 rounded transition duration-300 font-semibold nav-items"
                  onClick={handleUserAuth}
                >
                  <span>
                    {!userAuth ? (
                      <UserRoundPen className="h-6 w-6 min-[400px]:h-4 min-[400px]:w-4 md:h-5 md:w-5"></UserRoundPen>
                    ) : (
                      <LogOut className="h-6 w-6 min-[400px]:h-4 min-[400px]:w-4 md:h-5 md:w-5"></LogOut>
                    )}
                  </span>
                </button>
              </Link> */}
            </div>
            <div className="hidden max-[768px]:flex">
              <TableOfContents
                className="text-white hover:scale-110 transition-all duration-150 cursor-pointer w-4"
                onClick={() => setIsOpen((prev) => !prev)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
