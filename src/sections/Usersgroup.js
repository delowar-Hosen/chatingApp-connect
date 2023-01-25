import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { set, ref, push, getDatabase, onValue } from "firebase/database";

const Usersgroup = () => {
  const [groupList, setGroupList] = useState([]);
  const [joinReq, setJoinReq] = useState([]);
  const [member, setMember] = useState([]);

  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const groupRef = ref(db, "group/");
    onValue(groupRef, (snapshot) => {
      let groupArr = [];
      snapshot.forEach((item) => {
        if (auth.currentUser.uid !== item.val().adminid) {
          groupArr.push({ ...item.val(), groupid: item.key });
        }
      });
      setGroupList(groupArr);
    });
  }, []);

  useEffect(() => {
    const groupRef = ref(db, "groupjoinrequest/");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().senderid + item.val().groupid);
      });
      setJoinReq(arr);
    });
  }, []);

  useEffect(() => {
    const groupRef = ref(db, "groupmembers/");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().groupid + item.val().senderid);
      });
      setMember(arr);
    });
  }, []);

  let handlejoingroup = (item) => {
    // console.log(item);
    set(push(ref(db, "groupjoinrequest/")), {
      gname: item.gname,
      gtagline: item.tagline,
      groupid: item.groupid,
      adminname: item.adminname,
      adminid: item.adminid,
      sendername: auth.currentUser.displayName,
      senderid: auth.currentUser.uid,
      senderprofilepic: auth.currentUser.photoURL,
    }).then(() => {
      set(push(ref(db, "notification/")), {
        senderid: auth.currentUser.uid,
        sendername: auth.currentUser.displayName,
        reciverid: item.adminid,
        recivername: item.adminname,
        state: "group join",
      });
    });
  };
  return (
    <>
      {groupList.map((item) => (
        <div className="flex justify-between border-b border-[#ddd3d38e] pb-[5px] pt-3 ">
          <div className="flex">
            <picture>
              <img
                className="bg-[red] rounded-full w-[55px] h-[55px]"
                src={item.groupPic}
              />
            </picture>
            <div className="xl:mt-[10px] pl-[14px] mb-[10px]">
              <h5 className="font-pop font-semibold text-[18px] leading-[27px] ">
                {item.gname}
              </h5>
              <p className="font-pop font-medium text-[14px] leading-[21px] ">
                {item.tagline}
              </p>
            </div>
          </div>
          {joinReq.includes(item.groupid + auth.currentUser.uid) ||
          joinReq.includes(auth.currentUser.uid + item.groupid) ? (
            <button className="font-pop font-semibold text-base xl:text-xl w-[87px] h-[30px] bg-[#5F35F5]  mt-[20px] rounded-[5px] mr-[12px]">
              Pending
            </button>
          ) : member.includes(item.groupid + auth.currentUser.uid) ||
            member.includes(auth.currentUser.uid + item.groupid) ? (
            <button className="font-pop font-semibold text-base xl:text-xl w-[87px] h-[30px] bg-[#5F35F5] mt-[20px] rounded-[5px] mr-[12px]">
              Member
            </button>
          ) : (
            <button
              onClick={() => handlejoingroup(item)}
              className="font-pop font-semibold text-xl w-[87px] h-[30px] bg-[#5F35F5]  mt-[20px] rounded-[5px] mr-[12px]"
            >
              Join
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default Usersgroup;
