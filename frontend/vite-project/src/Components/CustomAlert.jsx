import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context/globalContext";

function CustomAlert() {
  const [visible, setVisible] = useState(false);

  const { msg } = useContext(Context);
  const { message, status } = msg;

  useEffect(() => {
    if (!msg.message) {
      return;
    }
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 2500);
  }, [msg]);

  return (
    <div className="absolute container mx-auto flex  justify-center items-center max-w-screen-2xl w-screen top-2">
      <div
        className={`bg-white flex items-center space-x-2 ${
          visible ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 linear rounded-lg drop-shadow-black px-2`}
      >
        <div className="icon">
          <img
            src={`${status == 200 ? "./green.png" : "./cross.png"}`}
            alt=""
            className="h-4 w-4"
          />
        </div>
        <div className="text-black font-thin nav-items">{message}</div>
      </div>
    </div>
  );
}

export default CustomAlert;
