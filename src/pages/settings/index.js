import React from "react";
import Sidebar from "../../sections/Sidebar";
import UserSettings from "../../sections/UserSettings";

const Settings = () => {
  return (
    <div className="flex m-auto">
      <div className="w-[186px] ">
        <Sidebar active="settings" />
      </div>
      <div className="w-[1115px] ">
        <UserSettings />
      </div>
    </div>
  );
};

export default Settings;
