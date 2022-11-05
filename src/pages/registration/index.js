import React from "react";
import "../registration/registration.css";
import { Link } from "react-router-dom";

const Registration = () => {
  return (
    <div className="flex">
      <div className="w-2/4">
        <h1 className="font-nunito font-bold text-[34px] text-[#11175D] flex justify-end mr-[69px]">
          Get started with easily register
        </h1>
        <p className="font-nunito font-normal text-xl text-[#C3C5D7] flex justify-end mr-[263px] ">
          Free register and you can enjoy it
        </p>
        <div className="mt-16 flex justify-end mr-[193px] flex-wrap">
          <div className="relative mb-14">
            <input
              className="border border-[#11175D] rounded-lg w-[368px] px-12 py-5 font-nunito font-semibold text-xl text-[#11175D] "
              type="email"
            />
            <p className=" absolute top-[-11px] left-[26px] bg-white px-3 font-nunito font-semibold text-[13px] text-[#11175D]">
              Email Address
            </p>
          </div>
          <div className="relative mb-14">
            <input
              className="border border-[#11175D] rounded-lg w-[368px] px-12 py-5 font-nunito font-semibold text-xl text-[#11175D] "
              type="text"
            />
            <p className=" absolute top-[-11px] left-[26px] bg-white px-3 font-nunito font-semibold text-[13px] text-[#11175D]">
              Full name
            </p>
          </div>

          <div className="relative mb-12">
            <input
              className="border border-[#11175D] rounded-lg w-[368px] px-12 py-5 font-nunito font-semibold text-xl text-[#11175D] "
              type="password"
            />
            <p className=" absolute top-[-11px] left-[26px] bg-white px-3 font-nunito font-semibold text-[13px] text-[#11175D]">
              Password
            </p>
          </div>
          <button
            className="border border-[#11175D] bg-[#5F35F5] rounded-[86px] w-[368px] px-12 py-4 font-nunito font-semibold text-xl text-[#FFFFFF] "
            type="button"
          >
            Sign up
          </button>
          <div className="w-[368px] text-center mt-8">
            <p className="font-nunito font-semibold text-[13px] text-[#11175D]">Already have an account ?
            <Link className="text-[#EA6C00]" to="/login"> Sign In</Link> </p>
          </div>
        </div>
      </div>
      <div className="w-2/4"></div>
    </div>
  );
};

export default Registration;
