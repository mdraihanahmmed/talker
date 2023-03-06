import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Blockusers from "../../components/blockusers/Blockusers";
import Friendlist from "../../components/friendlist/Friendlist";
import Friends from "../../components/friends/Friends";
import Grouplist from "../../components/grouplist/Grouplist";
import Mygroup from "../../components/mygroup/Mygroup";
import Searchbar from "../../components/searchbar/Searchbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Userlist from "../../components/userlist/Userlist";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { userLoginInfo } from "../../slices/userSlice";
import { useDispatch } from "react-redux";

const Home = () => {
  let auth = getAuth();
  let navigate = useNavigate();
  const dispatch = useDispatch();

  let [verify, setVerify] = useState(false);

  let data = useSelector((state) => state.userLoginInfo.userInfo);

  onAuthStateChanged(auth, (user) => {
    if (user.emailVerified) {
      setVerify(true);

      dispatch(userLoginInfo(user));
      localStorage.setItem("userData", JSON.stringify(user));
    }
  });

  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="xl:flex px-2 xl:gap-x-11">
      {verify ? (
        <>
          <div className="xl:w-[186px] w-full">
            <Sidebar active="home" />
          </div>
          <div className="xl:w-[520px] w-full">
            <div className="lg:mt-5">
              <Searchbar />
            </div>
            <div className="hidden lg:block">
              <Grouplist />
              <Friendlist />
            </div>
          </div>
          <div className="xl:w-[520px] w-full">
            <div className="mb-10 lg:mb-5">
              <Friends />
            </div>
            <Mygroup />
          </div>
          <div className="xl:w-[520px] w-full">
            <div className="my-10 lg:my-0">
              <Userlist />
            </div>
            <div className="mt-5">
              <Blockusers />
            </div>
          </div>
        </>
      ) : (
        verify == undefined && (
          <div className="w-full h-screen flex justify-center items-center ">
            <h1 className="bg-primary text-white text-5xl p-10 rounded-lg font-nunito">
              please verify your email
            </h1>
          </div>
        )
      )}
    </div>
  );
};

export default Home;
