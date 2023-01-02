import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { set, ref, push, getDatabase, onValue } from "firebase/database";

const Creategroup = () => {
  const [gName, setGname] = useState("");
  const [gNameErr, setGnameErr] = useState("");
  const [gTag, setGTag] = useState("");
  const [gTagErr, setGTagErr] = useState("");
  const [success, setSuccess] = useState("");
  const [groupList, setGroupList] = useState([]);

  const auth = getAuth();
  const db = getDatabase();

  let handleName = (e) => {
    setGnameErr("");
    setGname(e.target.value);
  };

  let handleTag = (e) => {
    setGTagErr("");
    setGTag(e.target.value);
  };

  let handleGroup = () => {
    if (!gName) {
      setGnameErr("Please Give A Valid Name");
    } else {
      if (gName.length < 2) {
        setGnameErr("Group Name At Least 2 Charcter Or More ");
      }
    }

    if (!gTag) {
      setGTagErr("Please Give A Valid Tagline");
    } else {
      if (gTag.length < 4) {
        setGTagErr("Tagline Must Be At Least 4 Charcter Or More");
      }
    }

    if (gName && gTag && !gNameErr && !gTagErr) {
      console.log("hello");
      set(push(ref(db, "group/")), {
        gname: gName,
        tagline: gTag,
        adminname: auth.currentUser.displayName,
        adminid: auth.currentUser.uid,
      }).then(() => {
        setGname("");
        setGTag("");
        setSuccess("Welcome ! Your Group Create Successfull");
      });
    }
  };

  useEffect(() => {
    const groupRef = ref(db, "group/");
    onValue(groupRef, (snapshot) => {
      let groupArr = [];
      snapshot.forEach((item) => {
        if (auth.currentUser.uid !== item.val().adminid) {
          groupArr.push(item.val());
        }
      });
      setGroupList(groupArr);
    });
  }, []);

  return (
    <div className="w-full h-[250px]">
      {success && (
        <p className="font-nunito font-normal mb-2 mt-1 px-2 rounded-lg text-base text-[#fff] bg-red-600">
          {success}
        </p>
      )}

      <input
        className="  rounded-[5px] py-[10px] px-[20px] border w-full mb-[10px] mt-10"
        placeholder="Group Name"
        onChange={handleName}
        value={gName}
      />
      {gNameErr && (
        <p className="font-nunito font-normal mb-2 mt-1 px-2 rounded-lg text-base text-[#fff] bg-red-600">
          {gNameErr}
        </p>
      )}
      <input
        className=" rounded-[5px] py-[10px] px-[20px] border w-full  mb-[10px]"
        placeholder="Group Tagline"
        onChange={handleTag}
        value={gTag}
      />
      {gTagErr && (
        <p className="font-nunito font-normal mb-2 mt-1 px-2 rounded-lg text-base text-[#fff] bg-red-600">
          {gTagErr}
        </p>
      )}
      <button
        onClick={handleGroup}
        className="border border-[#11175D] bg-[#5F35F5] rounded-[20px] w-full px-5 py-1 font-nunito font-semibold text-base text-[#FFFFFF] "
        type="button"
      >
        Create
      </button>
    </div>
  );
};

export default Creategroup;
