import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const SearchComponent = ({ setResponse }) => {
  const [searchTerm, setSearchTerm] = useState("");  
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(""); 

console.log(searchTerm);
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();  
    
    if (!searchTerm) { // Prevent empty search submissions
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);  // Set loading state
    setError("");      // Reset error state

    try {
      const response = await axios.post(
        "http://localhost:3000/api/image/getImage", 
        {desc: searchTerm}, 
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials:true,
          validateStatus:(status) => status > 0,
        }
      );
    
      if (response.status === 200) {
        setResponse(response.data.data);  
      } else {
        setError("No images found.");
      }
    } catch (error) {
        console.log(error);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);  // Reset loading state
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
          className="border rounded p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded ml-2">
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>} 
    </div>
  );
};

export default SearchComponent;