import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const validateValues = () => {
    let newErrors = {};

    if (!values.fullName.trim()) {
      newErrors.fullName = "Required";
    } else if (!/^[A-Za-z\s]+$/.test(values.fullname)) {
      newErrors.fullname = "Only letters are allowed";
    }

    if (!values.email.trim()) {
      newErrors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!values.password.trim()) {
      newErrors.password = "Required";
    } else if (values.password.length < 8) {
      newErrors.password = "Password should be at least 8 characters long";
    }

    if (values["confirmPassword"] !== values.password) {
      newErrors["confirmPassword"] = "Passwords do not match";
    }

    setError(newErrors);
  };
  const [error, setError] = useState({
    fullName: "",
    email: "",

    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,

    password: false,
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;

    setValues((prev) => ({ ...prev, [inputName]: inputValue }));
    setTouched((prev) => ({ ...prev, [inputName]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Object.keys(touched).map((item) => {
      touched[item] = true;
    });
    validateValues();

    const hasError = Object.values(error).some((item) => Boolean(item));
    if (hasError) {
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/signup`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          validateStatus: function (status) {
            return status > 0;
          },
        }
      );
      console.log(response.data);

      if (response.status >= 400) {
        alert(response.data.msg);
      } else {
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };
  useEffect(() => {
    validateValues();
  }, [values]);

  return (
    <div className="flex justify-center items-center mx-auto h-screen  z-10 bg-gradient-to-r from-gray-900 to-gray-700 pt-4">
      <div className="w-4/5 lg:w-1/3 min-[500px]:w-1/2 mx-auto bg-gray-950 rounded-lg shadow-lg p-6 shadow-inner shadow-white/20">
        <h1 className="text-center heading font-bold mb-6 text-white font-thin">
          Create Your Account
        </h1>

        <form className="space-y-2" onSubmit={handleSubmit}>
          {["fullName", "email", "password", "confirmPassword"].map(
            (field, index) => (
              <div key={index}>
                <label
                  htmlFor={field}
                  className="block nav-items font-medium text-gray-700 capitalize"
                >
                  {field.replace(/([A-Z])/g, " $1").trim()}{" "}
                </label>
                <input
                  type={
                    field.includes("password") ||
                    field.includes("confirmPassword")
                      ? "password"
                      : "text"
                  }
                  name={field}
                  value={values[field]}
                  onChange={handleOnChange}
                  className="mt-1 nav-items w-full px-3 py-2 border  rounded-full shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500  bg-gray-700 text-white border-gray-300 "
                  placeholder={` ${field.toLocaleLowerCase()}`}
                />
                {error[field] && touched[field] && (
                  <span className="max-[500px]:text-[8px] min-[500px]:text-xs  text-red-500 italic ml-3">
                    {error[field]}
                  </span>
                )}
              </div>
            )
          )}

          <button
            type="submit"
            className="w-full text-white bg-teal-900 p-2 rounded-full hover:bg-teal-800 transition nav-items mt-4"
          >
            Sign Up
          </button>
        </form>

        <div className="flex flex-col items-center space-y-3 mt-4">
          <p className="text-gray-700">Or</p>
          <p className="text-gray-700">
            Already Have an Account?{" "}
            <Link
              className="text-teal-600 font-bold cursor-pointer hover:scale-110 underline-offset-4 hover:underline"
              to="/sign-in"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
