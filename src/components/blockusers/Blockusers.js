import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";

const Blockusers = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  let [blocklist, setBlocklist] = useState([]);

  useEffect(() => {
    const blockRef = ref(db, "block");
    onValue(blockRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        if (item.val().block_by_id == data.uid) {
          array.push({
            id: item.key,
            block: item.val().block,
            block_id: item.val().block_id,
          });
        } else {
          array.push({
            id: item.key,
            block_by_id: item.val().block_by_id,
            block_by: item.val().block_by,
          });
        }
      });
      setBlocklist(array);
    });
  }, []);

  let handleUnblock = (item) => {
    set(push(ref(db, "friends")), {
      sender_name: item.block,
      sender_id: item.block_id,
      receiver_name: data.displayName,
      receiver_id: data.uid,
    }).then(() => {
      remove(ref(db, "block/" + item.id));
    });
  };

  let Group = () => {
    return (
      <div>
        {blocklist.length == 0 ? (
          <p className="bg-error text-white font-semibold mt-5 p-2.5 rounded-md shadow-md">
            No Block User Available!
          </p>
        ) : (
          blocklist.map((item, index) => (
            <div key={index}>
              <div className="xl:flex mt-5  border-b-2 border-solid border-primary pb-3.5">
                <div className="inline-block lg:block ml-[37px] lg:ml-0 w-[15%]">
                  <img src="images/group.png" className="w-full" />
                </div>
                <div className="pl-3.5 w-[60%]">
                  <h3 className="font-nunito w-full font-bold lg:text-xl lg:pt-3.5">
                    {item.block}
                  </h3>
                  <h3 className="font-nunito w-full font-bold lg:text-xl lg:pt-3.5">
                    {item.block_by}
                  </h3>
                  <p className="font-nunito font-medium text-sm  text-[#4D4D4D]">
                    Hi Guys, Wassup!
                  </p>
                </div>
                <div className="flex items-center  ml-5 w-[20%]">
                  {!item.block_by_id && (
                    <button
                      onClick={() => handleUnblock(item)}
                      className="bg-primary w-full   text-white  font-nunito font-bold py-2 rounded"
                    >
                      Unblock
                    </button>
                  )}
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
      <h3 className="font-nunito font-bold text-xl pt-3.5">Block Users</h3>
      <BsThreeDotsVertical className="absolute top-[17px] right-[22px] text-primary" />
      <div>
        <Group />
      </div>
    </div>
  );
};

export default Blockusers;
