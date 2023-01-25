import React from "react";
import Sidebar from "../../sections/Sidebar";
import UserNotify from "../../sections/UserNotify";

const Notification = () => {
  return (
    <div className="flex m-auto">
      <div className="w-[186px] ">
        <Sidebar active="notification" />
      </div>
      <div className="w-[1100px] ">
        <UserNotify />
      </div>
    </div>
  );
};

export default Notification;
