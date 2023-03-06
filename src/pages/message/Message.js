import React from "react";
import Chat from "../../components/chat/Chat";
import Friends from "../../components/friends/Friends";
import MessageGroup from "../../components/messagegroup/MessageGroup";
import Searchbar from "../../components/searchbar/Searchbar";
import Sidebar from "../../components/sidebar/Sidebar";

const Message = () => {
  return (
    <div className="xl:flex px-2 xl:gap-x-11">
      <div className="xl:w-[186px] w-full">
        <Sidebar active="msg" />
      </div>
      <div className="xl:w-[520px] w-full">
        <Searchbar />
        <MessageGroup />
        <div className="mt-10">
          <Friends />
        </div>
      </div>
      <div className="xl:w-[1100px] w-full">
        <Chat />
      </div>
    </div>
  );
};

export default Message;
