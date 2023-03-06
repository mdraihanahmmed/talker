import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";

let Friends = () => {
  const db = getDatabase();

  let data = useSelector((state) => state.userLoginInfo.userInfo);
  let [sendrequest, setSendrequest] = useState([]);

  useEffect(() => {
    const sendRequestRef = ref(db, "Requests");
    onValue(sendRequestRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        if (item.val().receiver_id == data.uid) {
          array.push({
            ...item.val(),
            id: item.key,
          });
        }
        console.log("all data", item.val().id);
      });
      setSendrequest(array);
    });
  }, []);

  let handleAcceptRequest = (item) => {
    console.log(item);
    set(push(ref(db, "friends")), {
      ...item,
    }).then(() => {
      remove(ref(db, "Requests/" + item.id));
    });
  };

  return (
    <div>
      {sendrequest.length == 0 ? (
        <p className="bg-error text-white font-semibold mt-5 p-2.5 rounded-md shadow-md">
          No Friend Request Available!
        </p>
      ) : (
        sendrequest.map((item) => (
          <div className="flex mt-5 border-b-2 border-solid border-primary pb-3.5">
            <div className="w-[15%]">
              <img src="images/group.png" className="w-full" />
            </div>
            <div className="pl-3.5 w-[60%]">
              <h3 className="font-nunito w-full font-bold text-xl pt-3.5">
                {item.sender_name}
              </h3>
              <p className="font-nunito font-medium text-sm text-[#4D4D4D]">
                {item.sender_email}
              </p>
            </div>
            <div className="flex items-center relative w-[25%]">
              <button
                onClick={() => handleAcceptRequest(item)}
                className="bg-primary w-full  text-white px-8 xl:px-6 font-nunito font-bold py-2 xl:py-1 rounded"
              >
                Accept
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const Friendlist = () => {
  return (
    <div className="bg-white pl-3 pr-5 relative mt-11  pb-2  h-[347px] overflow-y-scroll">
      <h3 className="font-nunito font-bold text-xl pt-3.5">Friend Request</h3>
      <BsThreeDotsVertical className="absolute top-[17px] right-[22px] text-primary" />
      <div>
        <Friends />
      </div>
    </div>
  );
};

export default Friendlist;
