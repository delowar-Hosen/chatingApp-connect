import React from "react";
import Friendslist from "../../sections/Friendslist";
import Grouplist from "../../sections/Grouplist";
import Sidebar from "../../sections/Sidebar";
import Userlist from "../../sections/Userlist";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Friendrequest from "../../sections/Friendrequest";
import Mygroup from "../../sections/Mygroup";
import Blockuser from "../../sections/Blockuser";

const Home = () => {
  const [varify, setvarify] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    } else {
      if (auth.currentUser.emailVerified) {
        setvarify(true);
      } else {
        setvarify(false);
        navigate("/login");
      }
    }
  }, []);

  console.log(auth);
  return (
    <>
      {varify && (
        <div className="flex">
          <div className="w-[186px] ">
            <Sidebar active="home" />
          </div>
          <div className="w-[427px] ">
            <Grouplist />
            <Friendrequest />
          </div>
          <div className="w-[344px]">
            <Friendslist />
            <Mygroup />
          </div>
          <div className="w-[344px] ">
            <Userlist />
            <Blockuser />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
