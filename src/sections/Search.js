import React from "react";
import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";

const Search = ({ state, className }) => {
  return (
    <div className="relative font-pop font-medium text-base mb-[20px] ">
      <input className={className} placeholder="Search" onChange={state} />
      <BsSearch className="absolute top-[13px] right-[30px]" />
    </div>
  );
};

export default Search;
