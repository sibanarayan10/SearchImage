import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage("Please select an image to upload.");
      return;
    }
    if (!title || !description) {
      setMessage("Please provide both title and description.");
      return;
    }

    const formData = new FormData();
    formData.append("Image", image);
    formData.append("Title", title);
    formData.append("Description", description);
    setUploading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/user/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
      });
      console.log(response);
      setMessage("File uploaded successfully!");
      setPreview(null);
      setImage(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      setMessage("File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setTitle("");
    setDescription("");
    setMessage("");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      <form 
        onSubmit={handleSubmit} 
        className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md text-white"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Upload an Image</h2>

        {/* Title Input */}
        <input 
          type="text" 
          placeholder="Title" 
          name="Title"
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="block w-full bg-gray-700 text-white py-2 px-3 border border-gray-600 rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
        />

        {/* Description Input */}
        <textarea
          placeholder="Description"
          name="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full bg-gray-700 text-white py-2 px-3 border border-gray-600 rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
          rows="3"
        ></textarea>

        {/* File Input */}
        <input 
          type="file"
          name="Image"
          onChange={handleImageChange} 
          className="block w-full bg-gray-700 text-white py-2 px-3 border border-gray-600 rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
        />

        {/* Image Preview */}
        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-300 mb-2">Preview:</p>
            <img src={preview} alt="Image Preview" className="w-full h-48 object-cover rounded-lg shadow-md" />
            <button 
              type="button" 
              onClick={handleClear}
              className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
            >
              Clear Image
            </button>
          </div>
        )}

        {/* Upload Button */}
        <button 
          type="submit" 
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>

        {/* Progress or Message */}
        {uploading && (
          <div className="mt-4 text-center text-blue-400">
            Uploading your file, please wait...
          </div>
        )}
        {message && (
          <p className="mt-4 text-center text-gray-300">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Upload;