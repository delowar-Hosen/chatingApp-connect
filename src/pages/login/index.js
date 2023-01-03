import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { ThreeDots } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import Blockuser from "../../sections/Blockuser";
import { getDatabase, ref, set, push } from "firebase/database";
const Login = () => {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState("");
  const [loader, setLoader] = useState(false);
  const [forget, setForget] = useState(false);
  const [resetP, setResetP] = useState("");

  const db = getDatabase();
  const auth = getAuth();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  let handleEmail = (e) => {
    setSuccess("");
    setEmail(e.target.value);
  };

  let handlePassword = (e) => {
    setSuccess("");
    setPasswordErr("");
    setPassword(e.target.value);
  };

  let showPassword = () => {
    setShow(!show);
  };

  let handleResetPassword = (e) => {
    setResetP(e.target.value);
  };

  let handlePasswordChanged = () => {
    sendPasswordResetEmail(auth, resetP)
      .then(() => {
        toast("Reset Password Sucessfully ! Check Your Email");
        setTimeout(() => {
          setForget(false);
        }, 1000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  let handleGoogle = () => {
    signInWithPopup(auth, provider).then(() => {
      navigate("/");
    });
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

    if (
      email &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/.test(
        password
      )
    ) {
      setLoader(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          if (user.user.emailVerified) {
            setTimeout(() => {
              setLoader(false);
              navigate("/");
            }, 2000);
            set(push(ref(db, "userstatus/")), {
              userid: auth.currentUser.uid,
              username: auth.currentUser.displayName,
            });
          } else {
            setSuccess("");
            setSuccess("Please verify your email");
            setLoader(false);
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          if (errorCode.includes("auth/wrong-password")) {
            setSuccess("");
            setSuccess("Password wrong ! try another");
            setLoader(false);
          }
          if (errorCode.includes("auth/user-not-found")) {
            setSuccess("");
            setSuccess("Email not found! Please registration this email");
            setLoader(false);
          }
        });
    }
  };

  return (
    <div className="flex">
      <ToastContainer />
      <div className="w-2/4 mt-5">
        <h1 className="font-nunito font-bold text-[34px] text-[#11175D] flex justify-end mr-[207px]">
          Login to your account!
        </h1>
        <div className="flex justify-end mr-[335px] mt-7">
          <picture>
            <img
              className="cursor-pointer"
              src="images/google.webp"
              onClick={handleGoogle}
            />
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
          {success && (
            <p className="font-nunito font-normal w-[368px]  text-center px-2  mb-1 rounded-lg text-base text-[#fff] bg-red-600">
              {success}
            </p>
          )}
          {loader ? (
            <div className=" w-full flex justify-center ml-[100px]">
              <ThreeDots
                height="80"
                width="80"
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
              className="border border-[#11175D] bg-[#5F35F5] rounded-lg w-[368px] px-12 py-4 font-nunito font-semibold text-xl text-[#FFFFFF] "
              type="button"
              onClick={handleLogin}
            >
              Login to Continue
            </button>
          )}
          <div className="w-[368px] text-center mt-6">
            <p className="font-nunito font-semibold text-[13px] text-[#11175D]">
              Don’t have an account ?
              <Link className="text-[#EA6C00]" to="/registration">
                {" "}
                Sign up
              </Link>{" "}
            </p>
          </div>
          <div className="w-[368px] text-center mt-2">
            <p className="font-nunito font-semibold text-[13px] text-[#11175D]">
              Don’t remeber password ?
              <button
                onClick={() => setForget(true)}
                className="text-[#EA6C00]"
              >
                Reset Password
              </button>
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
      {forget && (
        <div className="w-full h-full bg-[#EA6C00] flex justify-center items-center fixed flex-col">
          <h3 className="py-4 font-nunito font-semibold text-4xl text-[#FFFFFF] ">
            Forget Password
          </h3>
          <div className="mb-10 flex flex-col">
            <input
              className="mb-5 border border-[#03014C] rounded-lg outline-0 w-[368px] px-5 py-5 font-nunito font-semibold text-xl text-[#11175D] "
              type="email"
              onChange={handleResetPassword}
              placeholder="Email Address"
            />
            <button
              className="border border-[#11175D] bg-[#5F35F5] rounded-lg w-[368px] px-12 py-4 font-nunito font-semibold text-xl text-[#FFFFFF] "
              type="button"
              onClick={handlePasswordChanged}
            >
              Changed Password
            </button>
            <button
              className="text-4xl text-[#FFFFFF] absolute top-[50px] right-[100px]  "
              type="button"
              onClick={() => setForget(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
