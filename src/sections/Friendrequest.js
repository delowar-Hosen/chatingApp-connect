import React from "react";
import { useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { useState } from "react";
const Friendrequest = () => {
  const [friendReq, setFriendReq] = useState([]);

  const db = getDatabase();
  const auth = getAuth();

  useEffect(() => {
    const friendReqRef = ref(db, "friend-Request/");
    onValue(friendReqRef, (snapshot) => {
      let friendReqArr = [];
      snapshot.forEach((item) => {
        if (item.val().reciverId == auth.currentUser.uid)
          friendReqArr.push({ ...item.val(), id: item.key });
      });
      setFriendReq(friendReqArr);
    });
  }, []);

  let handleReqAccept = (item) => {
    set(push(ref(db, "friends/")), {
      id: item.id,
      sendername: item.senderName,
      senderid: item.senderId,
      recivername: item.reciverName,
      reciverid: item.reciverId,
      date: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
    })
      .then(() => {
        remove(ref(db, "friend-Request/" + item.id));
      })
      .then(() => {
        set(push(ref(db, "notification/")), {
          senderid: auth.currentUser.uid,
          sendername: auth.currentUser.displayName,
          reciverid: item.senderId,
          recivername: item.senderName,
          state: `${auth.currentUser.displayName} send you a friend request`,
        });
      });
  };
  return (
    <div className="mt-[30px] xl:ml-[43px]">
      <div className="w-full  h-[40vh] overflow-y-scroll shadow-2xl border rounded-[20px] py-[20px] px-[20px]">
        <div className="flex justify-between mb-[17px]">
          <h2 className="font-pop font-semibold text-xl ">Friend Request</h2>
          <BsThreeDotsVertical className="text-[#5F35F5] mt-[5px]" />
        </div>
        {friendReq.map((item) => (
          <div className="flex justify-between mt-[14px] ">
            <div className="flex">
              <picture>
                <img
                  className="bg-[red] rounded-full w-[70px] h-[70px]"
                  src="images/pic.png"
                />
              </picture>
              <div className="xl:mt-[12px] pl-[14px]">
                <h5 className="font-pop font-semibold text-[18px] leading-[27px]">
                  {item.senderName}
                </h5>
                <p className="font-pop font-medium text-[14px] leading-[21px] ">
                  Dinner?
                </p>
              </div>
            </div>

            <button
              onClick={() => handleReqAccept(item)}
              className="font-pop font-semibold text-xl w-[87px] h-[30px] bg-[#5F35F5]  mt-[20px] rounded-[5px] mr-[12px]"
            >
              Accept
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friendrequest;
