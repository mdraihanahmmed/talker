import React, { useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { TbMessageCircle } from "react-icons/tb";
import { MdOutlineNotificationsNone, MdCloudUpload } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { HiOutlineLogout } from "react-icons/hi";
import { getAuth, signOut, updateProfile } from "firebase/auth";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoginInfo } from "../../slices/userSlice";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import CircleLoader from "react-spinners/CircleLoader";
import { ToastContainer, toast } from "react-toastify";
// import BounceLoader from "react-spinners/BounceLoader";

import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

const Sidebar = ({ active }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const storage = getStorage();
  const data = useSelector((state) => state.userLoginInfo.userInfo);

  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [imageUploadModal, setImageUploadModal] = useState(false);

  let [uploader, setUploader] = useState(false);
  let [uploaderror, setUploaderror] = useState("");

  const handleProfileUpload = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const getCropData = () => {
    setUploader(true);
    if (typeof cropper == "undefined" || cropper == "") {
      setUploader(false);
      toast.info("please chose a file..!");
    }

    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            dispatch(userLoginInfo(auth.currentUser));
            localStorage.setItem("userInfo", JSON.stringify(auth.currentUser));
            setImageUploadModal(false);
            setImage("");
            setCropData("");
            setCropper("");
            setUploader(false);
          });
        });
      });
    }
  };

  let handleExit = () => {
    signOut(auth).then(() => {
      dispatch(userLoginInfo(null));
      localStorage.removeItem("userData");
      navigate("/login");
    });
  };

  let handleImageUpload = () => {
    setImageUploadModal(true);
  };
  let handleImageModalCancel = () => {
    setImageUploadModal(false);
    setImage("");
    setCropData("");
  };
  return (
    <div className="bg-primary w-full lg:h-screen rounded-xl xl:ml-2.5 p-9">
      <ToastContainer position="top-center" theme="dark" />

      <div className="group w-28 h-28 rounded-full mx-auto relative">
        <img src={data.photoURL} className="rounded-full w-full h-full" />
        <div
          onClick={handleImageUpload}
          className="bg-[rgba(0,0,0,.4)] opacity-0 group-hover:opacity-100 w-full h-full rounded-full absolute top-0 left-0 flex justify-center items-center"
        >
          <MdCloudUpload className="text-white text-2xl" />
        </div>
      </div>
      <h2 className="font-nunito text-xl  font-bold text-white text-center mt-2">
        {data.displayName}
      </h2>
      <div
        className={`relative z-[1] after:z-[-1]  xl:after:w-[132%] lg:after:w-[104%] sm:after:w-[111%]  md:after:w-[105%] 
      ${
        active == "home" &&
        "after:bg-white after:w-[113%] after:h-[89px] after:absolute after:content[''] after:top-[-20px] after:rounded-tl-3xl after:rounded-bl-3xl after:left-0 after:shadow-gray-800 after:shadow-lg before:bg-primary before:w-5 before:h-[194%] before:absolute before:content[''] before:top-[-20px] before:right-[-36px] before:rounded-tl-3xl before:rounded-bl-3xl  before:shadow-gray-700 before:shadow-lg"
      }  `}
      >
        <Link to="/">
          <AiOutlineHome
            className={`text-[46px] ${
              active == "home" ? "text-primary" : "text-error"
            }  mx-auto mt-10 xl:mt-[78px] lg:mt-10  xl:mb-[90px] lg:mb-10 cursor-pointer`}
          />
        </Link>
      </div>
      <div
        className={`relative z-[1] after:z-[-1]  xl:after:w-[132%] lg:after:w-[104%] sm:after:w-[111%]  md:after:w-[105%] 
      ${
        active == "msg" &&
        "after:bg-white after:w-[113%] after:h-[89px] after:absolute after:content[''] after:top-[-20px] after:rounded-tl-3xl after:rounded-bl-3xl after:left-0 after:shadow-gray-800 after:shadow-lg before:bg-primary before:w-5 before:h-[194%] before:absolute before:content[''] before:top-[-20px] before:right-[-36px] before:rounded-tl-3xl before:rounded-bl-3xl  before:shadow-gray-700 before:shadow-lg"
      }  `}
      >
        <Link to="/message">
          <TbMessageCircle
            className={`text-[46px] ${
              active == "msg" ? "text-primary" : "text-error"
            }  mx-auto mt-10 xl:mt-[78px] lg:mt-10  xl:mb-[90px] lg:mb-10 cursor-pointer`}
          />
        </Link>
      </div>
      <div className="relative z-[1] after:z-[-1] md2:after:w-[106%] md3:after:w-[106%]  after:bg-none picchi:after:w-[111%] md:after:w-[105%] after:w-[113%] lg:after:w-[165%] after:h-[89px] after:absolute after:content[''] after:top-[-20px] after:rounded-tl-3xl after:rounded-bl-3xl after:left-0 after:shadow-none-700 after:shadow-none before:bg-none before:w-5 before:h-[194%] before:absolute before:content[''] before:top-[-20px] before:right-[-36px] before:rounded-tl-3xl before:rounded-bl-3xl  before:shadow-none-700 before:shadow-none">
        <MdOutlineNotificationsNone className="text-[46px] text-error mx-auto mt-12  xl:mt-[78px] lg:mt-16  xl:mb-[90px] lg:mb-16 cursor-pointer" />
      </div>
      <div className="relative z-[1] after:z-[-1] after:bg-none md3:after:w-[106%]  md2:after:w-[106%] picchi:after:w-[111%] md:after:w-[105%] after:w-[113%] lg:after:w-[165%] after:h-[89px] after:absolute after:content[''] after:top-[-20px] after:rounded-tl-3xl after:rounded-bl-3xl after:left-0 after:shadow-none-700 after:shadow-none before:bg-none before:w-5 before:h-[194%] before:absolute before:content[''] before:top-[-20px] before:right-[-36px] before:rounded-tl-3xl before:rounded-bl-3xl  before:shadow-none-700 before:shadow-none">
        <FiSettings className="text-[46px] text-error mx-auto mt-12 xl:mt-[78px] lg:mt-16  xl:mb-[90px] lg:mb-16 cursor-grab" />
      </div>
      <div className="relative z-[1] after:z-[-1] after:bg-none md3:after:w-[106%]   xl:after:w-[132%] lg:after:w-[165%] sm:after:w-[111%]  md:after:w-[105%] after:h-[89px] after:absolute after:content[''] after:top-[-20px] after:rounded-tl-3xl after:rounded-bl-3xl after:left-0 after:shadow-none-700 after:shadow-none before:bg-none before:w-5 before:h-[194%] before:absolute before:content[''] before:top-[-20px] before:right-[-36px] before:rounded-tl-3xl before:rounded-bl-3xl  before:shadow-none-700 before:shadow-none">
        <HiOutlineLogout
          onClick={handleExit}
          className="text-[46px] text-error mx-auto mt-[60px] cursor-alias"
        />
      </div>

      {imageUploadModal && (
        <div className="bg-primary w-full z-50 h-screen absolute top-0 left-0 flex justify-center items-center">
          <div className="bg-white w-2/4  rounded-lg p-4">
            <h2 className="font-nunito text-3xl font-bold ">
              Upload Your Profile
            </h2>
            <input
              className="mt-8"
              type="file"
              onChange={handleProfileUpload}
            />
            <br />
            <div className=" w-28 h-28 rounded-full mx-auto overflow-hidden mb-8">
              <div className="img-preview  w-28 h-28 rounded-full ">
                <img src={data.photoURL} className="w-28 h-28 rounded-full" />
              </div>
            </div>
            {image && (
              <Cropper
                style={{ height: 400, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />
            )}

            {uploader ? (
              <div className="flex justify-center text-4xl mt-3">
                <CircleLoader color="#505050" />
              </div>
            ) : (
              <>
                {}
                <div className="flex justify-center">
                  {/* <BounceLoader color="#36d7b7" /> */}
                </div>
                <button
                  onClick={getCropData}
                  className="bg-primary px-8  text-white py-4 rounded-lg shadow-md shadow-black mt-8 font-semibold font-nunito text-lg"
                >
                  Upload
                </button>
                <button
                  onClick={handleImageModalCancel}
                  className="bg-error ml-8 px-8 text-white py-4 rounded-lg shadow-md shadow-black mt-8 font-semibold font-nunito text-lg"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
