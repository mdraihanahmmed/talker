import React, { useEffect } from "react";
import { useState } from "react";
import {
  BsThreeDotsVertical,
  BsTriangleFill,
  BsCameraFill,
  BsFillEmojiSmileFill,
} from "react-icons/bs";
import { RiDeleteBin2Line } from "react-icons/ri";
import { MdSendToMobile } from "react-icons/md";
import { FaTelegramPlane } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import ModalImage from "react-modal-image";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import {
  getStorage,
  ref as sref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import moment from "moment/moment";
import { AudioRecorder } from "react-audio-voice-recorder";
import EmojiPicker from "emoji-picker-react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = () => {
  let activeChatName = useSelector((state) => state.activeChat);
  // console.log("acitve data", activeChatName);
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  const db = getDatabase();
  const storage = getStorage();

  let [msg, setMsg] = useState("");
  let [msgList, setMsgList] = useState([]);
  let [groupmsgs, setGroupmsgs] = useState([]);
  let [groupmemberslist, setGroupmemberslist] = useState([]);
  let [audiourl, setAudiourl] = useState("");
  let [blob, setBlob] = useState("");
  let [showbutton, setShowButton] = useState(true);
  let [showemoji, setShowemoji] = useState(false);

  let handleMsg = (e) => {
    setMsg(e.target.value);
  };

  let handleActiveMsg = () => {
    if (activeChatName.active.status == "single") {
      set(push(ref(db, "singlemsg")), {
        who_send_id: data.uid,
        who_send_name: data.displayName,
        who_recieve_id: activeChatName.active.id,
        who_recieve_name: activeChatName.active.name,
        msg: msg,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
      }).then(() => {
        setMsg("");
      });
    } else {
      set(push(ref(db, "groupmsg")), {
        who_send_id: data.uid,
        who_send_name: data.displayName,
        who_recieve_id: activeChatName.active.id,
        who_recieve_name: activeChatName.active.name,
        admin_id: activeChatName.active.adminid,
        msg: msg,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
      }).then(() => {
        setMsg("");
      });
    }
  };

  useEffect(() => {
    onValue(ref(db, "singlemsg"), (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        if (
          (item.val().who_send_id == data.uid &&
            item.val().who_recieve_id == activeChatName.active.id) ||
          (item.val().who_recieve_id == data.uid &&
            item.val().who_send_id == activeChatName.active.id)
        ) {
          array.push(item.val());
        }
      });
      setMsgList(array);
    });
  }, [activeChatName.active.id]);

  //group msg

  useEffect(() => {
    onValue(ref(db, "groupmsg"), (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        array.push(item.val());
      });
      setGroupmsgs(array);
    });
  }, [activeChatName.active.id]);

  let handleImgUpload = (e) => {
    console.log(e.target.files[0]);
    const storageRef = sref(storage, e.target.files[0].name);

    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          set(push(ref(db, "singlemsg")), {
            who_send_id: data.uid,
            who_send_name: data.displayName,
            who_recieve_id: activeChatName.active.id,
            who_recieve_name: activeChatName.active.name,
            img: downloadURL,
            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          });
        });
      }
    );
  };

  useEffect(() => {
    onValue(ref(db, "groupmembers"), (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        array.push(item.val().group_id + item.val().user_id);
      });
      setGroupmemberslist(array);
    });
  }, []);

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudiourl(url);
    setBlob(blob);
  };

  let handleDeleteAudio = () => {
    setAudiourl("");
    setShowButton(true);
  };

  let handleAudioUpload = () => {
    const audioStorageRef = sref(storage, audiourl);

    uploadBytes(audioStorageRef, blob).then((snapshot) => {
      getDownloadURL(audioStorageRef).then((downloadURL) => {
        console.log("File available at", downloadURL);
        set(push(ref(db, "singlemsg")), {
          who_send_id: data.uid,
          who_send_name: data.displayName,
          who_recieve_id: activeChatName.active.id,
          who_recieve_name: activeChatName.active.name,
          audio: downloadURL,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
        }).then(() => {
          setAudiourl("");
          setShowButton(true);
        });
      });
    });
  };

  let handleRemoveSendButton = () => {
    setShowButton(false);
  };

  let handleSelectEmoji = (emoji) => {
    // console.log("ami emoji", emoji.emoji);
    setMsg(msg + emoji.emoji);
  };

  let handleEnterPress = (e) => {
    if (e.key == "Enter") {
      // console.log("ami enter bolchi");
      if (activeChatName.active.status == "single") {
        set(push(ref(db, "singlemsg")), {
          who_send_id: data.uid,
          who_send_name: data.displayName,
          who_recieve_id: activeChatName.active.id,
          who_recieve_name: activeChatName.active.name,
          msg: msg,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
        }).then(() => {
          setMsg("");
        });
      } else {
        set(push(ref(db, "groupmsg")), {
          who_send_id: data.uid,
          who_send_name: data.displayName,
          who_recieve_id: activeChatName.active.id,
          who_recieve_name: activeChatName.active.name,
          admin_id: activeChatName.active.adminid,
          msg: msg,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
        }).then(() => {
          setMsg("");
        });
      }
    }
  };

  let handleLikeSend = () => {
    if (activeChatName.active.status == "single") {
      set(push(ref(db, "singlemsg")), {
        who_send_id: data.uid,
        who_send_name: data.displayName,
        who_recieve_id: activeChatName.active.id,
        who_recieve_name: activeChatName.active.name,
        msg: "&#128077;",
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
      }).then(() => {
        setMsg("");
      });
    } else {
      set(push(ref(db, "groupmsg")), {
        who_send_id: data.uid,
        who_send_name: data.displayName,
        who_recieve_id: activeChatName.active.id,
        who_recieve_name: activeChatName.active.name,
        admin_id: activeChatName.active.adminid,
        msg: "&#128077;",
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
      }).then(() => {
        setMsg("");
      });
    }
  };

  return (
    <div className="shadow-xl rounded-xl py-6 px-12  ">
      <div className="flex items-center gap-x-8 border-b border-solid border-[rgba(0,0,0,.25)] pb-6 relative mb-14">
        <div className="w-[75px] h-[75px]  rounded-full shadow-lg relative">
          <img src="images/profile.png" />
          <div className="bg-[#00FF75] w-[14px] h-[14px] shadow-md rounded-full border border-solid border-white  absolute bottom-[10px] right-0"></div>
        </div>
        <BsThreeDotsVertical className="absolute top-7 right-[13px] text-primary  text-2xl" />
        <div>
          <h1 className="font-pop text-2xl font-semibold">
            {activeChatName.active.name}
          </h1>
          <p className="font-pop text-sm font-normal">Online</p>
        </div>
      </div>

      <div>
        <ScrollToBottom className="h-[630px] border-b border-solid border-[rgba(0,0,0,.25)] pb-11">
          {activeChatName.active.status == "single" ? (
            msgList.map((item, index) => (
              <div key={index}>
                {item.who_send_id == data.uid ? (
                  item.msg && item.msg.length !== 0 ? (
                    <div className="mt-5 pr-4 text-right">
                      <div className="bg-primary inline-block text-left py-3 px-12 rounded-md relative ml-2">
                        <p
                          dangerouslySetInnerHTML={{ __html: item.msg }}
                          className="font-pop font-medium text-base text-white"
                        ></p>
                        <BsTriangleFill className="absolute bottom-[-1px] right-[-6px] text-primary" />
                      </div>
                      <div>
                        <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </div>
                    </div>
                  ) : item.img ? (
                    item.img !== undefined && (
                      <div className="mt-5 pr-4 text-right">
                        <div className="bg-primary inline-block text-left p-2 w-60  rounded-md relative ml-2">
                          <ModalImage small={item.img} large={item.img} />
                          <BsTriangleFill className="absolute bottom-[-1px] right-[-6px] text-primary" />
                        </div>
                        <div>
                          <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                          </p>
                        </div>
                      </div>
                    )
                  ) : (
                    item.audio !== undefined && (
                      <div className="mt-5 pr-4 text-right">
                        <div className=" inline-block    ">
                          <audio controls>
                            <source src={item.audio} type="audio/mpeg" />
                          </audio>
                        </div>
                        <div>
                          <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                          </p>
                        </div>
                      </div>
                    )
                  )
                ) : item.msg && item.msg.length !== 0 ? (
                  <div className="mt-5 pr-4">
                    <div className="bg-chatTwo inline-block py-3 px-12 rounded-md relative ml-2">
                      <p className="font-pop font-medium text-base">
                        {item.msg}
                      </p>
                      <BsTriangleFill className="absolute bottom-[-1px] left-[-6px] text-chatTwo" />
                    </div>
                    <div>
                      <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </p>
                    </div>
                  </div>
                ) : item.img ? (
                  item.img !== undefined && (
                    // console.log(item.img)
                    <div className="mt-5 pr-4">
                      <div className="bg-chatTwo inline-block p-2 w-60  rounded-md relative ml-2">
                        <ModalImage small={item.img} large={item.img} />

                        <BsTriangleFill className="absolute bottom-[-1px] left-[-6px] text-chatTwo" />
                      </div>
                      <div>
                        <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  item.audio !== undefined && (
                    <div className="mt-5 pr-4">
                      <div>
                        <audio controls>
                          <source src={item.audio} type="audio/mpeg" />
                        </audio>
                      </div>
                      <div>
                        <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ))
          ) : data.uid == activeChatName.active.adminid ||
            groupmemberslist.includes(activeChatName.active.id + data.uid) ? (
            // console.log(activeChatName.active.adminid)
            groupmsgs.map((item) =>
              item.who_send_id == data.uid
                ? item.who_recieve_id == activeChatName.active.id &&
                  item.msg &&
                  item.msg.length !== 0 && (
                    <div className="mt-5 pr-4 text-right">
                      <div className="bg-primary inline-block text-left py-3 px-12 rounded-md relative ml-2">
                        <p className="font-pop font-medium text-base text-white">
                          {item.msg}
                        </p>
                        <BsTriangleFill className="absolute bottom-[-1px] right-[-6px] text-primary" />
                      </div>
                      <div>
                        <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </div>
                    </div>
                  )
                : item.who_recieve_id == activeChatName.active.id &&
                  item.msg &&
                  item.msg.length !== 0 && (
                    <div className="mt-5 pr-4">
                      <div className="bg-chatTwo inline-block py-3 px-12 rounded-md relative ml-2">
                        <p className="font-pop font-medium text-base">
                          {item.msg}
                        </p>
                        <BsTriangleFill className="absolute bottom-[-1px] left-[-6px] text-chatTwo" />
                      </div>
                      <div>
                        <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </div>
                    </div>
                  )
            )
          ) : (
            <h1>you are not member in this group!</h1>
          )}
          {/* recive msg start */}
          {/* <div className="mt-5 pr-4">
            <div className="bg-chatTwo inline-block py-3 px-12 rounded-md relative ml-2">
              <p className="font-pop font-medium text-base">Hey There !</p>
              <BsTriangleFill className="absolute bottom-[-1px] left-[-6px] text-chatTwo" />
            </div>
            <div>
              <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                Today, 2:01pm
              </p>
            </div>
          </div> */}
          {/* recive msg end */}

          {/* send msg start */}
          {/* <div className="mt-5 pr-4 text-right">
            <div className="bg-primary inline-block text-left py-3 px-12 rounded-md relative ml-2">
              <p className="font-pop font-medium text-base text-white">
                Hello...
              </p>
              <BsTriangleFill className="absolute bottom-[-1px] right-[-6px] text-primary" />
            </div>
            <div>
              <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                Today, 2:01pm
              </p>
            </div>
          </div> */}
          {/* send msg end */}

          {/* recive msg start */}
          {/* <div className="mt-5 pr-4">
            <div className="bg-chatTwo inline-block p-2 w-60  rounded-md relative ml-2">
              <ModalImage small="images/login.png" large="images/login.png" />

              <BsTriangleFill className="absolute bottom-[-1px] left-[-6px] text-chatTwo" />
            </div>
            <div>
              <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                Today, 2:01pm
              </p>
            </div>
          </div> */}
          {/* recive msg end */}

          {/* send msg start */}
          {/* <div className="mt-5 pr-4 text-right">
            <div className="bg-primary inline-block text-left p-2 w-60  rounded-md relative ml-2">
              <ModalImage
                small="images/registration.png"
                large="images/registration.png"
              />
              <BsTriangleFill className="absolute bottom-[-1px] right-[-6px] text-primary" />
            </div>
            <div>
              <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                Today, 2:01pm
              </p>
            </div>
          </div> */}
          {/* send msg end */}
          {/* recive msg start */}
          {/* <div className="mt-5 pr-4">
            <div>
              <audio controls>
                <source src="horse.ogg" type="audio/ogg" />
                <source src="horse.mp3" type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
            <div>
              <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                Today, 2:01pm
              </p>
            </div>
          </div> */}
          {/* recive msg end */}
          {/* send msg start */}
          {/* <div className="mt-5 pr-4 text-right">
            <div className=" inline-block    ">
              <audio controls>
                <source src="horse.ogg" type="audio/ogg" />
                <source src="horse.mp3" type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
            <div>
              <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                Today, 2:01pm
              </p>
            </div>
          </div> */}
          {/* send msg end */}
          {/* recive msg start */}
          {/* <div className="mt-5 ">
            <div>
              <video width="320" height="240" controls>
                <source src="movie.mp4" type="video/mp4" />
                <source src="movie.ogg" type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div>
              <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ">
                Today, 2:01pm
              </p>
            </div>
          </div> */}
          {/* recive msg end */}
          {/* send msg start */}
          {/* <div className="mt-5 pr-4 text-right">
            <div className=" inline-block    ">
              <video width="320" height="240" controls>
                <source src="movie.mp4" type="video/mp4" />
                <source src="movie.ogg" type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div>
              <p className="font-pop text-[12px] font-medium text-[rgba(0,0,0,.25)] mt-2 mb-6 ml-1">
                Today, 2:01pm
              </p>
            </div>
          </div> */}
          {/* send msg end */}
        </ScrollToBottom>
        <div>
          {
            activeChatName.active.status == "single" ? (
              <div className="pt-8 flex">
                <div className="w-[93%] relative">
                  {!audiourl && (
                    <>
                      <input
                        onChange={handleMsg}
                        onKeyUp={handleEnterPress}
                        type="text"
                        value={msg}
                        className="bg-chatTwo w-full rounded-lg p-4"
                      />
                      <label>
                        <input
                          onClick={handleImgUpload}
                          type="file"
                          className="hidden"
                        />
                        <GrGallery className="absolute top-4 right-4 text-lg" />
                      </label>
                      <BsCameraFill className="absolute top-4 right-12 text-xl" />

                      <BsFillEmojiSmileFill
                        onClick={() => setShowemoji(!showemoji)}
                        className="absolute top-[19px] right-[81px] cursor-pointer"
                      />
                      {showemoji && (
                        <div className="absolute top-[-490px] right-0">
                          <EmojiPicker
                            onEmojiClick={(emoji) => handleSelectEmoji(emoji)}
                          />
                        </div>
                      )}
                      <div onClick={handleRemoveSendButton}>
                        <AudioRecorder
                          onRecordingComplete={(blob) => addAudioElement(blob)}
                        />
                      </div>
                    </>
                  )}
                  {audiourl && (
                    <div className="flex gap-x-3 ml-60">
                      <audio controls src={audiourl}></audio>
                      <button onClick={handleDeleteAudio}>
                        <RiDeleteBin2Line className="text-[40px] text-white bg-primary p-2 rounded-lg" />
                      </button>
                      <button onClick={handleAudioUpload}>
                        <MdSendToMobile className="text-[40px] text-white bg-primary p-2 rounded-lg" />
                      </button>
                    </div>
                  )}
                </div>
                {!audiourl && showbutton && (
                  <div
                    onClick={handleActiveMsg}
                    className="bg-primary text-white inline-block p-4 rounded-xl ml-5"
                  >
                    {msg ? (
                      <button>
                        <FaTelegramPlane className="text-lg" />
                      </button>
                    ) : (
                      <button onClick={handleLikeSend}>&#128077;</button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              data.uid == activeChatName.active.adminid ||
              (groupmemberslist.includes(
                activeChatName.active.id + data.uid
              ) && (
                <div className="pt-8 flex">
                  <div className="w-[93%] relative">
                    {!audiourl && (
                      <>
                        <input
                          onChange={handleMsg}
                          onKeyUp={handleEnterPress}
                          type="text"
                          value={msg}
                          className="bg-chatTwo w-full rounded-lg p-4"
                        />
                        <label>
                          <input
                            onClick={handleImgUpload}
                            type="file"
                            className="hidden"
                          />
                          <GrGallery className="absolute top-4 right-4 text-lg" />
                        </label>
                        <BsCameraFill className="absolute top-4 right-12 text-xl" />

                        <BsFillEmojiSmileFill
                          onClick={() => setShowemoji(!showemoji)}
                          className="absolute top-[19px] right-[81px] cursor-pointer"
                        />
                        {showemoji && (
                          <div className="absolute top-[-490px] right-0">
                            <EmojiPicker
                              onEmojiClick={(emoji) => handleSelectEmoji(emoji)}
                            />
                          </div>
                        )}
                        <div onClick={handleRemoveSendButton}>
                          <AudioRecorder
                            onRecordingComplete={(blob) =>
                              addAudioElement(blob)
                            }
                          />
                        </div>
                      </>
                    )}
                    {audiourl && (
                      <div className="flex gap-x-3 ml-60">
                        <audio controls src={audiourl}></audio>
                        <button onClick={handleDeleteAudio}>
                          <RiDeleteBin2Line className="text-[40px] text-white bg-primary p-2 rounded-lg" />
                        </button>
                        <button onClick={handleAudioUpload}>
                          <MdSendToMobile className="text-[40px] text-white bg-primary p-2 rounded-lg" />
                        </button>
                      </div>
                    )}
                  </div>
                  {!audiourl && showbutton && (
                    <div
                      onClick={handleActiveMsg}
                      className="bg-primary text-white inline-block p-4 rounded-xl ml-5"
                    >
                      {msg ? (
                        <button>
                          <FaTelegramPlane className="text-lg" />
                        </button>
                      ) : (
                        <button onClick={handleLikeSend}>&#128077;</button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )
            // console.log(activeChatName.active.id + data.uid)
          }
        </div>
      </div>
    </div>
  );
};

export default Chat;
