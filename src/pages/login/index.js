import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [show, setShow] = useState(false);

  let handleEmail = (e) => {
    setEmail(e.target.value);
  };

  let handlePassword = (e) => {
    setPassword(e.target.value);
  };

  let showPassword = () => {
    setShow(!show);
  };

  let handleLogin = () => {
    if (!email) {
      setEmailErr("Email is required");
    } else {
      if (!email.toLowerCase().match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
        setEmailErr("Valid email is required");
      }
    }

    if (!password) {
      setPasswordErr("Password is required");
    }
  };

  return (
    <div className="flex">
      <div className="w-2/4 mt-5">
        <h1 className="font-nunito font-bold text-[34px] text-[#11175D] flex justify-end mr-[207px]">
          Login to your account!
        </h1>
        <div className="flex justify-end mr-[335px] mt-7">
          <picture>
            <img className="cursor-pointer" src="images/google.webp" />
          </picture>
        </div>

        <div className="mt-12 flex justify-end mr-[187px] flex-wrap">
          <div className="relative mb-10">
            <input
              className="border-b border-[#03014C] outline-0 w-[368px] px-1 py-5 font-nunito font-semibold text-xl text-[#11175D] "
              type="email"
              onChange={handleEmail}
            />
            <p className=" absolute top-0 left-0  font-nunito font-semibold text-[13px] text-[#03014C]">
              Email Address
            </p>
            {emailErr && (
              <p className="font-nunito font-normal mt-1 px-2 rounded-lg text-base text-[#fff] bg-red-600">
                {emailErr}
              </p>
            )}
          </div>

          <div className="mb-10">
            {show ? (
              <div className="relative mb-1">
                <input
                  className="border-b border-[#03014C] outline-0  w-[368px] px-1 py-5 font-nunito font-semibold text-xl text-[#11175D] "
                  type={show ? "text" : "password"}
                  onChange={handlePassword}
                />
                <p className=" absolute top-0 left-0 font-nunito font-semibold text-[13px] text-[#03014C]">
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
                  className="border-b border-[#03014C] outline-0  w-[368px] px-1 py-5 font-nunito font-semibold text-xl text-[#11175D] "
                  type={show ? "text" : "password"}
                  onChange={handlePassword}
                />
                <p className=" absolute top-0 left-0 font-nunito font-semibold text-[13px] text-[#03014C]">
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
            className="border border-[#11175D] bg-[#5F35F5] rounded-lg w-[368px] px-12 py-4 font-nunito font-semibold text-xl text-[#FFFFFF] "
            type="button"
            onClick={handleLogin}
          >
            Login to Continue
          </button>
          <div className="w-[368px] text-center mt-6">
            <p className="font-nunito font-semibold text-[13px] text-[#11175D]">
              Don’t have an account ?
              <Link className="text-[#EA6C00]" to="/registration">
                {" "}
                Sign up
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>

      <div className="w-2/4">
        <picture>
          <img
            className="h-screen w-full object-cover"
            src="images/login.webp"
          />
        </picture>
      </div>
    </div>
  );
};

export default Login;
