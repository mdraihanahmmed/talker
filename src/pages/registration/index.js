import { type } from "@testing-library/user-event/dist/type";
import React, { useState } from "react";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import RingLoader from "react-spinners/RingLoader";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";

const Registraiton = () => {
  const db = getDatabase();
  const auth = getAuth();
  let navigate = useNavigate();
  let [showpassword, setShowpassword] = useState(false);
  let [success, setSuccess] = useState("");
  let [loader, setLoader] = useState(false);

  let [user, setUser] = useState({ email: "", fullname: "", password: "" });
  let { email, fullname, password } = user;

  let handleChange = (e) => {
    let filed_name = e.target.name;
    setUser({ ...user, [e.target.name]: e.target.value });

    if (filed_name === "email") {
      setUsererror({ emailerr: "", fullnameerr, passworderr });
    }
    if (filed_name === "fullname") {
      setUsererror({ emailerr, fullnameerr: "", passworderr });
    }
    if (filed_name === "password") {
      setUsererror({ emailerr, fullnameerr, passworderr: "" });
    }
  };

  let [usererror, setUsererror] = useState({
    emailerr: "",
    fullnameerr: "",
    passworderr: "",
  });
  let { emailerr, fullnameerr, passworderr } = usererror;

  let handleSubmit = () => {
    let emairegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    var passwordregex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    setUsererror({
      emailerr:
        (!email && "email is required!") ||
        (!email.match(emairegex) && "invalid email!"),
      fullnameerr: !fullname && "full name is required!",
      passworderr:
        (!password && "password is required!") ||
        (!password.match(passwordregex) && "please give a strong password"),
    });
    // if (!email) {
    //   setEmailerr("email is required!");
    // } else if (!email.match(emairegex)) {
    //   setEmailerr("invalid email!");
    // }
    // if (!fullname) {
    //   setFullnameerr("fullname is required!");
    // }
    // if (!password) {
    //   setPassworderr("password is required!");
    // } else if (!password.match(passwordregex)) {
    //   setPassworderr("please give a strong password");
    // }
    if (
      email &&
      fullname &&
      password &&
      email.match(emairegex) &&
      password.match(passwordregex)
    ) {
      setLoader(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          updateProfile(auth.currentUser, {
            displayName: fullname,
            photoURL: "images/avatar.jpg",
          })
            .then(() => {
              setSuccess(
                "Registration Successfull.please check your email for verification Thank you."
              );
              setLoader(false);
              setUser({ email: "", fullname: "", password: "" });
              setUsererror({ emailerr: "", fullnameerr, passworderr });
              sendEmailVerification(auth.currentUser);
              setTimeout(() => {
                navigate("/login");
              }, 2000);
            })
            .then(() => {
              set(ref(db, "users/" + user.user.uid), {
                username: user.user.displayName,
                email: user.user.email,
              });
            })

            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          let errorText = error.code;
          if (errorText.includes("auth/email-already-in-use")) {
            setUsererror({
              emailerr: "Email Already In Use!",
              fullnameerr,
              passworderr,
            });
            // setEmailerr("Email Already In Use!");
            setSuccess("");
            setLoader(false);
          }
        });
    }
  };

  return (
    <div className="flex">
      <div className="xl:w-2/4 lg:w-2/4 md:w-full w-full flex justify-end">
        <div className="xl:mr-16 xl:w-2/4 mt-10 w-full md:w-full px-3 xl:mt-28 relative">
          <h3 className="font-nunito font-bold  text-3xl text-heading">
            Get started with easily register
          </h3>
          <p className="font-nunito font-regular text-xl text-secondary mt-2.5  mb-16">
            Free register and you can enjoy it
          </p>
          {success && (
            <p className="bg-green-500  shadow-xl anim text-xl shadow-green-300  font-bold text-white rounded-xl xl:w-96 p-2  mt-2">
              {success}
            </p>
          )}
          <div className="relative  mt-10 xl:mt-16 w-full">
            <input
              name="email"
              value={email}
              type="email"
              onChange={handleChange}
              className="border outline-none border-solid w-full  xl:w-96  border-secondary py-4  px-10 rounded-xl"
            />
            {emailerr && (
              <p className="bg-error  shadow-xl anim text-xl shadow-red-200 text-center font-semibold text-white rounded-xl xl:w-96 p-3  mt-3">
                {emailerr}
              </p>
            )}
            <p className="font-nunito font-semibold text-xs text-heading absolute top-[-8px] left-[22px] bg-white px-2.5">
              Email Address
            </p>
          </div>
          <div className="relative mt-10 xl:mt-16 w-full xl:w-96">
            <input
              name="fullname"
              value={fullname}
              type="text"
              onChange={handleChange}
              className=" border outline-none border-solid xl:w-96 w-full border-secondary py-4  px-10 rounded-xl"
            />
            {fullnameerr && (
              <p className="bg-error text-xl anim shadow-xl shadow-red-200 text-center font-semibold text-white rounded-xl xl:w-96 p-3 mt-3">
                {fullnameerr}
              </p>
            )}
            <p className="font-nunito font-semibold text-xs text-heading absolute top-[-8px] left-[22px] bg-white px-2.5">
              Full Name
            </p>
          </div>
          <div className="relative mt-10 xl:mt-16 w-full xl:w-96">
            <input
              name="password"
              value={password}
              type={showpassword ? (type = "text") : (type = "password")}
              onChange={handleChange}
              className=" border outline-none border-solid w-full  border-secondary py-4  px-10 rounded-xl"
            />
            {passworderr && (
              <p className="bg-error text-xl  anim shadow-xl shadow-red-200 text-center font-semibold text-white rounded-xl xl:w-96 p-3 mt-3">
                {passworderr}
              </p>
            )}
            <p className="font-nunito font-semibold text-xs text-heading absolute top-[-8px] left-[22px] bg-white px-2.5">
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
              onClick={handleSubmit}
              className="bg-primary xl:w-96 w-full text-white py-5 rounded-full mt-12 font-semibold font-nunito text-xl"
            >
              Sign up
            </button>
          )}

          <p className="xl:w-96 flex mt-7 justify-center text-[#03014C] font-nunito font-semibold text-[14px]">
            Already have an account ?{" "}
            <Link to="/login" className="text-[#EA6C00] ml-1 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <div className="xl:w-2/4 hidden xl:block lg:block ">
        <img
          src="images/registration.png"
          className="h-screen w-full object-cover lg:ml-10 xl:ml-0"
        />
      </div>
    </div>
  );
};

export default Registraiton;
