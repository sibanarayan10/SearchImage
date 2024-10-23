import React from "react";

const Home = ({ data }) => {
  
  const transformedData = data.map(item => ({
    title: item.title,
    description: item.desc,
    cloudinary_publicId: item.cloudinary_publicId
  }));

  console.log("Within the home component", transformedData);

  return (
    <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-700 min-h-screen">
        <h1 className="text-gray-100 text-3xl font-bold italic text-center mb-6" style={{ fontFamily: 'cursive' }}>Image Gallery</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {transformedData.length > 0 && transformedData.map((transformedData, index) => (
          <div 
            key={index} 
            className="relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-black"
            style={{ width: '320px', height: '450px' }} // Fixing size
          >
            <img 
              src={`https://res.cloudinary.com/dewv14vkx/image/upload/v1/${transformedData.cloudinary_publicId}`} 
              alt="Cloudinary asset"
              className="w-full h-full object-contain" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;