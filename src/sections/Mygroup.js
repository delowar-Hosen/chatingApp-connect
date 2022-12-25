import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  set,
  ref,
  push,
  getDatabase,
  onValue,
  remove,
} from "firebase/database";
import { useEffect } from "react";
import { useState } from "react";
import { getAuth } from "firebase/auth";

const Mygroup = () => {
  const [groupList, setGroupList] = useState([]);
  const [groupJoinList, setGroupJoinList] = useState([]);
  const [info, setInfo] = useState(false);

  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const groupRef = ref(db, "group/");
    onValue(groupRef, (snapshot) => {
      let groupArr = [];
      snapshot.forEach((item) => {
        if (auth.currentUser.uid == item.val().adminid) {
          groupArr.push({ ...item.val(), groupid: item.key });
        }
      });
      setGroupList(groupArr);
    });
  }, []);

  let handleGroupJoin = (item) => {
    console.log(item);
    setInfo(true);
    const groupJoinRef = ref(db, "groupjoinrequest/");
    onValue(groupJoinRef, (snapshot) => {
      let joinArr = [];
      snapshot.forEach((gitem) => {
        if (
          item.adminid == auth.currentUser.uid &&
          item.groupid == gitem.val().groupid
        ) {
          joinArr.push({ ...gitem.val(), gkey: gitem.key });
        }
      });
      setGroupJoinList(joinArr);
    });
  };

  let handleJoinReject = (item) => {
    remove(ref(db, "groupjoinrequest/" + item.gkey));
  };

  let handleJoinAccept = (item) => {
    console.log(item);
    set(push(ref(db, "groupmembers/")), {
      adminid: item.adminid,
      adminname: item.adminname,
      gkey: item.gkey,
      groupid: item.groupid,
      gtagline: item.gtagline,
      senderid: item.senderid,
      sendername: item.sendername,
      senderprofilepic: item.senderprofilepic,
    }).then(() => {
      remove(ref(db, "groupjoinrequest/" + item.gkey));
    });
  };

  return (
    <div className="mt-[45px] ml-[22px]">
      <div className="w-full shadow-2xl border rounded-[20px] py-[20px] px-[20px] h-[439px]">
        <div className="flex justify-between mb-[5px]">
          <h2 className="font-pop font-semibold text-xl text-[#000000]">
            My Groups
          </h2>
          <BsThreeDotsVertical className="text-[#5F35F5] mt-[5px]" />
        </div>
        {info ? (
          <div>
            <button
              onClick={() => setInfo(false)}
              className="font-pop font-semibold mr-1 text-sm w-[50px] h-[20px] bg-[#5F35F5] text-[#fff] rounded-[5px]"
            >
              Back
            </button>
            {groupJoinList.map((item) => (
              <div className="flex justify-between border-b pb-[13px]">
                <div className="flex mt-3">
                  <picture>
                    <img
                      className="rounded-full w-[52px] h-[52px]"
                      src={item.senderprofilepic}
                    />
                  </picture>
                  <div className="mt-[1px] pl-[5px]">
                    <h5 className="font-pop font-semibold text-[14px] leading-[27px] text-[#000000]">
                      {item.sendername}
                    </h5>
                    <p className="font-pop font-medium text-[12px] leading-[21px] text-[#4D4D4DBF]">
                      {item.gtagline}
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => handleJoinAccept(item)}
                    className="font-pop font-semibold mr-1 text-sm w-[50px] h-[20px] bg-[#5F35F5] text-[#fff] rounded-[5px]"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleJoinReject(item)}
                    className="font-pop font-semibold text-sm w-[80px] h-[20px] bg-red-800 text-[#fff] rounded-[5px]"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          groupList.map((item) => (
            <div className="flex justify-between border-b pb-[13px]">
              <div className="flex mt-3">
                <picture>
                  <img
                    className="bg-[red] rounded-full w-[52px] h-[52px]"
                    src="images/pic.png"
                  />
                </picture>
                <div className="mt-[1px] pl-[5px]">
                  <h5 className="font-pop font-semibold text-[14px] leading-[27px] text-[#000000]">
                    {item.name}
                  </h5>
                  <p className="font-pop font-medium text-[12px] leading-[21px] text-[#4D4D4DBF]">
                    {item.tagline}
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => handleGroupJoin(item)}
                  className="font-pop font-semibold mr-1 text-sm w-[50px] h-[20px] bg-[#5F35F5] text-[#fff] rounded-[5px]"
                >
                  Info
                </button>

                <button className="font-pop font-semibold text-sm w-[80px] h-[20px] bg-[#5F35F5] text-[#fff] rounded-[5px]">
                  Members
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Mygroup;
