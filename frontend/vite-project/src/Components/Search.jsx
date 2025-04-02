import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context/globalContext";
import { Loader2 } from "lucide-react";

const SearchComponent = ({ setResponse }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setMsg, setSearchedImgs } = useContext(Context);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    if (!searchTerm) {
      setError("Please enter a search term.");
      setMsg({ message: "Enter some valid thing", status: 400 });

      return;
    }
    navigate(`/${searchTerm}`);

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/image/getImage`,
        { desc: searchTerm },
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: (status) => status > 0,
        }
      );

      if (response.status === 200) {
        setResponse(response.data.data);
        setSearchedImgs(response.data.data);
        setSearchTerm("");
      } else {
        setError("No images found.");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          name="desc"
          onChange={handleInputChange}
          placeholder="Search for images..."
          className="border rounded-lg md:px-4 px-2 md:py-2 py-1 nav-items "
        />
        <button
          type="submit"
          className="bg-blue-500 text-white md:p-2 p-1 rounded ml-1 nav-items"
        >
          {loading ? (
            <Loader2 className="min-[500px]:h-5 min-[500px]:w-5 h-2 w-2 animate-spin"></Loader2>
          ) : (
            "Search"
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchComponent;
