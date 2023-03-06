import React, { useState, useEffect } from "react";
import RingLoader from "react-spinners/RingLoader";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";

const Grouplist = () => {
  let [show, setShow] = useState(false);
  let [loader, setLoader] = useState(false);
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let [grouplist, setGrouplist] = useState([]);
  let [groupjoinlist, setGroupJoinlist] = useState([]);
  let [userdetails, setUserdetails] = useState([]);

  let handleGroupButton = () => {
    setShow(!show);
  };

  let [info, setInfo] = useState({ group_name: "", group_tag_line: "" });
  let { group_name, group_tag_line } = info;

  let [infoerr, setInfoerr] = useState({
    group_nameerr: "",
    group_tag_lineerr: "",
  });
  let { group_nameerr, group_tag_lineerr } = infoerr;

  let handleChange = (e) => {
    let { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // let filed_name = e.target.name;
    // setInfo({ ...info, [e.target.name]: e.target.value });

    if (name === "group_name") {
      setInfoerr({ group_nameerr: "", group_tag_lineerr });
    }
    if (name === "group_tag_line") {
      setInfoerr({ group_nameerr, group_tag_lineerr: "" });
    }
    setLoader(false);
  };

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        if (data.uid !== item.val().admin_id) {
          array.push({ ...item.val(), key: item.key });
        }
      });
      setGrouplist(array);
    });
  }, []);

  let handleCreate = () => {
    setInfoerr({
      group_nameerr: !group_name && "please give a group name!",
      group_tag_lineerr: !group_tag_line && "please give a group tag line!",
    });

    if (group_name && group_tag_line) {
      setLoader(true);
      set(push(ref(db, "group")), {
        group_name: group_name,
        group_tag_line: group_tag_line,
        admin_id: data.uid,
        admin_name: data.displayName,
      }).then(() => {
        setShow(false);
        setLoader(false);
        setInfo({
          group_name: "",
          group_tag_line: "",
        });
      });
    }
  };

  let handleGroupJoin = (item) => {
    console.log(item);
    set(push(ref(db, "groupjoinrequest")), {
      group_id: item.key,
      group_name: item.group_name,
      group_tag_line: item.group_tag_line,
      admin_id: item.admin_id,
      admin_name: item.admin_name,
      user_name: data.displayName,
      user_ID: data.uid,
    });
  };

  useEffect(() => {
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        if (data.uid != item.key) {
          array.push({ ...item.val(), user_id: item.key });
        }
      });
      setUserdetails(array);
    });
  }, []);

  useEffect(() => {
    const groupRef = ref(db, "groupjoinrequest");
    onValue(groupRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        console.log(item.val());
        array.push(item.val().admin_id + item.val().key);
      });
      setGroupJoinlist(array);
    });
  }, []);

  let Group = () => {
    return (
      <div>
        {grouplist.length == 0 ? (
          <p className="bg-error text-white font-semibold mt-5 p-2.5 rounded-md shadow-md">
            No Group List Available!
          </p>
        ) : (
          grouplist.map((gitem, index) => (
            <div key={index}>
              <div className="xl:flex mt-5 border-b-2 border-solid border-primary pb-3.5">
                <div className="inline-block lg:block ml-[37px] lg:ml-0 w-[15%]">
                  <img src="images/group.png" className="w-full" />
                </div>

                <div className="pl-3.5 w-[70%]">
                  <p className="font-nunito font-medium text-sm mb-[-10px] text-[#4D4D4D]">
                    Admin: {gitem.admin_name}
                  </p>
                  <h3 className="font-nunito w-full font-bold lg:text-xl lg:pt-3.5">
                    {gitem.group_name}
                  </h3>
                  <p className="font-nunito font-medium text-sm  text-[#4D4D4D]">
                    {gitem.group_tag_line}
                  </p>
                </div>
                {/* {userdetails.map((item, index) => ( */}
                <div key={index} className="flex items-center relative w-[15%]">
                  {/* {groupjoinlist.includes(item.user_id + data.uid) ||
                    groupjoinlist.includes(data.uid + item.user_id) ? ( */}
                  {/* <button className="bg-primary w-full  text-white font-nunito text-sm font-bold py-2  rounded">
                    Pending
                  </button> */}
                  {/* ) : ( */}
                  <button
                    onClick={() => handleGroupJoin(gitem)}
                    className="bg-primary w-full  text-white  font-nunito font-bold  py-1 rounded"
                  >
                    Join
                  </button>
                  {/* )} */}
                </div>
                {/* // ))} */}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-xl rounded-lg pl-3 relative  pr-5 pb-2   h-[347px] overflow-y-scroll">
      <h3 className="font-nunito font-bold text-xl pt-3.5">Group List</h3>
      <div className="  text-primary flex items-center relative w-[30%] ">
        <button
          onClick={handleGroupButton}
          className=" text-lg shadow-xl bg-primary w-full absolute  text-white px-2.5 top-[-30px] right-[-330px]  font-nunito  py-0.5  rounded"
        >
          {show ? "Cancel" : "Create Group"}
        </button>
      </div>
      {show ? (
        <div className="mt-5">
          <div className="mb-5">
            <input
              name="group_name"
              type="text"
              className="border outline-none border-solid mb-2 w-full border-secondary p-3  rounded"
              placeholder="Group Name"
              onChange={handleChange}
            />
            {group_nameerr && (
              <p className="bg-error text-xl  anim shadow-lg shadow-red-200 text-center font-semibold text-white rounded-lg w-full p-1 ">
                {group_nameerr}
              </p>
            )}
          </div>
          <div>
            <input
              name="group_tag_line"
              type="text"
              className="border outline-none border-solid mb-2 w-full border-secondary p-3  rounded"
              placeholder="Group Tag Line"
              onChange={handleChange}
            />
            {group_tag_lineerr && (
              <p className="bg-error text-xl  anim shadow-lg shadow-red-200 text-center font-semibold text-white rounded-lg w-full p-1">
                {group_tag_lineerr}
              </p>
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
              onClick={handleCreate}
              className="bg-primary w-full text-lg text-white px-8  font-nunito font-bold py-1  rounded mt-5"
            >
              Create
            </button>
          )}
        </div>
      ) : (
        <div>
          <Group />
        </div>
      )}
    </div>
  );
};

export default Grouplist;
