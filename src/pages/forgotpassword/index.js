import React from "react";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  let [email, setEmail] = useState("");

  let handlEmail = (e) => {
    setEmail(e.target.value);
  };
  let handleSubmit = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Check Email For Reset Your Password");
        setEmail("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch(function (error) {
        let errorText = error.code;
        console.log(errorText);

        if (errorText.includes("auth/missing-email")) {
          toast.info("Please Give an Email Here");
        }
        if (errorText.includes("auth/invalid-email")) {
          toast.warning("Invalid Email !!!");
        }
        if (errorText.includes("auth/user-not-found")) {
          toast.error("Sorry! User Not Found !!!");
        }
      });
  };
  return (
    <div className="bg-error h-screen flex justify-center items-center">
      <ToastContainer position="top-center" theme="dark" />

      <div className="bg-white w-96 rounded-lg text-center shadow-lg shadow-black">
        <h1 className="text-2xl font-open font-bold mt-2">
          Forgot Password Setting
        </h1>
        <div className="relative mt-16 px-3">
          <input
            value={email}
            type="email"
            onChange={handlEmail}
            className="border border-solid  w-full border-secondary py-4  px-10 rounded-lg"
          />

          <p className="font-nunito font-semibold text-xs text-heading absolute top-[-8px] left-[22px] bg-white px-2.5">
            Email Address
          </p>
          <button
            onClick={handleSubmit}
            className="bg-primary px-3 text-white py-5 rounded-md mt-12 font-semibold font-nunito text-lg mr-28 mb-3"
          >
            Update
          </button>
          <Link
            to="/login"
            className="bg-primary px-3 text-white py-5 rounded-md mt-12 font-semibold font-nunito text-lg"
          >
            Back To Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
