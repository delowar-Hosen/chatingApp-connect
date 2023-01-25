import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useEffect } from "react";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import Search from "./Search";

const Userlist = () => {
  const [userList, setUserList] = useState([]);
  const [friendReqList, setFriendReqList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [blockUser, setBlockUser] = useState([]);
  const [searchUser, setSearchUser] = useState([]);

  const db = getDatabase();
  const auth = getAuth();

  let handleFriendRequest = (item) => {
    set(push(ref(db, "friend-Request/")), {
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      reciverId: item.id,
      reciverName: item.name,
    });

    set(push(ref(db, "notification/")), {
      senderid: auth.currentUser.uid,
      sendername: auth.currentUser.displayName,
      reciverid: item.id,
      recivername: item.name,
      state: "friend request",
    });
  };

  useEffect(() => {
    const friendRef = ref(db, "blockusers/");
    onValue(friendRef, (snapshot) => {
      let blockArr = [];
      snapshot.forEach((item) => {
        blockArr.push(item.val().blockid + item.val().blockby);
      });
      setBlockUser(blockArr);
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      let userArr = [];
      snapshot.forEach((item) => {
        if (item.key !== auth.currentUser.uid) {
          userArr.push({ ...item.val(), id: item.key });
        }
      });
      setUserList(userArr);
    });
  }, []);

  useEffect(() => {
    const friendRef = ref(db, "friends/");
    onValue(friendRef, (snapshot) => {
      let friendArr = [];
      snapshot.forEach((item) => {
        friendArr.push(item.val().reciverid + item.val().senderid);
      });
      setFriendList(friendArr);
    });
  }, []);

  useEffect(() => {
    const friendRef = ref(db, "friend-Request/");
    onValue(friendRef, (snapshot) => {
      let friendArr = [];
      snapshot.forEach((item) => {
        friendArr.push(item.val().reciverId + item.val().senderId);
      });
      setFriendReqList(friendArr);
    });
  }, []);

  let arr = [];

  let handleSearchState = (e) => {
    console.log(e.target.value);

    userList.filter((item) => {
      if (item.name.toLowerCase().includes(e.target.value.toLowerCase())) {
        arr.push(item);
      } else {
        arr = [];
      }
      setSearchUser(arr);
    });
  };
  return (
    <>
      <div className="mt-[20px] xl:ml-[19px]">
        <div className="w-full h-[47vh] overflow-y-scroll shadow-2xl border rounded-[20px] py-[20px] px-[20px]">
          <div className="flex justify-between mb-[17px]">
            <h2 className="font-pop font-semibold text-xl ">User List</h2>
            <Search
              state={handleSearchState}
              className=" py-2 px-8 outline-1 w-40 "
            />
          </div>
          {searchUser.length > 0
            ? searchUser.map((item) => (
                <div className="flex justify-between  mt-[10px] border-b pb-[9px]">
                  <div className="flex">
                    <picture>
                      <img
                        className="rounded-full w-[40px] h-[40px]"
                        src={item.photoURL}
                      />
                    </picture>
                    <div className="mt-[5px] pl-[10px]">
                      <h5 className=" font-pop font-semibold text-[14px] leading-[21px] ">
                        {item.name}
                      </h5>
                      <p className="font-pop font-medium text-[10px] rounded-[5px] ">
                        {item.email}
                      </p>
                    </div>
                  </div>
                  {friendList.includes(auth.currentUser.uid + item.id) ||
                  friendList.includes(item.id + auth.currentUser.uid) ? (
                    <button className="font-pop font-normal text-[10px] text-white bg-[#5F35F5] h-[20px] rounded-[5px] mt-4 px-1 py-1 flex items-center">
                      Friend
                    </button>
                  ) : friendReqList.includes(auth.currentUser.uid + item.id) ||
                    friendReqList.includes(item.id + auth.currentUser.uid) ? (
                    <button className="font-pop font-normal text-[10px] bg-[#5F35F5] h-[20px] rounded-[5px] mt-4 px-1 py-1flex items-center">
                      Pending
                    </button>
                  ) : blockUser.includes(item.id + auth.currentUser.uid) ||
                    blockUser.includes(auth.currentUser.uid + item.id) ? (
                    <button className="font-pop font-normal text-[10px] bg-[#5F35F5] h-[20px] rounded-[5px] mt-4 px-1 py-1 flex items-center">
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFriendRequest(item)}
                      className="font-pop font-normal text-[10px] bg-[#5F35F5] h-[20px] rounded-[5px] mt-4 px-1 py-1  flex items-center"
                    >
                      Send Request
                    </button>
                  )}
                </div>
              ))
            : userList.map((item) => (
                <div className="flex justify-between  mt-[10px] border-b pb-[9px]">
                  <div className="flex">
                    <picture>
                      <img
                        className="rounded-full w-[52px] h-[52px]"
                        src={item.photoURL}
                      />
                    </picture>
                    <div className="mt-[5px] pl-[10px]">
                      <h5 className="font-pop font-semibold text-[14px] leading-[21px] ">
                        {item.name}
                      </h5>
                      <p className="font-pop font-medium text-[10px]  rounded-[5px] ">
                        {item.email}
                      </p>
                    </div>
                  </div>
                  {friendList.includes(auth.currentUser.uid + item.id) ||
                  friendList.includes(item.id + auth.currentUser.uid) ? (
                    <button className="font-pop font-normal text-[10px] bg-[#5F35F5] h-[20px] rounded-[5px] mt-4 px-1 py-1 flex items-center">
                      Friend
                    </button>
                  ) : friendReqList.includes(auth.currentUser.uid + item.id) ||
                    friendReqList.includes(item.id + auth.currentUser.uid) ? (
                    <button className="font-pop font-normal text-[10px] bg-[#5F35F5] h-[20px] rounded-[5px] mt-4 px-1 py-1 flex items-center">
                      Pending
                    </button>
                  ) : blockUser.includes(item.id + auth.currentUser.uid) ||
                    blockUser.includes(auth.currentUser.uid + item.id) ? (
                    <button className="font-pop font-normal text-[10px] bg-[#5F35F5] h-[20px] rounded-[5px] mt-4 px-1 py-1 flex items-center">
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFriendRequest(item)}
                      className="font-pop font-normal text-[10px] bg-[#5F35F5] h-[20px] rounded-[5px] mt-4 px-1 py-1 flex items-center"
                    >
                      Send Request
                    </button>
                  )}
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

export default Userlist;
