import React from "react";
import { useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
} from "firebase/database";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { BsChatRightText } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { chatActive } from "../slice/ActiveChat";

const Friendslist = (props) => {
  const [frienList, setFriendList] = useState([]);

  const db = getDatabase();
  const auth = getAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const friendRef = ref(db, "friends/");
    onValue(friendRef, (snapshot) => {
      let friendArr = [];
      snapshot.forEach((item) => {
        if (
          auth.currentUser.uid == item.val().senderid ||
          auth.currentUser.uid == item.val().reciverid
        ) {
          friendArr.push({ ...item.val(), key: item.key });
        }
      });

      setFriendList(friendArr);
    });
  }, []);

  let handleBlock = (item) => {
    if (auth.currentUser.uid == item.senderid) {
      set(push(ref(db, "blockusers/")), {
        blockname: item.recivername,
        blockid: item.reciverid,
        blockby: item.senderid,
        blockbyname: item.sendername,
      })
        .then(() => {
          remove(ref(db, "friends/" + item.key));
        })
        .then(() => {
          set(push(ref(db, "notification/")), {
            recivername: item.recivername,
            reciverid: item.reciverid,
            senderid: item.senderid,
            sendername: item.sendername,
            state: "block",
          });
        });
    } else {
      set(push(ref(db, "blockusers/")), {
        blockname: item.sendername,
        blockid: item.senderid,
        blockby: item.reciverid,
        blockbyname: item.recivername,
      })
        .then(() => {
          remove(ref(db, "friends/" + item.key));
        })
        .then(() => {
          set(push(ref(db, "notification/")), {
            recivername: item.sendername,
            reciverid: item.senderid,
            senderid: item.reciverid,
            sendername: item.recivername,
            state: "block",
          });
        });
    }
  };

  let handleChat = (item) => {
    console.log(item);
    let userInfo = {};

    if (item.senderid == auth.currentUser.uid) {
      userInfo.status = "single";
      userInfo.name = item.recivername;
      userInfo.id = item.reciverid;
      // userInfo.pic;
    } else {
      userInfo.status = "single";
      userInfo.name = item.sendername;
      userInfo.id = item.senderid;
    }
    dispatch(chatActive(userInfo));
  };
  return (
    <>
      <div className="mt-[20px] ml-[43px]">
        <div className="w-full shadow-2xl border rounded-[20px] py-[20px] px-[20px] h-[47vh] overflow-y-scroll">
          <div className="flex justify-between mb-[17px]">
            <h2 className="font-pop font-semibold text-xl text-[#000000]">
              Friends
            </h2>
            <BsThreeDotsVertical className="text-[#5F35F5] mt-[5px]" />
          </div>
          {frienList.map((item) => (
            <div className="flex justify-between border-b pb-[13px]">
              <div className="flex">
                <picture>
                  <img
                    className="bg-[red] rounded-full w-[52px] h-[52px]"
                    src={auth.currentUser.photoURL}
                  />
                </picture>
                <div className=" pl-[14px]">
                  {auth.currentUser.uid == item.senderid ? (
                    <h5 className="font-pop font-semibold text-[14px] leading-[27px] text-[#000000]">
                      {item.recivername}
                    </h5>
                  ) : (
                    <h5 className="font-pop font-semibold text-[14px] leading-[27px] text-[#000000]">
                      {item.sendername}
                    </h5>
                  )}

                  <p className="font-pop font-medium text-[12px] leading-[21px] text-[#4D4D4DBF]">
                    {item.date}
                  </p>
                </div>
              </div>
              {props.chat ? (
                <button
                  onClick={() => handleChat(item)}
                  className="font-pop font-semibold text-sm w-[30px] h-[20px] flex justify-center items-center bg-[#5F35F5] text-[#fff] mt-[12px] rounded-[5px] mr-[12px]"
                >
                  <BsChatRightText />
                </button>
              ) : (
                <button
                  onClick={() => handleBlock(item)}
                  className="font-pop font-semibold text-sm w-[50px] h-[20px] bg-[#5F35F5] text-[#fff] mt-[12px] rounded-[5px] mr-[12px]"
                >
                  block
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Friendslist;
