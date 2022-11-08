import React, { useState } from "react";
import "../registration/registration.css";
import { Link } from "react-router-dom";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [show, setShow] = useState(false);

  let handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailErr("");
  };

  let handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordErr("");
  };

  let handleName = (e) => {
    setName(e.target.value);
    setNameErr("");
  };

  let showPassword = () => {
    setShow(!show);
  };

  let handleSubmit = () => {
    if (!email) {
      setEmailErr("Email is required");
    } else {
      if (!email.toLowerCase().match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
        setEmailErr("Valid email is required");
      }
    }

    if (!name) {
      setNameErr("Full name is required");
    }else{
      if(name.length < 6){
        setNameErr("Fullname must be than 6 charcter or more ")
      }
    }

    if (!password) {
      setPasswordErr("Password is required");
    } else if (!password.match(/^(?=.*[a-z])/)) {
      setPasswordErr("Password must contain lower case");
    } else if (!password.match(/^(?=.*[A-Z])/)) {
      setPasswordErr("Password must contain upper case");
    } else if (!password.match(/^(?=.*[0-9])/)) {
      setPasswordErr("Password must contain numberic charcter");
    } else if (!password.match(/^(?=.*[!@#$%^&*])/)) {
      setPasswordErr("Password must contain symbolic charcter");
    } else if (!password.match(/^(?=.{8,})/)) {
      setPasswordErr("Password must contain at least 8 charcter");
    }
  };

  return (
    <div className="flex">
      <div className="w-2/4 mt-1">
        <h1 className="font-nunito font-bold text-[34px] text-[#11175D] flex justify-end mr-[69px]">
          Get started with easily register
        </h1>
        <p className="font-nunito font-normal text-xl text-[#C3C5D7] flex justify-end mr-[263px] ">
          Free register and you can enjoy it
        </p>
        <div className="mt-12 flex justify-end mr-[193px] flex-wrap">
          <div className="relative mb-10">
            <input
              className="border border-[#11175D] rounded-lg w-[368px] px-12 py-5 font-nunito font-semibold text-xl text-[#11175D] "
              type="email"
              onChange={handleEmail}
            />
            <p className=" absolute top-[-11px] left-[26px] bg-white px-3 font-nunito font-semibold text-[13px] text-[#11175D]">
              Email Address
            </p>
            {emailErr && (
              <p className="font-nunito font-normal mt-1 px-2 rounded-lg text-base text-[#fff] bg-red-600">
                {emailErr}
              </p>
            )}
          </div>
          <div className="relative mb-10">
            <input
              className="border border-[#11175D] rounded-lg w-[368px] px-12 py-5 font-nunito font-semibold text-xl text-[#11175D] "
              type="text"
              onChange={handleName}
            />
            <p className=" absolute top-[-11px] left-[26px] bg-white px-3 font-nunito font-semibold text-[13px] text-[#11175D]">
              Full name
            </p>
            {nameErr && (
              <p className="font-nunito font-normal px-2 mt-1 rounded-lg text-base text-[#fff] bg-red-600">
                {nameErr}
              </p>
            )}
          </div>
          <div className="mb-9">
            {show ? (
              <div className="relative mb-1">
                <input
                  className="appearance-none border border-[#11175D] rounded-lg w-[368px] px-12 py-5 font-nunito font-semibold text-xl text-[#11175D] "
                  type={show ? "text" : "password"}
                  onChange={handlePassword}
                />
                <p className=" absolute top-[-11px] left-[26px] bg-white px-3 font-nunito font-semibold text-[13px] text-[#11175D]">
                  Password
                </p>
                <RiEyeFill
                  onClick={showPassword}
                  className="absolute top-[25px] right-[10px]"
                />
              </div>
            ) : (
              <div className="relative mb-1">
                <input
                  className="appearance-none border border-[#11175D] rounded-lg w-[368px] px-12 py-5 font-nunito font-semibold text-xl text-[#11175D] "
                  type={show ? "text" : "password"}
                  onChange={handlePassword}
                />
                <p className=" absolute top-[-11px] left-[26px] bg-white px-3 font-nunito font-semibold text-[13px] text-[#11175D]">
                  Password
                </p>
                <RiEyeCloseFill
                  onClick={showPassword}
                  className="absolute top-[25px] right-[10px]"
                />
              </div>
            )}
            {passwordErr && (
              <p className="font-nunito font-normal px-2 mt-1 rounded-lg text-base text-[#fff] bg-red-600">
                {passwordErr}
              </p>
            )}
          </div>

          <button
            className="border border-[#11175D] bg-[#5F35F5] rounded-[86px] w-[368px] px-12 py-4 font-nunito font-semibold text-xl text-[#FFFFFF] "
            type="button"
            onClick={handleSubmit}
          >
            Sign up
          </button>
          <div className="w-[368px] text-center mt-6">
            <p className="font-nunito font-semibold text-[13px] text-[#11175D]">
              Already have an account ?
              <Link className="text-[#EA6C00]" to="/login">
                {" "}
                Sign In
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="w-2/4">
        <picture>
          <img
            className="h-screen w-full object-cover"
            src="images/registration.webp"
          />
        </picture>
      </div>
    </div>
  );
};

export default Registration;
