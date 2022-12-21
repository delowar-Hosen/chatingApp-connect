import React from "react";
import Sidebar from "../../sections/Sidebar";

const Message = () => {
  return (
    <div className="flex m-auto">
      <div className="w-[186px] ">
        <Sidebar active="message" />
      </div>
      <div className="w-[427px] ">hello</div>
      <div className="w-[344px]">hello</div>
      <div className="w-[344px] ">hello</div>
    </div>
  );
};

export default Message;
