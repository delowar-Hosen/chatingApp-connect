import React from "react";
import Chat from "../../sections/Chat";
import Joingrouplist from "../../sections/Joingrouplist";
import Sidebar from "../../sections/Sidebar";

const Message = () => {
  return (
    <div className="flex m-auto">
      <div className="w-[186px] ">
        <Sidebar active="message" />
      </div>
      <div className="w-[427px] ">
        <Joingrouplist />
      </div>
      <div className="w-[688px]">
        <Chat />
      </div>
    </div>
  );
};

export default Message;
