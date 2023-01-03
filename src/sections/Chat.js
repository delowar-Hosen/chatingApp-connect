import React, { useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import {
  set,
  ref,
  push,
  getDatabase,
  onValue,
  remove,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref as refer,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { ImCross } from "react-icons/im";
import { BsEmojiLaughingFill, BsReply } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import ReactDOM from "react-dom/client";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

const Chat = () => {
  const data = useSelector((state) => state.chatActive.value);

  const recorderControls = useAudioRecorder();

  const [msg, setMsg] = useState("");
  const [singleMsg, setSingleMsg] = useState([]);
  const [groupMsg, setGroupMsg] = useState([]);
  const [uplaod, setUplaod] = useState("");
  const [uplaodErr, setUplaodErr] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [replyShow, setReplyShow] = useState(false);
  const [emoji, setEmoji] = useState(false);
  const [singleImgPopup, setSingleImgPopup] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioData, setAudioData] = useState("");
  const [reply, setReply] = useState("");
  const [replySendername, setReplySendername] = useState("");
  const [replySenderid, setReplySenderid] = useState("");
  const [userOnline, setUserOnline] = useState([]);

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioData(blob);
    setAudioUrl(url);
  };

  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();

  let handleMsgField = (e) => {
    setMsg(e.target.value);
  };

  let handleMsg = () => {
    if (!reply) {
      if (data.status == "group") {
        set(push(ref(db, "groupmsg/")), {
          msgsenderid: auth.currentUser.uid,
          msgsendername: auth.currentUser.displayName,
          msgreciverid: data.id,
          msgrecivername: data.name,
          msg: msg,
          time: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}`,
        }).then(() => {
          setMsg("");
          setEmoji(false);
        });
      } else {
        set(push(ref(db, "singlemsg/")), {
          msgsenderid: auth.currentUser.uid,
          msgsendername: auth.currentUser.displayName,
          msgreciverid: data.id,
          msgrecivername: data.name,
          msg: msg,
          time: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}`,
        }).then(() => {
          setMsg("");
          setEmoji(false);
        });
      }
    }

    if (reply) {
      if (data.status == "single") {
        set(push(ref(db, "singlemsg/")), {
          msgsenderid: auth.currentUser.uid,
          msgsendername: auth.currentUser.displayName,
          msgreciverid: data.id,
          msgrecivername: data.name,
          replyrecivername: `You Replied To ${replySendername}`,
          replymsg: reply,
          msg: msg,
        }).then(() => {
          setReplySenderid("");
          setReplySendername("");
          setReply("");
          setMsg("");
        });
      } else {
        set(push(ref(db, "groupmsg/")), {
          msgsenderid: auth.currentUser.uid,
          msgsendername: auth.currentUser.displayName,
          msgreciverid: data.id,
          msgrecivername: data.name,
          replyrecivername: `${auth.currentUser.displayName} Replied To ${replySendername}`,
          replymsg: reply,
          msg: msg,
        }).then(() => {
          setReplySenderid("");
          setReplySendername("");
          setReply("");
          setMsg("");
        });
      }
    }
  };

  useEffect(() => {
    const groupRef = ref(db, "groupmsg/");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.id == item.val().msgreciverid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setGroupMsg(arr);
    });
  }, [data ? data.id : ""]);

  useEffect(() => {
    const statusRef = ref(db, "userstatus/");
    onValue(statusRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val());
      });
      setUserOnline(arr);
    });
  }, [data ? data.id : ""]);

  useEffect(() => {
    const groupRef = ref(db, "singlemsg/");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().msgsenderid == auth.currentUser.uid &&
            item.val().msgreciverid == data.id) ||
          (item.val().msgsenderid == data.id &&
            item.val().msgreciverid == auth.currentUser.uid)
        ) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setSingleMsg(arr);
    });
  }, [data ? data.id : ""]);

  let handleUploadState = (e) => {
    setUplaodErr("");
    setUplaod(e.target.files[0]);
  };

  let handleUpload = () => {
    if (!uplaod) {
      setUplaodErr("Please Select For Upload");
    } else {
      const storageRef = refer(storage, "images/" + uplaod.name);

      const uploadTask = uploadBytesResumable(storageRef, uplaod);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);

            if (uplaod != "") {
              if (data.status == "group") {
                set(push(ref(db, "groupmsg/")), {
                  msgsenderid: auth.currentUser.uid,
                  msgsendername: auth.currentUser.displayName,
                  msgreciverid: data.id,
                  msgrecivername: data.name,
                  img: downloadURL,
                  time: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}`,
                });
              } else {
                set(push(ref(db, "singlemsg/")), {
                  msgsenderid: auth.currentUser.uid,
                  msgsendername: auth.currentUser.displayName,
                  msgreciverid: data.id,
                  msgrecivername: data.name,
                  img: downloadURL,
                  time: `${new Date().getFullYear()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}`,
                }).then(() => {
                  setShow(false);
                });
              }
            }
          });
        }
      );
    }
  };

  let handleImagePopup = (item) => {
    console.log(item);
    setShow2(true);
    setSingleImgPopup(item.img);
    console.log(item.img);
  };

  let handleAudioSend = () => {
    const storageRef = refer(storage, "singleaudio/" + Math.random());
    uploadBytes(storageRef, audioData).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        console.log("File available at", downloadURL);
        if (data.status == "single") {
          set(push(ref(db, "singlemsg/")), {
            msgsenderid: auth.currentUser.uid,
            msgsendername: auth.currentUser.displayName,
            msgreciverid: data.id,
            msgrecivername: data.name,
            audio: audioUrl,
            time: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}`,
          }).then(() => {
            setAudioUrl("");
          });
        } else {
          set(push(ref(db, "groupmsg/")), {
            msgsenderid: auth.currentUser.uid,
            msgsendername: auth.currentUser.displayName,
            msgreciverid: data.id,
            msgrecivername: data.name,
            audio: audioUrl,
            time: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}`,
          }).then(() => {
            setAudioUrl("");
          });
        }
      });
    });
  };

  let handleDelete = (item) => {
    console.log(item);
    remove(ref(db, "singlemsg/" + item.key));
  };

  let handleReply = (item) => {
    console.log(item);
    setReply(item.msg);
    setReplySendername(item.msgsendername);
    setReplySenderid(item.msgsenderid);
  };

  return (
    <div className="relative shadow-2xl border rounded-[20px] pt-[20px] px-[20px] mt-[35px] ml-[43px]">
      <div className="flex justify-between border-b pb-[13px]">
        <div className="flex">
          <picture>
            <img
              className="bg-[red] rounded-full w-[70px] h-[70px]"
              src="images/pic.png"
            />
          </picture>
          <div className="mt-[12px] pl-[14px]">
            <h5 className="font-pop font-semibold text-[18px] leading-[27px] text-[#000000]">
              {data ? data.name : "Select a group or friends"}
            </h5>
            {userOnline.map((item) =>
              data.id == item.userid ? (
                <p className="font-pop font-medium text-[14px] leading-[21px] text-[#4D4D4DBF]">
                  Online
                </p>
              ) : (
                <p className="font-pop font-medium text-[14px] leading-[21px] text-[#4D4D4DBF]">
                  Ofline
                </p>
              )
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-[65vh] bg-[#FFFFFF] p-5  overflow-y-scroll  border-b ">
        {data && data.status == "single"
          ? singleMsg.map((item) =>
              item.msgsenderid == auth.currentUser.uid ? (
                item.msg ? (
                  <div className="mt-8 flex justify-end">
                    <div className="relative">
                      {item.replymsg && (
                        <div className=" p-1 absolute top-[-15px] left-[-130px]">
                          <div className="max-w-[200px] overflow-y-hidden overflow-x-hidden font-pop font-normal text-[10px] text-[#ad9e9edd]">
                            <p className="text-black">
                              {item.replyrecivername}
                            </p>
                            <p className="overflow-x-hidden">{item.replymsg}</p>
                          </div>
                        </div>
                      )}
                      {item.replymsg ? (
                        ""
                      ) : (
                        <p className="absolute top-[-15px] left-0 font-nunito font-light text-[10px]  ">
                          {item.msgsendername}
                        </p>
                      )}

                      <p className="font-nunito font-medium text-xl text-[#464343] bg-[#F1F1F1] inline-block p-3.5 rounded-xl">
                        {item.msg}
                      </p>

                      <AiOutlineDelete
                        onClick={() => handleDelete(item)}
                        className="absolute top-[20px] left-[-25px]"
                      />
                      <BsReply
                        onClick={() => handleReply(item)}
                        className="absolute top-[20px] left-[-50px] cursor-pointer"
                      />
                      <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ) : item.img ? (
                  <div className="mt-8 flex justify-end">
                    <div className="relative">
                      <p className="absolute top-[-15px] left-0 font-nunito font-light text-[10px]  ">
                        {item.msgsendername}
                      </p>
                      <p className="font-nunito font-medium text-xl text-white bg-primary inline-block p-3.5 rounded-xl">
                        <img
                          onClick={() => handleImagePopup(item)}
                          src={item.img}
                        />
                      </p>
                      <AiOutlineDelete
                        onClick={() => handleDelete(item)}
                        className="absolute top-[20px] left-[-25px]"
                      />
                      <BsReply
                        onClick={() => handleReply(item)}
                        className="absolute top-[20px] left-[-50px] cursor-pointer"
                      />
                      <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 flex justify-end">
                    <div className="relative">
                      <p className="absolute top-[-15px] left-0 font-nunito font-light text-[10px]  ">
                        {item.msgsendername}
                      </p>
                      <p className="relative font-nunito font-medium text-xl text-white bg-primary inline-block p-3.5 rounded-xl">
                        <audio controls src={item.audio}></audio>
                      </p>
                      <AiOutlineDelete
                        onClick={() => handleDelete(item)}
                        className="absolute top-[35px] left-[-25px]"
                      />
                      <BsReply
                        onClick={() => handleReply(item)}
                        className="absolute top-[20px] left-[-50px] cursor-pointer"
                      />
                      <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                )
              ) : item.msg ? (
                <div className="mt-8">
                  <div className="relative">
                    {item.replymsg ? (
                      ""
                    ) : (
                      <p className="absolute top-[-15px] left-0 font-nunito font-light text-[10px]  ">
                        {item.msgsendername}
                      </p>
                    )}
                    <p className="relative font-nunito font-medium text-xl bg-[#F1F1F1] inline-block p-3.5 rounded-xl">
                      {item.msg}
                      {item.replymsg && (
                        <div className=" p-1 absolute top-[-30px] right-[-130px]">
                          <div className="text-right max-w-[200px] overflow-y-hidden overflow-x-hidden font-pop font-normal text-[10px] text-[#ad9e9edd]">
                            <p className="text-black mb-[-13px] ">
                              {item.replyrecivername}
                            </p>
                            <p className="overflow-x-hidden ">
                              {item.replymsg}
                            </p>
                          </div>
                        </div>
                      )}
                      <AiOutlineDelete
                        onClick={() => handleDelete(item)}
                        className="absolute top-[20px] right-[-25px]"
                      />

                      <BsReply
                        onClick={() => handleReply(item)}
                        className="absolute top-[20px] right-[-50px] cursor-pointer"
                      />
                    </p>
                  </div>

                  <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                    {item.time}
                  </p>
                </div>
              ) : item.img ? (
                <div className="mt-5 relative">
                  <div className="relative">
                    <p className="absolute top-[-15px] left-0 font-nunito font-light text-[10px]  ">
                      {item.msgsendername}z
                    </p>
                    <p className="relative font-nunito font-medium text-xl bg-[#F1F1F1] inline-block p-3.5 rounded-xl">
                      <img
                        onClick={() => handleImagePopup(item)}
                        src={item.img}
                      />
                      <AiOutlineDelete
                        onClick={() => handleDelete(item)}
                        className="absolute top-[20px] right-[-25px]"
                      />
                      <BsReply
                        onClick={() => handleReply(item)}
                        className="absolute top-[20px] right-[-50px] cursor-pointer"
                      />
                    </p>
                  </div>

                  <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                    {item.time}
                  </p>
                </div>
              ) : (
                <div className="mt-5 relative">
                  <p className="absolute top-[-15px] left-0 font-nunito font-light text-[10px]  ">
                    {item.msgsendername}
                  </p>
                  <div>
                    <p className="relative font-nunito font-medium text-xl bg-[#F1F1F1] inline-block p-3.5 rounded-xl">
                      <audio controls src={item.audio}></audio>
                      <AiOutlineDelete
                        onClick={() => handleDelete(item)}
                        className="absolute top-[35px] right-[-25px]"
                      />
                      <BsReply
                        onClick={() => handleReply(item)}
                        className="absolute top-[20px] right-[-50px] cursor-pointer"
                      />
                    </p>
                  </div>

                  <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                    {item.time}
                  </p>
                </div>
              )
            )
          : groupMsg.map((item) =>
              item.msgsenderid == auth.currentUser.uid ? (
                item.msg ? (
                  <div className="mt-5 flex justify-end">
                    <div className="relative">
                      {item.replymsg && (
                        <div className=" p-1 absolute top-[-15px] left-[-130px]">
                          <div className="max-w-[200px] overflow-y-hidden overflow-x-hidden font-pop font-normal text-[10px] text-[#ad9e9edd]">
                            <p className="text-black">
                              {item.replyrecivername}
                            </p>
                            <p className="overflow-x-hidden">{item.replymsg}</p>
                          </div>
                        </div>
                      )}
                      {item.replymsg ? (
                        ""
                      ) : (
                        <p className="absolute top-[-15px] left-0 font-nunito font-light text-[10px]  ">
                          {item.msgsendername}
                        </p>
                      )}
                      <p className="relative font-nunito font-medium text-xl text-[#464343] bg-[#F1F1F1] inline-block p-3.5 rounded-xl">
                        {item.msg}
                        <AiOutlineDelete
                          onClick={() => handleDelete(item)}
                          className="absolute top-[20px] left-[-25px]"
                        />
                        <BsReply
                          onClick={() => handleReply(item)}
                          className="absolute top-[20px] left-[-50px] cursor-pointer"
                        />
                      </p>

                      <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ) : item.img ? (
                  <div className="mt-5 flex justify-end">
                    <div className="relative">
                      <p className="absolute top-[-15px] left-0 font-nunito font-light text-[10px]  ">
                        {item.msgsendername}
                      </p>
                      <p className="relative font-nunito font-medium text-xl text-white bg-primary inline-block p-3.5 rounded-xl">
                        <img
                          onClick={() => handleImagePopup(item)}
                          src={item.img}
                        />
                        <AiOutlineDelete
                          onClick={() => handleDelete(item)}
                          className="absolute top-[20px] left-[-25px]"
                        />
                        <BsReply
                          onClick={() => handleReply(item)}
                          className="absolute top-[20px] left-[-50px] cursor-pointer"
                        />
                      </p>

                      <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 flex justify-end">
                    <div className="relative">
                      <p className="absolute top-[-15px] left-0 font-nunito font-light text-[10px]  ">
                        {item.msgsendername}
                      </p>
                      <p className="relative font-nunito font-medium text-xl text-white bg-primary inline-block p-3.5 rounded-xl">
                        <audio controls src={item.audio}></audio>
                      </p>
                      <AiOutlineDelete
                        onClick={() => handleDelete(item)}
                        className="absolute top-[35px] left-[-25px]"
                      />
                      <BsReply
                        onClick={() => handleReply(item)}
                        className="absolute top-[20px] left-[-50px] cursor-pointer"
                      />
                      <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                )
              ) : item.msg ? (
                <div className="mt-5 relative">
                  {item.replymsg ? (
                    ""
                  ) : (
                    <p className="absolute top-[-15px] left-0 font-nunito font-light text-[10px]  ">
                      {item.msgsendername}
                    </p>
                  )}
                  <p className="relative font-nunito font-medium text-xl bg-[#F1F1F1] inline-block p-3.5 rounded-xl">
                    {item.msg}
                    {item.replymsg && (
                      <div className=" p-1 absolute top-[-30px] right-[-130px]">
                        <div className="text-right max-w-[200px] overflow-y-hidden overflow-x-hidden font-pop font-normal text-[10px] text-[#ad9e9edd]">
                          <p className="text-black mb-[-13px] ">
                            {item.replyrecivername}
                          </p>
                          <p className="overflow-x-hidden ">{item.replymsg}</p>
                        </div>
                      </div>
                    )}

                    <AiOutlineDelete
                      onClick={() => handleDelete(item)}
                      className="absolute top-[20px] right-[-25px]"
                    />
                    <BsReply
                      onClick={() => handleReply(item)}
                      className="absolute top-[20px] right-[-50px] cursor-pointer"
                    />
                  </p>

                  <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                    {item.time}
                  </p>
                </div>
              ) : item.img ? (
                <div className="mt-5 relative">
                  <p className="absolute top-[-15px] left-0 font-nunito font-light text-[10px]  ">
                    {item.msgsendername}
                  </p>
                  <p className="relative font-nunito font-medium text-xl bg-[#F1F1F1] inline-block p-3.5 rounded-xl">
                    <img
                      onClick={() => handleImagePopup(item)}
                      src={item.img}
                    />
                    <AiOutlineDelete
                      onClick={() => handleDelete(item)}
                      className="absolute top-[20px] right-[-25px]"
                    />
                    <BsReply
                      onClick={() => handleReply(item)}
                      className="absolute top-[20px] right-[-50px] cursor-pointer"
                    />
                  </p>

                  <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                    {item.time}
                  </p>
                </div>
              ) : (
                <div className="mt-5 relative">
                  <p className="absolute top-[-15px] left-0 font-nunito font-light text-[10px]  ">
                    {item.msgsendername}
                  </p>
                  <div>
                    <p className="relative font-nunito font-medium text-xl bg-[#F1F1F1] inline-block p-3.5 rounded-xl">
                      <audio controls src={item.audio}></audio>
                      <AiOutlineDelete
                        onClick={() => handleDelete(item)}
                        className="absolute top-[35px] right-[-25px]"
                      />
                      <BsReply
                        onClick={() => handleReply(item)}
                        className="absolute top-[20px] right-[-50px] cursor-pointer"
                      />
                    </p>
                  </div>

                  <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                    {item.time}
                  </p>
                </div>
              )
            )}
      </div>

      <div className="mt-8 mb-6 flex  ">
        {reply && (
          <div className="w-[60%] font-pop font-normal text-[12px] text-[#ad9e9edd] absolute bottom-[68px] left-[30px]">
            <p className="text-black">{`You Replaying To ${replySendername}`}</p>
            <p className="overflow-x-auto">{reply}</p>
            <ImCross
              onClick={() => setReply("")}
              className="text-black absolute bottom-[18px] right-0"
            />
          </div>
        )}
        <input
          onChange={handleMsgField}
          className=" w-[70%] font-pop font-normal p-3 text-sm capitalize bg-[#F1F1F1] rounded-[10px] "
          placeholder="msg"
          value={msg}
        />
        {audioUrl && (
          <div>
            <audio
              className="absolute bottom-[23px] right-[368px] w-[40%] h-[46px]"
              controls
              src={audioUrl}
            ></audio>
            <button
              onClick={handleAudioSend}
              className="absolute  bottom-[24px] text-white rounded-[10px]  bg-blue-500 right-[304px] font-pop font-normal p-3 text-sm"
            >
              Send
            </button>
            <button
              onClick={() => setAudioUrl("")}
              className="absolute  bottom-[24px] text-white rounded-[10px]  bg-red-800 right-[68px] font-pop font-normal py-3 px-20 text-sm z-10"
            >
              Remove
            </button>
          </div>
        )}

        <div className="absolute bottom-[28px] right-[20px] z-10">
          <AudioRecorder
            onRecordingComplete={(blob) => addAudioElement(blob)}
            recorderControls={recorderControls}
          />
        </div>

        <div
          onClick={() => setShow(true)}
          className="w-[45px] ml-5  h-[40px] bg-[#5f1899] text-base text-white rounded-[10px] flex items-center justify-center"
        >
          <AiOutlineCloudUpload />
        </div>
        {emoji && (
          <div className="absolute bottom-[70px] right-0">
            <EmojiPicker onEmojiClick={(e) => setMsg(msg + e.emoji)} />
          </div>
        )}

        <BsEmojiLaughingFill
          onClick={() => setEmoji(!emoji)}
          className="absolute bottom-[40px] right-[215px] text-red-600 cursor-pointer"
        />

        <div
          onClick={handleMsg}
          className="w-[45px]  ml-5 h-[40px] bg-[#5F35F5] text-base text-white rounded-[10px] flex items-center justify-center"
        >
          <FiSend />
        </div>
      </div>
      {show && (
        <div className="w-full h-full bg-[#3331314b] absolute top-0 left-0 flex justify-center items-center rounded-xl ">
          <div className="w-[300px] h-[300px] bg-white p-10 rounded-xl">
            {uplaodErr && (
              <h3 className="text-center  font-nunito font-semibold text-xl text-[#d84343] ">
                {uplaodErr}
              </h3>
            )}
            <h3 className="text-center py-4 font-nunito font-semibold text-4xl text-[#131212] ">
              Upload
            </h3>
            <input
              className="block mb-8"
              onChange={handleUploadState}
              type="file"
            />
            <div className="flex justify-between">
              <button
                onClick={handleUpload}
                className=" border border-[#11175D] bg-[#5F35F5] rounded-lg w-[80px] px-4 py-2 font-nunito font-semibold text-base text-[#FFFFFF] "
                type="button"
              >
                Upload
              </button>
              <button
                onClick={() => setShow(false)}
                className="border border-[#11175D] bg-[#5F35F5] rounded-lg w-[80px] px-4 py-2 font-nunito font-semibold text-base text-[#FFFFFF] "
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {show2 && (
        <div
          onClick={() => setShow2(false)}
          className="w-full h-full bg-[#3331314b] absolute top-0 left-0 flex justify-center items-center rounded-xl "
        >
          <picture>
            <img
              className="w-[500px] h-auto rounded-lg border-8 border-white"
              src={singleImgPopup}
            />
          </picture>
          <button
            onClick={() => setShow2(false)}
            className="absolute top-8 right-8 border border-[#11175D] rounded-lg  px-4 py-2 font-nunito font-semibold text-base text-[#FFFFFF] "
            type="button"
          >
            <ImCross />
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
