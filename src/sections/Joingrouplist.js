import React, { useEffect, useState } from "react";
import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import Friendslist from "./Friendslist";
import { useDispatch } from "react-redux";
import { chatActive } from "../slice/ActiveChat";

const Joingrouplist = () => {
  const [myGroup, setMyGroup] = useState([]);
  const [myGMember, setMyGMember] = useState([]);

  const auth = getAuth();
  const db = getDatabase();
  const dispatch = useDispatch();

  useEffect(() => {
    const groupRef = ref(db, "group/");
    onValue(groupRef, (snapshot) => {
      let groupArr = [];
      snapshot.forEach((item) => {
        if (item.val().adminid == auth.currentUser.uid) {
          groupArr.push({ ...item.val(), groupid: item.key });
        }
      });
      setMyGroup(groupArr);
    });
  }, []);

  useEffect(() => {
    const memberRef = ref(db, "groupmembers/");
    onValue(memberRef, (snapshot) => {
      let groupArr = [];
      snapshot.forEach((item) => {
        if (item.val().senderid == auth.currentUser.uid) {
          groupArr.push(item.val());
        }
      });
      setMyGMember(groupArr);
    });
  }, []);

  let handleChat = (item) => {
    let userInfo = {
      status: "group",
      name: item.gname,
      id: item.groupid,
    };
    dispatch(chatActive(userInfo));
  };
  return (
    <>
      <div className="shadow-2xl border rounded-[20px] py-[20px] px-[20px] mt-[35px] ml-[43px] overflow-y-scroll">
        <div className="relative font-pop font-medium text-base mb-[43px] ">
          <input
            className="drop-shadow rounded-[20px] py-[17px] px-[78px] outline-0 w-full"
            placeholder="Search"
          />
          <BsSearch className="absolute top-[20px] left-[23px]" />
          <BsThreeDotsVertical className="absolute top-[20px] right-[25px] text-[#5F35F5]" />
        </div>
        {myGroup.map((item) => (
          <div
            onClick={() => handleChat(item)}
            className="flex justify-between border-b pb-[13px]"
          >
            <div className="flex">
              <picture>
                <img
                  className="bg-[red] rounded-full w-[70px] h-[70px]"
                  src="images/pic.png"
                />
              </picture>
              <div className="mt-[12px] pl-[14px]">
                <h5 className="font-pop font-semibold text-[18px] leading-[27px] text-[#000000]">
                  {item.gname}
                </h5>
                <p className="font-pop font-medium text-[14px] leading-[21px] text-[#4D4D4DBF]">
                  {item.tagline}
                </p>
              </div>
            </div>
          </div>
        ))}
        {myGMember.map((item) => (
          <div
            onClick={() => handleChat(item)}
            className="flex justify-between border-b pb-[13px]"
          >
            <div className="flex">
              <picture>
                <img
                  className="bg-[red] rounded-full w-[70px] h-[70px]"
                  src="images/pic.png"
                />
              </picture>
              <div className="mt-[12px] pl-[14px]">
                <h5 className="font-pop font-semibold text-[18px] leading-[27px] text-[#000000]">
                  {item.gname}
                </h5>
                <p className="font-pop font-medium text-[14px] leading-[21px] text-[#4D4D4DBF]">
                  {item.tagline}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Friendslist chat={true} />
    </>
  );
};

export default Joingrouplist;
