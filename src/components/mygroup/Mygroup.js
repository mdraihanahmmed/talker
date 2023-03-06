import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical, BsInfoCircle } from "react-icons/bs";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";
import { useSelector } from "react-redux";

const Mygroup = () => {
  const db = getDatabase();

  let [grouplist, setGrouplist] = useState([]);
  let [groupreqlist, setGroupReqlist] = useState([]);
  let [groupmembers, setGroupmembers] = useState([]);
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let [show, setShow] = useState(false);
  let [showgroupmembers, setShowGroupmembers] = useState(false);

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().admin_id) {
          array.push({ ...item.val(), key: item.key });
        }
      });
      setGrouplist(array);
    });
  }, []);

  let handleDelete = (item) => {
    remove(ref(db, "group/" + item.key));
  };
  let handleReject = (item) => {
    remove(ref(db, "groupjoinrequest/" + item.key));
  };

  let handleGroupReqList = (gitem) => {
    setShow(true);
    const groupRef = ref(db, "groupjoinrequest");
    onValue(groupRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        if (
          data.uid == item.val().admin_id &&
          item.val().group_id == gitem.key
        ) {
          array.push({ ...item.val(), key: item.key });
        }
      });
      setGroupReqlist(array);
    });
  };

  let handleGroupmembersaccept = (item) => {
    set(push(ref(db, "groupmembers")), {
      admin_id: item.admin_id,
      group_id: item.group_id,
      user_id: item.user_ID,
      admin_name: item.admin_name,
      group_name: item.group_name,
      user_name: item.user_name,
    }).then(() => {
      remove(ref(db, "groupjoinrequest/" + item.key));
    });
  };

  let handleGroupmembers = (itemg) => {
    const groupRef = ref(db, "groupmembers");
    onValue(groupRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        if (data.uid == itemg.admin_id && itemg.key == item.val().group_id) {
          array.push({ ...item.val(), key: item.key });
        }
      });
      setGroupmembers(array);
      setShowGroupmembers(true);
    });
  };

  let handleRemovemember = (item) => {
    remove(ref(db, "groupmembers/" + item.key));
  };

  let Group = () => {
    return (
      <div>
        {grouplist.length == 0 ? (
          <p className="bg-error text-white font-semibold mt-5 p-2.5 rounded-md shadow-md">
            No Group Available!
          </p>
        ) : show ? (
          groupreqlist.length == 0 ? (
            <p className="bg-error text-white font-semibold mt-6 p-2.5 rounded-md shadow-md">
              No Request Available!
            </p>
          ) : (
            groupreqlist.map((item, index) => (
              <div key={index}>
                <div className="xl:flex mt-5 border-b-2 border-solid border-primary pb-3.5">
                  <div className="inline-block lg:block ml-[37px] lg:ml-0 w-[15%]">
                    <img src="images/group.png" className="w-full" />
                  </div>

                  <div className="pl-3.5 w-[70%]">
                    <h3 className="font-nunito w-full font-bold lg:text-xl lg:pt-3.5">
                      {item.user_name}
                    </h3>
                  </div>
                  <div className="flex items-center relative w-[40%]">
                    <button
                      onClick={() => handleGroupmembersaccept(item)}
                      className=" bg-primary  mr-2.5 text-white font-nunito font-bold py-1 px-2 rounded"
                    >
                      <p>Accept</p>
                    </button>
                    <button
                      onClick={() => handleReject(item)}
                      className=" bg-error mr-2.5  text-white  font-nunito font-bold py-1 px-2 rounded"
                    >
                      <p>Reject</p>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        ) : showgroupmembers ? (
          groupmembers.length == 0 ? (
            <p className="bg-error text-white font-semibold mt-6 p-2.5 rounded-md shadow-md">
              No Group Member Available!
            </p>
          ) : (
            groupmembers.map((item, index) => (
              <div key={index}>
                <div className="mt-2 ">
                  <h3 className="font-nunito w-full font-bold underline  underline-offset-2">
                    Group Members
                  </h3>
                </div>
                <div className="xl:flex mt-5 border-b-2 border-solid border-primary pb-3.5">
                  <div className="inline-block lg:block ml-[37px] lg:ml-0 w-[15%]">
                    <img src="images/group.png" className="w-full" />
                  </div>

                  <div className="pl-3.5 w-[70%]">
                    <h3 className="font-nunito w-full font-bold lg:text-xl lg:pt-3.5">
                      {item.user_name}
                    </h3>
                  </div>
                  <div className="flex items-center relative w-[40%]">
                    <button
                      onClick={() => handleRemovemember(item)}
                      className=" bg-error mr-2.5 ml-16 text-white  font-nunito font-bold py-1 px-2 rounded"
                    >
                      <p>Remove</p>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          grouplist.map((item, index) => (
            <div key={index}>
              <div className="xl:flex mt-5 border-b-2 border-solid border-primary pb-3.5">
                <div className="inline-block lg:block ml-[37px] lg:ml-0 w-[15%]">
                  <img src="images/group.png" className="w-full" />
                </div>

                <div className="pl-3.5 w-[70%]">
                  <p className="font-nunito font-medium text-sm mb-[-10px] text-[#4D4D4D]">
                    Admin: {item.admin_name}
                  </p>
                  <h3 className="font-nunito w-full font-bold lg:text-xl lg:pt-3.5">
                    {item.group_name}
                  </h3>
                  <p className="font-nunito font-medium text-sm  text-[#4D4D4D]">
                    {item.group_tag_line}
                  </p>
                </div>
                <div className="flex items-center relative w-[40%]">
                  <button
                    onClick={() => handleDelete(item)}
                    className="bg-error   mr-2.5 text-white font-nunito font-bold p-3 rounded"
                  >
                    <RiDeleteBin5Fill className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleGroupmembers(item)}
                    className="bg-primary  mr-2.5  text-white  font-nunito font-bold p-3 rounded"
                  >
                    <BsInfoCircle className="text-lg" />
                  </button>
                  <button className="bg-primary   text-white  font-nunito font-bold p-3 rounded">
                    <VscGitPullRequestCreate
                      onClick={() => handleGroupReqList(item)}
                      className="text-lg"
                    />
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
      <h3 className="font-nunito font-bold text-xl pt-3.5">My Groups</h3>
      {show && (
        <button
          onClick={() => setShow(false)}
          className="bg-primary  mr-2.5  text-white py-2 font-nunito font-bold  rounded absolute top-[17px] right-[22px] "
        >
          <p className="px-3">Cancel</p>
        </button>
      )}
      {showgroupmembers && (
        <button
          onClick={() => setShowGroupmembers(false)}
          className="bg-primary  mr-2.5  text-white py-2 font-nunito font-bold  rounded absolute top-[17px] right-[22px] "
        >
          <p className="px-3">Cancel</p>
        </button>
      )}
      <div>
        <Group />
      </div>
    </div>
  );
};

export default Mygroup;
