import React from "react";
import Search from "./Search";
import { AiTwotoneEdit, AiFillDelete } from "react-icons/ai";
import {
  BsChatDotsFill,
  BsFillMoonStarsFill,
  BsFillSunFill,
} from "react-icons/bs";
import { IoIosPhotos, IoIosContrast } from "react-icons/io";
import { IoHelpCircleOutline } from "react-icons/io5";
import { FaKey } from "react-icons/fa";
import { useEffect } from "react";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, db, set, ref, onValue } from "firebase/database";
import "./Mode.css";

const UserSettings = () => {
  const [user, setUser] = useState([]);
  const [editName, setEditName] = useState("");
  const [nameEdit, setNameEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [bg, setBg] = useState(false);
  const [email, setEmail] = useState("");
  const [resetP, setResetP] = useState("");

  const [theme, setTheme] = useState("light");

  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const notificationRef = ref(db, "users/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (auth.currentUser.uid == item.val().id) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setUser(arr);
      setEmail(arr[0].email);
    });
  }, []);

  let handleEditState = (e) => {
    setEditName("");
    setEditName(e.target.value);
  };

  let handleNameEdit = () => {
    setNameEdit(true);
  };

  let handleSaveEditName = (item) => {
    set(ref(db, "users/" + item.id), {
      name: editName,
      email: item.email,
      photoURL: item.photoURL,
      id: item.id,
    }).then(() => {
      setEditName("");
      setNameEdit(false);
    });
  };

  let handlePasswordReset = () => {
    setPasswordEdit(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        setResetP("Check Your Email To Change Your Password");
        setTimeout(() => {
          setPasswordEdit(false);
        }, 3000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  let handleMode = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  let handleTheme = () => {
    setBg(true);
    setTimeout(() => {
      setBg(false);
    }, 2000);
  };

  return (
    <div className={`mt-[20px] ml-[43px] userSetings ${theme} `}>
      <Search className="drop-shadow rounded-[20px] py-[10px] px-[78px] outline-0 w-full" />
      <div className="flex justify-between mt-9">
        <div className="w-[500px] p-6 border border-[#c9c5c542] rounded-md">
          <h3 className="font-pop font-semibold text-xl mb-10">
            Profile Settings
          </h3>
          {user.map((item) => (
            <div className="flex pb-8 border-b border-[#8a84848e]">
              <img
                src={item.photoURL}
                className="w-[100px] h-[100px] rounded-full"
              />
              <div className="ml-8 mt-2">
                {nameEdit ? (
                  <div className="flex gap-x-1 items-center">
                    <input
                      placeholder="Edit Your Name"
                      onChange={handleEditState}
                      className="py-2 px-2 font-pop font-semibold text-[25px] outline-0 w-[70%]"
                    />
                    <AiTwotoneEdit
                      onClick={() => handleSaveEditName(item)}
                      className="text-[27px]  mr-9 "
                    />
                  </div>
                ) : (
                  <h5 className="font-pop font-semibold text-[25px] ">
                    {item.name}
                  </h5>
                )}
                <p className="font-pop font-normal text-xl ">{item.email}</p>
              </div>
            </div>
          ))}

          <div className="p-[43px] flex flex-col gap-y-8">
            {nameEdit ? (
              <span className="font-pop font-normal text-xl text-[#df4a4a]">
                Please Edit Your User Name
              </span>
            ) : (
              <p
                onClick={handleNameEdit}
                className="flex items-center cursor-pointer"
              >
                <AiTwotoneEdit className="text-[27px] mr-9 " />
                <span className="font-pop font-normal text-xl">
                  Edit Profile Name.
                </span>
              </p>
            )}

            <p className="flex items-center">
              <BsChatDotsFill className="text-[27px] mr-9 " />
              <span className="font-pop font-normal text-xl">
                Edit Profile Status Info.
              </span>
            </p>
            <p className="flex items-center">
              <IoIosPhotos className="text-[27px] mr-9 " />
              <span className="font-pop font-normal text-xl">
                Edit Profile Photo.
              </span>
            </p>
            <p className="flex items-center">
              <IoHelpCircleOutline className="text-[27px] mr-9 " />
              <span className="font-pop font-normal text-xl">Help.</span>
            </p>
          </div>
        </div>
        <div className="w-[500px] p-6 border border-[#c9c5c542] rounded-md">
          <h3 className="font-pop font-semibold text-xl mb-10">
            Account Settings
          </h3>

          <div className="pl-[43px] flex flex-col gap-y-8">
            {passwordEdit ? (
              <span className="font-pop font-normal text-xl text-[#df4a4a]">
                {resetP}
              </span>
            ) : (
              <p onClick={handlePasswordReset} className="flex items-center">
                <FaKey className="text-[27px]  mr-9 " />
                <span className="font-pop font-normal text-xl">
                  Change Password
                </span>
              </p>
            )}

            <p className="flex items-center">
              <IoIosContrast className="text-[27px] mr-9 " />

              {bg ? (
                <div className="flex items-center bg-slate-500 w-[80px] rounded-lg">
                  {theme === "dark" ? (
                    <button
                      className="bg-white py-1 px-4 rounded-lg text-[#FFE87C]"
                      onClick={handleMode}
                    >
                      <BsFillSunFill />
                    </button>
                  ) : (
                    <button
                      className="bg-black ml-[32px] py-1 px-4 rounded-lg text-[#FEFCD7]"
                      onClick={handleMode}
                    >
                      <BsFillMoonStarsFill />
                    </button>
                  )}
                </div>
              ) : (
                <span
                  onClick={handleTheme}
                  className=" font-pop font-normal text-xl"
                >
                  Change Theme.
                </span>
              )}
            </p>
            <p className="flex items-center">
              <AiFillDelete className="text-[27px] mr-9 " />
              <span className="font-pop font-normal text-xl">
                Delete Account.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
