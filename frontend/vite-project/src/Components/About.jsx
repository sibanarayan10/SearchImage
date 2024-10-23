import React from 'react';

const About = () => {
  return (
    <div className="about-container bg-gray-100 p-6 rounded-lg shadow-md mx-auto max-w-3xl mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center text-indigo-600">About Our Project</h1>
      <p className="text-gray-700 text-lg mb-4">
        Welcome to our image-sharing platform! This application allows users to upload their image files 
        and view all their uploaded images in one place. Our platform is designed to make it easy for users 
        to store, manage, and share their photos with the community.
      </p>
      <p className="text-gray-700 text-lg">
        Features include:
      </p>
      <ul className="list-disc list-inside mt-3 text-gray-600">
        <li>Upload your own images with ease.</li>
        <li>View and manage your uploaded images.</li>
        <li>Explore images uploaded by other users.</li>
        <li>Enjoy a seamless and user-friendly experience.</li>
      </ul>
    </div>
  );
};

export default About;