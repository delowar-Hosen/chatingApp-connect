import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getStorage,
  uploadString,
  getDownloadURL,
  ref as refer,
} from "firebase/storage";

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
import { getAuth, updateProfile } from "firebase/auth";
import { ThreeDots } from "react-loader-spinner";
import { useRef } from "react";

const Mygroup = () => {
  const [groupList, setGroupList] = useState([]);
  const [groupJoinList, setGroupJoinList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [info, setInfo] = useState(false);
  const [memberinfo, setMemberInfo] = useState(false);
  const [uploadPage, setUploadPage] = useState(false);
  const [profilePicChange, setProfilePicChange] = useState("");
  const [uploadTargetPic, setUploadTargetPic] = useState("");
  const [cropper, setCropper] = useState();
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [gName, setGname] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [groupId, setGroupId] = useState("");

  const auth = getAuth();
  const db = getDatabase();
  const cropperRef = useRef();
  const storage = getStorage();

  let handleImageUpload = (e) => {
    setFileName(e.target.files[0].name);
    let file;
    if (e.dataTransfer) {
      file = e.dataTransfer.files;
    } else if (e.target) {
      file = e.target.files;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setUploadTargetPic(reader.result);
    };

    reader.readAsDataURL(file[0]);
  };

  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    setProfilePicChange(cropper.getCroppedCanvas().toDataURL());
  };

  const getCropData = () => {
    setLoading(true);
    const storageRef = refer(storage, `${auth.currentUser.uid}/${fileName}`);
    if (typeof cropper !== "undefined") {
      cropper.getCroppedCanvas().toDataURL();
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);

          remove(ref(db, "group/" + groupId))
            .then(() => {
              set(push(ref(db, "group/")), {
                gname: gName,
                tagline: tagLine,
                adminname: auth.currentUser.displayName,
                adminid: auth.currentUser.uid,
                groupPic: downloadURL,
              });
            })

            .then(() => {
              setLoading(false);
              setUploadPage(false);
              setProfilePicChange("");
              setUploadTargetPic("");
              console.log("Group Picture Update Successfully");
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    }
  };

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
    // console.log(item);
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
    set(push(ref(db, "notification/")), {
      senderid: item.adminid,
      sendername: item.adminname,
      reciverid: item.senderid,
      recivername: item.sendername,
      state: "Reject group join request",
    });
  };

  let handleJoinAccept = (item) => {
    // console.log(item);
    set(push(ref(db, "groupmembers/")), {
      adminid: item.adminid,
      adminname: item.adminname,
      gkey: item.gkey,
      groupid: item.groupid,
      gtagline: item.gtagline,
      senderid: item.senderid,
      sendername: item.sendername,
      senderprofilepic: item.senderprofilepic,
      gname: item.gname,
    })
      .then(() => {
        remove(ref(db, "groupjoinrequest/" + item.gkey));
      })
      .then(() => {
        set(push(ref(db, "notification/")), {
          senderid: item.adminid,
          sendername: item.adminname,
          reciverid: item.senderid,
          recivername: item.sendername,
          state: "Accept group join request",
        });
      });
  };

  let handleMember = (item) => {
    // console.log(item);
    setMemberInfo(true);
    const memberRef = ref(db, "groupmembers/");
    onValue(memberRef, (snapshot) => {
      let memberArr = [];
      snapshot.forEach((gitem) => {
        if (item.groupid == gitem.val().groupid) {
          memberArr.push({ ...gitem.val(), key: gitem.key });
        }
      });
      setMemberList(memberArr);
    });
  };

  let handleMemberRemove = (item) => {
    // console.log(item);
    remove(ref(db, "groupmembers/" + item.key));
    set(push(ref(db, "notification/")), {
      senderid: item.adminid,
      sendername: item.adminname,
      reciverid: item.senderid,
      recivername: item.sendername,
      state: "Remove from group",
    });
  };

  let handleImagepageCancel = () => {
    setProfilePicChange("");
    setUploadTargetPic("");
    setUploadPage(false);
  };

  let handleGroupPic = (item) => {
    console.log(item);
    setGname(item.gname);
    setTagLine(item.tagline);
    setGroupId(item.groupid);
    setUploadPage(true);
  };

  return (
    <div className="mt-[30px] xl:ml-[22px]">
      <div className="w-full shadow-2xl border rounded-[20px] py-[20px] px-[20px]  h-[40vh] overflow-y-scroll">
        <div className="flex justify-between mb-[5px]">
          <h2 className="font-pop font-semibold text-xl ">My Groups</h2>
          <BsThreeDotsVertical className="text-[#5F35F5] mt-[5px]" />
        </div>
        {info ? (
          <div>
            <button
              onClick={() => setInfo(false)}
              className="font-pop font-semibold mr-1 text-sm w-[50px] h-[20px] bg-[#5F35F5]  rounded-[5px]"
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

                  <div className="mt-[10px] pl-[5px]">
                    <h5 className="font-pop font-semibold text-[14px] leading-[27px] ">
                      {item.sendername}
                    </h5>
                    {/* <p className="font-pop font-medium text-[12px] leading-[21px] text-[#4D4D4DBF]">
                      {item.gtagline}
                    </p> */}
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => handleJoinAccept(item)}
                    className="font-pop font-semibold mr-1 text-sm w-[50px] h-[20px] bg-[#5F35F5]  rounded-[5px]"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleJoinReject(item)}
                    className="font-pop font-semibold text-sm w-[80px] h-[20px] bg-red-800  rounded-[5px]"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : memberinfo ? (
          <div>
            <button
              onClick={() => setMemberInfo(false)}
              className="font-pop font-semibold mr-1 text-sm w-[50px] h-[20px] bg-[#5F35F5]  rounded-[5px]"
            >
              Back
            </button>
            {memberList.map((item) => (
              <div className="flex justify-between border-b pb-[13px]">
                <div className="flex mt-3">
                  <picture className="rounded-full w-[52px] h-[52px]">
                    <img
                      className="rounded-full w-[52px] h-[52px]"
                      src={item.senderprofilepic}
                    />
                  </picture>
                  <div className="mt-[1px] pl-[5px]">
                    <h5 className="font-pop font-semibold text-[14px] leading-[27px] ">
                      {item.sendername}
                    </h5>
                    <p className="font-pop font-medium text-[12px] leading-[21px] ">
                      {item.gtagline}
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => handleMemberRemove(item)}
                    className="font-pop font-semibold text-sm w-[80px] h-[20px] bg-red-800  rounded-[5px]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          groupList.map((item) => (
            <div className="flex justify-between border-b pb-[13px]">
              <div className="flex mt-3">
                <div className="relative group">
                  <picture>
                    <img
                      className="bg-[red] rounded-full w-[52px] h-[52px]"
                      src={item.groupPic}
                    />
                  </picture>
                  <div className="  absolute top-0 hidden ease-in   group-hover:flex left-0 rounded-full w-[52px] h-[52px] bg-red-400 flex justify-center items-center ">
                    <AiOutlineCloudUpload
                      onClick={() => handleGroupPic(item)}
                      className="text-2xl cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mt-[1px] pl-[5px]">
                  <h5 className="font-pop font-semibold text-[14px] leading-[27px] ">
                    {item.gname}
                  </h5>
                  <p className="font-pop font-medium text-[12px] leading-[21px] ">
                    {item.tagline}
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => handleGroupJoin(item)}
                  className="font-pop font-semibold mr-1 text-sm w-[50px] h-[20px] bg-[#5F35F5]  rounded-[5px]"
                >
                  Info
                </button>

                <button
                  onClick={() => handleMember(item)}
                  className="font-pop font-semibold text-sm w-[80px] h-[20px] bg-[#5F35F5]  rounded-[5px]"
                >
                  Members
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {uploadPage && (
        <div className="w-full h-full bg-[#EA6C00] flex justify-center items-center fixed top-0 left-0 z-30 flex-col ">
          <div className=" rounded-full overflow-hidden bg-red-400 flex justify-center items-center">
            {profilePicChange ? (
              <picture>
                <img
                  className="w-[100px] h-[100px] rounded-full object-cover  "
                  src={profilePicChange}
                />
              </picture>
            ) : (
              <picture>
                <img
                  className="w-[100px] h-[100px] rounded-full object-cover  "
                  src={auth.currentUser.photoURL}
                />
              </picture>
            )}
          </div>
          <h3 className="py-4 font-nunito font-semibold text-4xl ">
            Change Group Profile Picture
          </h3>
          <div className="mb-10 flex flex-col">
            <input
              className="mb-5 border border-[#03014C] rounded-lg outline-0 w-[368px] px-5 py-5 font-nunito font-semibold text-xl  "
              type="file"
              onChange={handleImageUpload}
            />
            {uploadTargetPic && (
              <Cropper
                src={uploadTargetPic}
                style={{
                  height: 100,
                  width: 200,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "80px",
                  marginBottom: "20px",
                }}
                // Cropper.js options
                initialAspectRatio={4 / 1}
                guides={false}
                crop={onCrop}
                ref={cropperRef}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
              />
            )}

            {loading ? (
              <button
                onClick={getCropData}
                className="border border-[#11175D] bg-[#5F35F5] rounded-lg w-[368px] flex justify-center"
                type="button"
              >
                <ThreeDots
                  height="80"
                  width="80"
                  radius="9"
                  color="#EA6C00"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </button>
            ) : (
              <button
                onClick={getCropData}
                className="border border-[#11175D] bg-[#5F35F5] rounded-lg w-[368px] px-12 py-4 font-nunito font-semibold text-xl  "
                type="button"
              >
                Upload
              </button>
            )}

            <button
              className="text-4xl  absolute top-[50px] right-[100px]  "
              type="button"
              onClick={handleImagepageCancel}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mygroup;
