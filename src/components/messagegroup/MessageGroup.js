import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector, useDispatch } from "react-redux";
import { activeChat } from "../../slices/activeChatSlice";

const MessageGroup = () => {
  let [userdetails, setUserdetails] = useState([]);
  const db = getDatabase();
  let dispatch = useDispatch();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let [grouplist, setGrouplist] = useState([]);

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        array.push({ ...item.val(), key: item.key });
      });
      setGrouplist(array);
    });
  }, []);

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

  let handActiveGroup = (item) => {
    console.log(item);
    dispatch(
      activeChat({
        status: "group",
        id: item.key,
        name: item.group_name,
        adminid: item.admin_id,
      })
    );
  };

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
              <div
                onClick={() => handActiveGroup(gitem)}
                className="xl:flex mt-5 border-b-2 border-solid border-primary pb-3.5"
              >
                <div className="inline-block lg:block ml-[37px] lg:ml-0 w-[15%]">
                  <img src="images/group.png" className="w-full" />
                </div>

                <div className="pl-3.5 w-[75%]">
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
                <div key={index} className="flex items-center relative w-[25%]">
                  <button className="bg-primary w-full  text-white  font-nunito font-bold  py-1 rounded">
                    Message
                  </button>
                </div>
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

      <div>
        <Group />
      </div>
    </div>
  );
};

export default MessageGroup;
