import React from "react";

const Home = ({ data }) => {
  
  const transformedData = data.map(item => ({
    title: item.title,
    description: item.desc,
    cloudinary_publicId:item.cloudinary_publicId
    
}));
  console.log("Within the home component",transformedData);
  return (

    <div className="p-4 bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen">
      <h1 className="text-white text-3xl font-bold text-center mb-6">Image Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {transformedData.length > 0 && transformedData.map((transformedData, index) => (
          <div 
            key={index} 
            className="relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-slate-50"
            style={{ width: '320px', height: '450px' }} // Fixing size
          >
            <img 
              src={`https://res.cloudinary.com/dewv14vkx/image/upload/v1/${transformedData.cloudinary_publicId}`} 
              alt="Cloudinary asset"
              className="w-full h-full object-contain transition-opacity duration-300 hover:opacity-200" 
            />
            <div className="absolute inset-0 bg-black opacity-25 hover:opacity-0 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;