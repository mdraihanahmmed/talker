import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const Userlist = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let [userdetails, setUserdetails] = useState([]);
  let [sendrequestlist, setSendrequestlist] = useState([]);
  let [freindlist, setFriendlist] = useState([]);
  let [blocklist, setBlocklist] = useState([]);
  let [filteruserlist, setFilterUserList] = useState([]);

  let handleSendRequest = (item) => {
    console.log(item);
    const db = getDatabase();
    set(push(ref(db, "Requests")), {
      sender_name: data.displayName,
      sender_id: data.uid,
      sender_email: data.email,
      receiver_name: item.username,
      receiver_id: item.user_id,
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
    const sendRequestRef = ref(db, "Requests");
    onValue(sendRequestRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        array.push(item.val().receiver_id + item.val().sender_id);
      });
      setSendrequestlist(array);
    });
  }, []);

  useEffect(() => {
    const friendsRef = ref(db, "friends");
    onValue(friendsRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        array.push(item.val().receiver_id + item.val().sender_id);
      });
      setFriendlist(array);
    });
  }, []);

  useEffect(() => {
    const blockRef = ref(db, "block");
    onValue(blockRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        console.log("sdfsdf ", item.val());
        array.push(item.val().block_id + item.val().block_by_id);
      });
      setBlocklist(array);
    });
    
  }, []);

  let handleSearch = (e) => {
    let array = [];
    if (e.target.value.length == 0) {
      setFilterUserList([]);
    } else {
      userdetails.filter((item) => {
        if (
          item.username.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          array.push(item);
        }
        setFilterUserList(array);
      });
    }
  };

  let Group = () => {
    return (
      <div>
        {filteruserlist.length > 0
          ? filteruserlist.map((item, index) => (
              <div
                key={index}
                className="xl:flex mt-5 border-b-2 border-solid border-primary pb-3.5"
              >
                <div className="inline-block w-[15%] lg:block ml-[37px] lg:ml-0">
                  <img src="images/group.png" className="w-full" />
                </div>
                <div className="pl-3.5 w-[70%]">
                  <h3 className="font-nunito font-bold w-full lg:text-xl lg:pt-3.5">
                    {item.username}
                  </h3>
                  <p className="font-nunito font-medium text-sm  text-[#4D4D4D]">
                    {item.user_id}
                  </p>
                </div>
                <div className="flex items-center relative w-[15%]">
                  {blocklist.includes(item.user_id + data.uid) ||
                  blocklist.includes(data.uid + item.user_id) ? (
                    <button className="bg-primary w-full  text-white font-nunito text-sm font-bold py-2  rounded">
                      Blocked
                    </button>
                  ) : freindlist.includes(item.user_id + data.uid) ||
                    freindlist.includes(data.uid + item.user_id) ? (
                    <button className="bg-primary w-full  text-white font-nunito text-sm font-bold py-2  rounded">
                      Friend
                    </button>
                  ) : sendrequestlist.includes(item.user_id + data.uid) ||
                    sendrequestlist.includes(data.uid + item.user_id) ? (
                    <button className="bg-primary w-full  text-white font-nunito text-sm font-bold py-2  rounded">
                      Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(item)}
                      className="bg-primary w-full  text-white  font-nunito font-bold py-2  rounded"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))
          : userdetails.map((item, index) => (
              <div
                key={index}
                className="xl:flex mt-5 border-b-2 border-solid border-primary pb-3.5"
              >
                <div className="inline-block w-[15%] lg:block ml-[37px] lg:ml-0">
                  <img src="images/group.png" className="w-full" />
                </div>
                <div className="pl-3.5 w-[70%]">
                  <h3 className="font-nunito font-bold w-full lg:text-xl lg:pt-3.5">
                    {item.username}
                  </h3>
                  <p className="font-nunito font-medium text-sm  text-[#4D4D4D]">
                    {item.email}
                  </p>
                </div>
                <div className="flex items-center relative w-[15%]">
                  {blocklist.includes(item.user_id + data.uid) ||
                  blocklist.includes(data.uid + item.user_id) ? (
                    <button className="bg-primary w-full  text-white font-nunito text-sm font-bold py-2  rounded">
                      Blocked
                    </button>
                  ) : freindlist.includes(item.user_id + data.uid) ||
                    freindlist.includes(data.uid + item.user_id) ? (
                    <button className="bg-primary w-full  text-white font-nunito text-sm font-bold py-2  rounded">
                      Friend
                    </button>
                  ) : sendrequestlist.includes(item.user_id + data.uid) ||
                    sendrequestlist.includes(data.uid + item.user_id) ? (
                    <button className="bg-primary w-full  text-white font-nunito text-sm font-bold py-2  rounded">
                      Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(item)}
                      className="bg-primary w-full  text-white  font-nunito font-bold py-2  rounded"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-xl rounded-lg pl-3 relative  pr-5 pb-2  h-[451px] overflow-y-scroll">
      <h3 className="font-nunito font-bold text-xl pt-3.5">User List</h3>
      <input
        type="text"
        placeholder="Search"
        className="w-full shadow-lg rounded-lg p-3  outline-none"
        onChange={handleSearch}
      />
      <BsThreeDotsVertical className="absolute top-[17px] right-[22px] text-primary" />
      <div>
        <Group />
      </div>
    </div>
  );
};

export default Userlist;
