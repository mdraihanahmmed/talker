import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
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

const Friends = () => {
  const db = getDatabase();
  let dispatch = useDispatch();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let [friends, setFriends] = useState([]);

  useEffect(() => {
    const friendsRef = ref(db, "friends");
    onValue(friendsRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        if (
          data.uid == item.val().receiver_id ||
          data.uid == item.val().sender_id
        ) {
          array.push({ ...item.val(), key: item.key });
        }
      });
      setFriends(array);
    });
  }, []);

  let handleBlock = (item) => {
    if (data.uid == item.sender_id) {
      set(push(ref(db, "block")), {
        block: item.receiver_name,
        block_id: item.receiver_id,
        block_by: item.sender_name,
        block_by_id: item.sender_id,
      }).then(() => {
        remove(ref(db, "friends/" + item.key));
      });
    } else {
      set(push(ref(db, "block")), {
        block: item.sender_name,
        block_id: item.sender_id,
        block_by: item.receiver_name,
        block_by_id: item.receiver_id,
      }).then(() => {
        remove(ref(db, "friends/" + item.key));
      });
    }
  };

  let handleActveSingle = (item) => {
    if (item.receiver_id == data.uid) {
      dispatch(
        activeChat({
          status: "single",
          id: item.sender_id,
          name: item.sender_name,
        })
      );
      localStorage.setItem(
        "activeChat",
        JSON.stringify({
          status: "single",
          id: item.sender_id,
          name: item.sender_name,
        })
      );
    } else {
      dispatch(
        activeChat({
          status: "single",
          id: item.receiver_id,
          name: item.receiver_name,
        })
      );
      localStorage.setItem(
        "activeChat",
        JSON.stringify({
          status: "single",
          id: item.receiver_id,
          name: item.receiver_name,
        })
      );
    }
  };

  let Group = () => {
    return (
      <div>
        {friends.length == 0 ? (
          <p className="bg-error text-white font-semibold mt-5 p-2.5 rounded-md shadow-md">
            No Friend Available!
          </p>
        ) : (
          friends.map((item, index) => (
            <div key={index}>
              <div
                onClick={() => handleActveSingle(item)}
                className="xl:flex mt-5  border-b-2 border-solid border-primary pb-3.5"
              >
                <div className="inline-block lg:block ml-[37px] lg:ml-0 w-[15%]">
                  <img src="images/group.png" className="w-full" />
                </div>
                <div className="pl-3.5 w-[70%]">
                  <h3 className="font-nunito w-full font-bold lg:text-xl lg:pt-3.5">
                    {data.uid == item.sender_id
                      ? item.receiver_name
                      : item.sender_name}
                  </h3>
                  <p className="font-nunito font-medium text-sm  text-[#4D4D4D]">
                    Hi Guys, Wassup!
                  </p>
                </div>
                <div className="flex items-center relative w-[15%]">
                  <button
                    onClick={() => handleBlock(item)}
                    className="bg-primary w-full   text-white p-2  font-nunito font-bold  rounded"
                  >
                    Block
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
    <div className="bg-white shadow-xl rounded-lg pl-3 relative  pr-5 pb-2  h-[451px] overflow-y-scroll">
      <h3 className="font-nunito font-bold text-xl pt-3.5">Friends</h3>
      <BsThreeDotsVertical className="absolute top-[17px] right-[22px] text-primary" />
      <div>
        <Group />
      </div>
    </div>
  );
};

export default Friends;
