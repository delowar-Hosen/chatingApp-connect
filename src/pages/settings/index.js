import React from "react";
import Sidebar from "../../sections/Sidebar";

const Settings = () => {
  return (
    <div className="flex m-auto">
      <div className="w-[186px] ">
        <Sidebar active="settings" />
      </div>
      <div className="w-[427px] ">hello</div>
      <div className="w-[344px]">hello</div>
      <div className="w-[344px] ">hello</div>
    </div>
  );
};

export default Settings;
