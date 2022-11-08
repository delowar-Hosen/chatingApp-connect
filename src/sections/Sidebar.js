import React from "react";
import { SlHome } from "react-icons/sl";
import {AiOutlineMessage,AiOutlineSetting } from "react-icons/ai";
import {IoIosNotificationsOutline} from "react-icons/io";
import {MdLogout} from "react-icons/md";

const Sidebar = () => {
  return (
    <div className="bg-[#5F35F5] rounded-[20px] mt-[35px] mb-[35px] w-full h-full overflow-x-hidden ">
      <div className="px-11 pt-9 pb-[79px] ">
        <picture>
          <img
            className=" rounded-full object-cover"
            src="images/profile.png"
          />
        </picture>
      </div>
      <div className="flex justify-center items-center flex-col gap-y-20">
        <div className="relative text-center z-10 py-5   after:absolute after:content-[''] after:top-0 after:left-[-45px] after:w-[200px] after:rounded-[20px] after:h-full after:bg-[#fff] after:z-[-1] before:absolute before:content-[''] before:top-0 before:right-[-77px] before:w-[20px] before:h-full before:bg-[#5F35F5] before:rounded-[25px] before:shadow-2xl  ">
          <SlHome className=" text-5xl text-[#5F35F5] " />
        </div>
        <AiOutlineMessage className=" text-5xl text-[#fff] " />
        <IoIosNotificationsOutline className=" text-5xl text-[#fff] " />
        <AiOutlineSetting className=" text-5xl text-[#fff] " />
        <MdLogout className=" text-5xl mt-40 text-[#fff] " />
      </div>
    </div>
  );
};

export default Sidebar;
