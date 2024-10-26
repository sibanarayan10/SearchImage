import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";


const Home = ({ data, DeleteAndEdit }) => {

  const [editFormId, setEditFormId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", desc: "" });
  
  const removeItem = async (e) => {
    const imgId = e.currentTarget.id;
    console.log("Delete button clicked:", imgId);
    try {
      await axios.delete(`http://localhost:3000/api/user/images/${imgId}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        validateStatus: (status) => status > 0,
      });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
    window.location.reload();
  };

  const handleEditClick = (dataItem) => {
    setEditFormId(dataItem._id);

    setEditFormData({ title: dataItem.title || "", desc: dataItem.desc || "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/user/images/${editFormId}`,
        { title: editFormData.title, desc: editFormData.desc },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setEditFormId(null); // Close the form after successful update
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-700 min-h-screen">
      <h1
        className="text-gray-100 text-3xl font-bold italic text-center mb-6"
        style={{ fontFamily: 'cursive' }}
      >
        Image Gallery
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.length > 0 && data.map((dataItem, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-black"
            style={{ width: '320px', height: '450px' }}
          >
            <img
              src={`https://res.cloudinary.com/dewv14vkx/image/upload/v1/${dataItem.cloudinary_publicId}`}
              alt="Cloudinary asset"
              className="w-full h-full object-contain"
            />

            {DeleteAndEdit && (
              <div
                className="absolute bottom-0 right-0 p-2 flex space-x-2"
                style={{ background: 'rgba(0, 0, 0, 0.6)' }}
              >
                <button onClick={() => handleEditClick(dataItem)}>
                  <FontAwesomeIcon icon={faEdit} style={{ color: "#63E6BE", cursor: 'pointer' }} />
                </button>
                <button id={dataItem._id} onClick={removeItem}>
                  <FontAwesomeIcon icon={faTrash} style={{ color: "#FF6B6B", cursor: 'pointer' }} />
                </button>
              </div>
            )}

          
            {editFormId === dataItem._id && (
              <form
                onSubmit={handleEditSubmit}
                className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-75 p-4"
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={editFormData.title}
                  onChange={handleInputChange}
                  className="mb-2 p-2 rounded"
                />
                <input
                  type="text"
                  name="desc"
                  placeholder="Description"
                  value={editFormData.desc}
                  onChange={handleInputChange}
                  className="mb-2 p-2 rounded"
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {setEditFormId(null)}}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;