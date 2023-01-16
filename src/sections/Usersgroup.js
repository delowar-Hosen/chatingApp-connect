import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { set, ref, push, getDatabase, onValue } from "firebase/database";

const Usersgroup = () => {
  const [groupList, setGroupList] = useState([]);

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
            <div className="mt-[10px] pl-[14px] mb-[10px]">
              <h5 className="font-pop font-semibold text-[18px] leading-[27px] text-[#000000]">
                {item.gname}
              </h5>
              <p className="font-pop font-medium text-[14px] leading-[21px] text-[#4D4D4DBF]">
                {item.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={() => handlejoingroup(item)}
            className="font-pop font-semibold text-xl w-[87px] h-[30px] bg-[#5F35F5] text-[#fff] mt-[20px] rounded-[5px] mr-[12px]"
          >
            Join
          </button>
        </div>
      ))}
    </>
  );
};

export default Usersgroup;
