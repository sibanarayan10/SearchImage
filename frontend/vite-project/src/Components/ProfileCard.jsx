import { Heading2, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";

function ProfileCard({ image, email = "Unknown@gmail.com", name }) {
  return (
    <div className="flex flex-col items-center bg-black/80 min-[500px]:w-3/5 w-11/12 border-red-500 border relative rounded-lg zoomOut">
      <div className="top flex items-center justify-between p-2 text-white w-4/5 ">
        <img src="./person.png" alt="" className="object-scale-down w-1/4" />
        <div className="flex-col items-start justify-start space-y-2  w-3/5">
          <div className="name w-full">
            <p className=" nav-items flex items-center space-x-2">
              <span>
                <User className="w-4 mr-2"></User>
              </span>
              {!name ? email.split("@")[0] : name}
            </p>
            <p className="w-full border-white border rounded-full "></p>
          </div>
          <div className="name w-full">
            <p className="nav-items flex items-center space-x-2">
              <span>
                <Mail className="w-4 mr-2"></Mail>
              </span>
              {email}
            </p>
            <p className="w-full border-white border rounded-full "></p>
          </div>
        </div>
      </div>
      <div className="about text-white nav-items font-thin  w-4/5">
        Hii,I am{" "}
        <span className="italic">{!name ? email.split("@")[0] : name}</span>. I
        am a MERN stack developer,with deep interest over exploring different js
        framework.I love to build challenging project,debugging code.
      </div>
      <h1 className="heading font-bold w-4/5 text-left text-white">
        Uploaded Images:
      </h1>
      {image ? (
        <div className="imageContainer scroll-smooth overflow-x-auto w-4/5 items-center py-1 flex space-x-2">
          {image.map((item, index) => (
            <img
              src={`https://res.cloudinary.com/dewv14vkx/image/upload/v1/${item.cloudinary_publicId}`}
              className="w-1/4 h-24 object-scale-down hover:scale-110 tranisition-all duration-150"
              key={index}
            />
          ))}
        </div>
      ) : (
        <h2 className="text-xl font-thin text-center text-red-500">
          No Images uploaded!
        </h2>
      )}
    </div>
  );
}

export default ProfileCard;
