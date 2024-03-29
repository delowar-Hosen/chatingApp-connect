import React from "react";
import Friendslist from "../../sections/Friendslist";
import Grouplist from "../../sections/Grouplist";
import Sidebar from "../../sections/Sidebar";
import Userlist from "../../sections/Userlist";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Friendrequest from "../../sections/Friendrequest";
import Mygroup from "../../sections/Mygroup";
import Blockuser from "../../sections/Blockuser";
import { getDatabase, ref, set, push } from "firebase/database";

const Home = () => {
  const [varify, setvarify] = useState(false);

  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    } else {
      if (auth.currentUser.emailVerified) {
        setvarify(true);
        set(push(ref(db, "userstatus")), {
          userid: auth.currentUser.uid,
          username: auth.currentUser.displayName,
        });
      } else {
        setvarify(false);
        navigate("/login");
      }
    }
  }, []);

  return (
    <>
      {varify && (
        <div className="m-5 xl:m-0 xl:flex justify-center items-center">
          <div className="xl:flex">
            <div className="fixed bottom-0 left-0 w-full xl:static   xl:w-[186px] z-50 ">
              <Sidebar active="home" />
            </div>
            <div className="w-[100%] xl:w-[427px] ">
              <Grouplist />
              <Friendrequest />
            </div>
            <div className="w-full xl:w-[344px]">
              <Friendslist />
              <Mygroup />
            </div>
            <div className="w-full xl:w-[344px] ">
              <Userlist />
              <Blockuser />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
