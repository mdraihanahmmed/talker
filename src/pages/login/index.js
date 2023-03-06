import { type } from "@testing-library/user-event/dist/type";
import React, { useState } from "react";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import RingLoader from "react-spinners/RingLoader";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { userLoginInfo } from "../../slices/userSlice";

import { getDatabase, ref, set, push } from "firebase/database";

const Login = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let [showpassword, setShowpassword] = useState(false);
  let [loader, setLoader] = useState(false);

  let [user, setUser] = useState({ email: "", password: "" });
  let { email, password } = user;

  let handleChange = (e) => {
    let filed_name = e.target.name;
    setUser({ ...user, [e.target.name]: e.target.value });
    // if (filed_name === "email") {
    //   setUserror({ emailerr: "" });
    // }
    if (filed_name === "email") {
      setUserror({ emailerr: "", passworderr });
    }
    if (filed_name === "password") {
      setUserror({ passworderr: "", emailerr });
    }
  };

  let [usererror, setUserror] = useState({ emailerr: "", passworderr: "" });
  let { emailerr, passworderr } = usererror;

  let handleClick = () => {
    let emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    var passwordregex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    setUserror({
      emailerr:
        (!email && "email is required!") ||
        (!email.match(emailregex) && "invalid email"),
      passworderr:
        (!password && "passward is required!") ||
        (!password.match(passwordregex) && "please give a strong password"),
    });

    if (
      email &&
      password &&
      email.match(emailregex) &&
      password.match(passwordregex)
    ) {
      setLoader(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          toast.success(
            "Login Successfull please wait for redrection thank you"
          );
          setLoader(false);
          setUser({ email: "", password: "" });
          dispatch(userLoginInfo(user.user));
          localStorage.setItem("userData", JSON.stringify(user));
          setTimeout(() => {
            navigate("/");
          }, 2000);
        })
        .catch((error) => {
          if (error.code.includes("auth/user-not-found")) {
            setUserror({ emailerr: "Sorry! user not foun!!" });
          }
          if (error.code.includes("auth/wrong-password")) {
            setUserror({ passworderr: "Wrong Password!!" });
          }
          setLoader(false);
        });
    }
  };

  let handleGoogleSignIn = () => {
    signInWithPopup(auth, provider).then((user) => {
      // console.log("then", user);
      // console.log("pop up dataa: ", user.user.displayName);
      set(push(ref(db, "users/" + user.user.uid)), {
        username: user.user.displayName,
        email: user.user.email,
      });
      navigate("/");
    });
  };

  return (
    <div className="flex">
      <ToastContainer position="bottom-center" theme="dark" />
      <div className="xl:w-2/4 lg:w-2/4 w-full flex justify-end">
        <div className="xl:mr-16 px-4 lg:px-4 mt-16 xl:mt-28 xl:w-2/4 w-full relative">
          <h3 className="font-nunito font-bold xl:text-3xl text-2xl text-heading">
            Login to your account!
          </h3>

          <button
            onClick={handleGoogleSignIn}
            className="border-2 border-solid rounded-lg p-6 font-nunito font-semibold mt-8"
          >
            <FcGoogle className="inline-block text-[20px] mr-3" /> Login with
            Google
          </button>

          <div className="relative mt-16 w-full">
            <input
              name="email"
              value={email}
              type="email"
              onChange={handleChange}
              className="border-b outline-none border-solid xl:w-96 w-full border-secondary py-4  "
            />

            {emailerr && (
              <p className="bg-error text-xl  anim shadow-lg shadow-red-200 text-center font-semibold text-white rounded-lg xl:w-96 p-3 mt-3">
                {emailerr}
              </p>
            )}
            <p className="font-nunito font-semibold text-xs text-heading absolute top-[-8px] left-0 bg-white ">
              Email Address
            </p>
          </div>

          <div className="relative mt-16 xl:w-96">
            <input
              name="password"
              value={password}
              type={showpassword ? (type = "text") : (type = "password")}
              onChange={handleChange}
              className=" border-b outline-none border-solid w-full  border-secondary py-4  "
            />
            {passworderr && (
              <p className="bg-error text-xl  anim shadow-lg shadow-red-200 text-center font-semibold text-white rounded-lg xl:w-96 p-3 mt-3">
                {passworderr}
              </p>
            )}
            <p className="font-nunito font-semibold text-xs text-heading absolute top-[-8px] left-0 bg-white ">
              Password
            </p>
            {showpassword ? (
              <RiEyeFill
                onClick={() => setShowpassword(!showpassword)}
                className="absolute top-5 right-2.5"
              />
            ) : (
              <RiEyeCloseFill
                onClick={() => setShowpassword(!showpassword)}
                className="absolute top-5 right-2.5"
              />
            )}
          </div>
          {loader ? (
            <div className="flex justify-center mt-4 xl:w-96">
              <RingLoader
                color="#AFADBA"
                size={80}
                speedMultiplier={1}
                className="w-full"
              />
            </div>
          ) : (
            <button
              onClick={handleClick}
              className="bg-primary xl:w-96 w-full text-white py-5 rounded-lg shadow-md shadow-black mt-12 font-semibold font-nunito text-lg"
            >
              Login to Continue
            </button>
          )}

          <p className="xl:w-96 flex mt-7 justify-center text-[#03014C] font-nunito font-semibold text-[14px]">
            Don’t have an account ?{" "}
            <Link
              to="/registration"
              className="text-[#EA6C00] ml-1 font-semibold"
            >
              Sign Up
            </Link>
          </p>
          <p className="xl:w-96  flex mt-7 justify-center text-[#03014C] font-nunito font-semibold text-[14px]">
            <Link
              to="/forgotpassword"
              className="text-[#EA6C00] ml-1 font-semibold"
            >
              Forgot Password
            </Link>
          </p>
        </div>
      </div>
      <div className="xl:w-2/4 lg:w-2/4 hidden xl:block lg:block">
        <img src="images/login.png" className="h-screen w-full object-cover" />
      </div>
    </div>
  );
};

export default Login;
