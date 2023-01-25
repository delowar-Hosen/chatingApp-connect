import React, { useState } from "react";
import "../registration/registration.css";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { ThreeDots } from "react-loader-spinner";
import { getDatabase, ref, set } from "firebase/database";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState("");
  const [loader, setLoader] = useState(false);

  const auth = getAuth();
  let navigate = useNavigate();
  const db = getDatabase();

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
    setSuccess("");
    if (!email) {
      setEmailErr("Email is required");
    } else {
      if (!email.toLowerCase().match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
        setEmailErr("Valid email is required");
      }
    }

    if (!name) {
      setNameErr("Full name is required");
    } else {
      if (name.length < 6) {
        setNameErr("Fullname must be than 6 charcter or more ");
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

    if (
      email &&
      name &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/.test(
        password
      )
    ) {
      setLoader(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: "images/profile.webp",
          })
            .then(() => {
              sendEmailVerification(auth.currentUser)
                .then(() => {
                  setLoader(false);
                  setSuccess("");
                  setSuccess(
                    "Registration  successfully ! Please Verify Email to continue"
                  );
                })
                .then(() => {
                  set(ref(db, "users/" + user.user.uid), {
                    name: user.user.displayName,
                    email: user.user.email,
                    photoURL: user.user.photoURL,
                    id: user.user.uid,
                  });
                })
                .then(() => {
                  setTimeout(() => {
                    navigate("/login");
                  }, 2000);
                })
                .catch((erro) => {
                  console.log(erro);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          if (errorCode.includes("auth/email-already-in-use")) {
            setSuccess("Email is already use ! try another");
            setLoader(false);
          }
        });
    }
  };

  return (
    <div className=" p-5 xl:p-0 xl:flex">
      <div className="w-full text-center xl:w-2/4 mt-1">
        <h1 className="font-nunito font-bold  text-xl xl:text-[34px] text-[#11175D] flex justify-center xl:justify-end xl:mr-[69px]">
          Get started with easily register
        </h1>
        <p className="font-nunito font-normal text-base xl:text-xl text-[#C3C5D7] flex justify-center xl:justify-end xl:mr-[263px] ">
          Free register and you can enjoy it
        </p>
        <div className="mt-12 xl:flex justify-center xl:justify-end xl:mr-[193px] flex-wrap">
          <div className="relative mb-10">
            <input
              className="border border-[#11175D] rounded-lg w-full xl:w-[368px] px-12 py-5 font-nunito font-semibold text-xl text-[#11175D] "
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
              className="border border-[#11175D] rounded-lg w-full xl:w-[368px] px-12 py-5 font-nunito font-semibold text-xl text-[#11175D] "
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
          <div className="mb-10">
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
                  className="appearance-none border border-[#11175D] rounded-lg w-full xl:w-[368px] px-12 py-5 font-nunito font-semibold text-xl text-[#11175D] "
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
          {success && (
            <p className="font-nunito font-normal w-[368px]  text-center px-2  mb-1 rounded-lg text-base text-[#fff] bg-red-600">
              {success}
            </p>
          )}

          {loader ? (
            <div className=" w-full flex justify-center ml-[100px]">
              <ThreeDots
                height="100"
                width="100"
                radius="9"
                color="#4fa94d"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            </div>
          ) : (
            <button
              className="border border-[#11175D] bg-[#5F35F5] rounded-[86px] w-full xl:w-[368px] px-12 py-4 font-nunito font-semibold text-xl text-[#FFFFFF] "
              type="button"
              onClick={handleSubmit}
            >
              Sign up
            </button>
          )}

          <div className="w-full xl:w-[368px] text-center mt-6">
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
      <div className="hidden xl:block w-2/4">
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
