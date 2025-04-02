import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { UserRoundSearch } from "lucide-react";
import ProfileCard from "./ProfileCard";
import useApi from "../Hooks/useApi";
import { Context } from "../Context/globalContext";
import { useNavigate } from "react-router-dom";

const Gallery = ({ data = [], DeleteAndEdit }) => {
  const [editFormId, setEditFormId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", desc: "" });
  const [visible, setVisible] = useState(false);
  const [datas, setData] = useState({});
  const { searchedImgs, setUserAuth } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (data.length > 0) {
      setUserAuth(true);
    }
  }, [data]);
  const handleView = () => {
    setVisible(false);
    document.body.style.overflow = "auto";
  };
  const getOwnerDetail = async (ownerId) => {
    if (!ownerId) {
      return;
    }
    axios
      .get(`http://localhost:3000/api/user/images/details/${ownerId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        validateStatus: function (status) {
          return status > 0;
        },
      })
      .then((response) => {
        if (response.status == 401) {
          navigate("/sign-in");
          return;
        }

        setData(response.data);
        setVisible(true);
        document.body.style.overflow = "hidden";
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const removeItem = async (e) => {
    const imgId = e.currentTarget.id;
    try {
      await axios.delete(`http://localhost:3000/api/user/images/${imgId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        validateStatus: (status) => status > 0,
      });
    } catch (error) {
      console.error("Error deleting image:", error);
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
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setEditFormId(null);
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  return (
    <div className="p-4 bg-[#0C1521]  from-gray-900 to-gray-700 min-h-screen flex flex-col justify-start items-center w-screen pt-24 relative">
      <div className="flex items-start justify-center">
        {data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-[1350px]:grid-cols-4 gap-4 w-full">
            {data.map((dataItem, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-black h-[450px] w-[320px] max-[400px]:w-[300px] cursor-pointer"
              >
                <img
                  src={`https://res.cloudinary.com/dewv14vkx/image/upload/v1/${dataItem.cloudinary_publicId}`}
                  alt="Cloudinary asset"
                  className="w-full h-full object-contain"
                />

                {DeleteAndEdit && (
                  <div
                    className="absolute bottom-0 right-0 p-2 flex space-x-2"
                    style={{ background: "rgba(0, 0, 0, 0.6)" }}
                  >
                    <button
                      onClick={() => handleEditClick(dataItem)}
                      className="hover:scale-110 transition-all duration-150"
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ color: "#63E6BE", cursor: "pointer" }}
                      />
                    </button>
                    <button
                      id={dataItem._id}
                      onClick={removeItem}
                      className="hover:scale-110 transition-all duration-150"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: "#FF6B6B", cursor: "pointer" }}
                      />
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
                        onClick={() => {
                          setEditFormId(null);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                {/* <div className="absolute bottom-2 left-2 rounded-full border-white border-2 p-2 ">
                  <UserRoundSearch
                    className="h-4 w-4 text-white"
                    onClick={() => getOwnerDetail(dataItem.owner)}
                  ></UserRoundSearch>
                </div> */}
              </div>
            ))}
          </div>
        ) : (
          <div className="heading text-white ">
            {" "}
            Create your personalized gallery!
          </div>
        )}
      </div>
      {visible && (
        <div className="w-full h-screen bg-white/60 flex items-center justify-center fixed">
          (
          <ProfileCard
            image={datas.data.images}
            email={datas.data.email}
            name={datas.data.name}
          />
          )
        </div>
      )}
      {visible && (
        <div className="fixed top-12 right-2 z-50">
          <input type="checkbox" name="" id="profile" className="peer hidden" />
          <label
            htmlFor="profile"
            className="peer-checked:hidden"
            onClick={handleView}
          >
            <img
              src="./cross.png"
              alt=""
              className="object-scale-down w-12 h-12 hover:scale-110 transition-all duration-150 cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default Gallery;
