import React, { useEffect } from "react";
import { useState } from "react";
import Search from "./Search";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  db,
  ref as refer,
  set,
  Push,
  onValue,
} from "firebase/database";
import { IoIosNotifications } from "react-icons/io";

const UserNotify = () => {
  const [notification, setNotification] = useState([]);

  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const notificationRef = refer(db, "notification/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (auth.currentUser.uid == item.val().reciverid) {
          arr.push(item.val());
        }
      });
      setNotification(arr);
    });
  }, []);
  return (
    <div className="mt-[20px] ml-[43px] h-[95vh]  overflow-y-auto">
      <Search className="drop-shadow rounded-[20px] py-[10px] px-[78px] outline-0 w-full" />
      {notification.map((item) => (
        <p className="flex  items-center py-4 border-b border-[#44424260]">
          <IoIosNotifications className="text-4xl mr-12" />
          <span className="font-pop text-base font-medium">{item.state}</span>
        </p>
      ))}
    </div>
  );
};

export default UserNotify;
