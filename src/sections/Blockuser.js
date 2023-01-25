import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
} from "firebase/database";
import { useEffect } from "react";
import { useState } from "react";
import { getAuth } from "firebase/auth";
const Blockuser = () => {
  const [blockList, setBlockList] = useState([]);

  const db = getDatabase();
  const auth = getAuth();

  useEffect(() => {
    const friendRef = ref(db, "blockusers/");
    onValue(friendRef, (snapshot) => {
      let blockArr = [];
      snapshot.forEach((item) => {
        if (item.val().blockby == auth.currentUser.uid) {
          blockArr.push({
            id: item.key,
            block: item.val().blockid,
            blockname: item.val().blockname,
          });
        } else {
          blockArr.push({
            id: item.key,
            blockby: item.val().blockby,
            blockname: item.val().blockbyname,
          });
        }
      });
      setBlockList(blockArr);
    });
  }, []);

  let handleUnblock = (item) => {
    // console.log(item);
    set(push(ref(db, "friends/")), {
      id: item.id,
      sendername: item.blockname,
      senderid: item.block,
      recivername: auth.currentUser.displayName,
      reciverid: auth.currentUser.uid,
      date: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
    }).then(() => {
      remove(ref(db, "blockusers/" + item.id));
    });

    set(push(ref(db, "notification/")), {
      senderid: auth.currentUser.uid,
      sendername: auth.currentUser.displayName,
      reciverid: item.block,
      recivername: item.blockname,
      state: `${item.blockname} unblock you from his friends block list `,
    });
  };
  return (
    <div className="mt-[30px] xl:ml-[19px]">
      <div className="w-full h-[40vh] overflow-y-scroll shadow-2xl border rounded-[20px] py-[20px] px-[20px]">
        <div className="flex justify-between mb-[17px]">
          <h2 className="font-pop font-semibold text-xl ">Blocked Users</h2>
          <BsThreeDotsVertical className="text-[#5F35F5] mt-[5px]" />
        </div>
        {blockList.map((item) => (
          <div className="flex justify-between border-b pb-[9px]">
            <div className="flex">
              <picture>
                <img
                  className="bg-[red] rounded-full w-[52px] h-[52px]"
                  src="images/pic.png"
                />
              </picture>
              <div className="mt-[5px] pl-[10px]">
                <h5 className="font-pop font-semibold text-[14px] leading-[21px] ">
                  {item.blockname}
                </h5>
                <p className="font-pop font-medium text-[10px]  rounded-[5px] mr-[12px]">
                  Today, 8:56pm
                </p>
              </div>
            </div>

            {!item.blockby && (
              <button
                onClick={() => handleUnblock(item)}
                className="font-pop font-semibold text-xl w-[100px] h-[30px] bg-[#5F35F5]  mt-[5px] rounded-[5px] mr-[12px]"
              >
                unblock
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blockuser;
