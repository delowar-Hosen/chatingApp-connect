import React, { useState, useEffect } from "react";
import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import Creategroup from "./Creategroup";
import Search from "./Search";
import Usersgroup from "./Usersgroup";

const Grouplist = () => {
  const [group, setGroup] = useState(false);

  return (
    <>
      <div className="mt-[20px] xl:ml-[43px]">
        <Search className="drop-shadow rounded-[20px] py-[10px] px-[78px] outline-0 w-full" />
        <div className="w-full h-[90vh] xl:h-[38vh] overflow-y-scroll  shadow-2xl border rounded-[20px] py-[20px] px-[20px]">
          <div className="flex justify-between mb-[17px]">
            <h2 className="font-pop font-semibold text-xl">Groups List</h2>
            <button
              onClick={() => setGroup(!group)}
              className="font-pop font-semibold text-base w-[110px] h-[30px] bg-[#5F35F5] rounded-[5px] mr-[12px]"
            >
              {group ? "Create Group" : "Go Back"}
            </button>
          </div>
          {group ? (
            <Usersgroup />
          ) : (
            <div className="flex justify-between border-b pb-[13px]">
              <Creategroup />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Grouplist;
