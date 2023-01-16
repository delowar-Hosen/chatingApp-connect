import React, { useState, useRef, useEffect } from "react";
import { SlHome } from "react-icons/sl";
import {
  AiOutlineMessage,
  AiOutlineSetting,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import { IoIosNotificationsOutline } from "react-icons/io";
import { GoPrimitiveDot } from "react-icons/go";
import { MdLogout } from "react-icons/md";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { ThreeDots } from "react-loader-spinner";
import {
  getDatabase,
  ref as refer,
  set,
  push,
  remove,
  onValue,
} from "firebase/database";

const Sidebar = ({ active }) => {
  const [uploadPage, setUploadPage] = useState(false);
  const [profilePicChange, setProfilePicChange] = useState("");
  const [uploadTargetPic, setUploadTargetPic] = useState("");
  const [cropper, setCropper] = useState();
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [noti, setNoti] = useState([]);

  const cropperRef = useRef();
  const auth = getAuth();
  let navigate = useNavigate();
  const storage = getStorage();
  const db = getDatabase();

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

  let handleLogout = () => {
    let id = auth.currentUser.uid;

    signOut(auth)
      .then(() => {
        toast("Sign out Sucessfully !");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        const groupRef = refer(db, "userstatus/");
        onValue(groupRef, (snapshot) => {
          snapshot.forEach((item) => {
            if (item.val().userid == id) {
              remove(refer(db, "userstatus/" + item.key));
            }
          });
        });
      });
  };

  let handleImagepageCancel = () => {
    setProfilePicChange("");
    setUploadTargetPic("");
    setUploadPage(false);
  };

  const getCropData = () => {
    setLoading(true);
    const storageRef = ref(storage, `${auth.currentUser.uid}/${fileName}`);
    if (typeof cropper !== "undefined") {
      cropper.getCroppedCanvas().toDataURL();
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          })
            .then(() => {
              setLoading(false);
              setUploadPage(false);
              setProfilePicChange("");
              setUploadTargetPic("");
              console.log("Profile Picture Update Successfully");
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    }
  };

  useEffect(() => {
    const notificationRef = refer(db, "notification/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (auth.currentUser.uid == item.val().reciverid) {
          arr.push(item.val());
        }
      });
      set(push(refer(db, "notify-user/")), {
        notifyreciver: auth.currentUser.uid,
        length: arr.length,
      });
    });
  }, []);

  useEffect(() => {
    const notificationRef = refer(db, "notify-user/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (auth.currentUser.uid == item.val().notifyreciver) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setNoti(arr);
    });
  }, []);

  let handleNotify = () => {
    const groupRef = refer(db, "notify-user/");
    onValue(groupRef, (snapshot) => {
      snapshot.forEach((item) => {
        if (item.val().notifyreciver == auth.currentUser.uid) {
          remove(refer(db, "notify-user/" + item.key));
        }
      });
    });
  };

  return (
    <div className="bg-[#5F35F5] rounded-[20px] mt-[20px] w-full h-[96vh]  overflow-x-hidden ">
      <ToastContainer />
      <div className="px-11 pt-5 pb-[20px] relative group ">
        <picture>
          <img
            className=" rounded-full object-cover w-[100px] h-[100px] "
            src={!auth ? "" : auth.currentUser.photoURL}
          />
        </picture>
        <p className="text-center w-full font-dm font-bold text-white">
          {auth.currentUser.displayName}
        </p>
        <div className="  absolute top-[20px] hidden   group-hover:flex left-[43px] rounded-full w-[100px] h-[100px] bg-red-400 flex justify-center items-center ">
          <AiOutlineCloudUpload
            onClick={() => setUploadPage(!uploadPage)}
            className="text-2xl text-white cursor-pointer"
          />
        </div>
      </div>
      <div className="flex justify-center items-center flex-col gap-y-7">
        <div
          className={`${
            active == "home" &&
            "relative text-center z-10 py-5   after:absolute after:content-[''] after:top-0 after:left-[-45px] after:w-[200px] after:rounded-[20px] after:h-full after:bg-[#fff] after:z-[-1] before:absolute before:content-[''] before:top-0 before:right-[-77px] before:w-[20px] before:h-full before:bg-[#5F35F5] before:rounded-[25px] before:shadow-2xl  "
          }`}
        >
          <Link to="/">
            <SlHome
              className={`${
                active == "home"
                  ? " text-5xl text-[#5F35F5] "
                  : " text-5xl text-[#fff] "
              }`}
            />
          </Link>
        </div>
        <div
          className={`${
            active == "message" &&
            "relative text-center z-10 py-5   after:absolute after:content-[''] after:top-0 after:left-[-45px] after:w-[200px] after:rounded-[20px] after:h-full after:bg-[#fff] after:z-[-1] before:absolute before:content-[''] before:top-0 before:right-[-77px] before:w-[20px] before:h-full before:bg-[#5F35F5] before:rounded-[25px] before:shadow-2xl  "
          }`}
        >
          <Link to="/message">
            <AiOutlineMessage
              className={`${
                active == "message"
                  ? " text-5xl text-[#5F35F5] "
                  : " text-5xl text-[#fff] "
              }`}
            />
          </Link>
        </div>
        <div
          className={`${
            active == "notification" &&
            "relative text-center z-10 py-5   after:absolute after:content-[''] after:top-0 after:left-[-45px] after:w-[200px] after:rounded-[20px] after:h-full after:bg-[#fff] after:z-[-1] before:absolute before:content-[''] before:top-0 before:right-[-77px] before:w-[20px] before:h-full before:bg-[#5F35F5] before:rounded-[25px] before:shadow-2xl  "
          }`}
        >
          <Link to="/notification">
            <div className="relative">
              <IoIosNotificationsOutline
                onClick={handleNotify}
                className={`${
                  active == "notification"
                    ? " text-5xl text-[#5F35F5] "
                    : " text-5xl text-[#fff] "
                }`}
              />
              {noti.map((item) => (
                <span className="absolute top-[7px] right-[19px]  font-pop font-bold text-base text-[#0cd4db]">
                  {item.length}
                  {/* <GoPrimitiveDot className="text-white" /> */}
                </span>
              ))}
            </div>
          </Link>
        </div>

        <div
          className={`${
            active == "settings" &&
            "relative text-center z-10 py-5   after:absolute after:content-[''] after:top-0 after:left-[-45px] after:w-[200px] after:rounded-[20px] after:h-full after:bg-[#fff] after:z-[-1] before:absolute before:content-[''] before:top-0 before:right-[-77px] before:w-[20px] before:h-full before:bg-[#5F35F5] before:rounded-[25px] before:shadow-2xl  "
          }`}
        >
          <Link to="/settings">
            <AiOutlineSetting
              className={`${
                active == "settings"
                  ? " text-5xl text-[#5F35F5] "
                  : " text-5xl text-[#fff] "
              }`}
            />
          </Link>
        </div>

        <MdLogout
          onClick={() => handleLogout(auth.currentUser.uid)}
          className=" text-5xl mt-8 text-[#fff] "
        ></MdLogout>
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
          <h3 className="py-4 font-nunito font-semibold text-4xl text-[#FFFFFF] ">
            Change Profile Picture
          </h3>
          <div className="mb-10 flex flex-col">
            <input
              className="mb-5 border border-[#03014C] rounded-lg outline-0 w-[368px] px-5 py-5 font-nunito font-semibold text-xl text-[#11175D] "
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
                className="border border-[#11175D] bg-[#5F35F5] rounded-lg w-[368px] px-12 py-4 font-nunito font-semibold text-xl text-[#FFFFFF] "
                type="button"
              >
                Upload
              </button>
            )}

            <button
              className="text-4xl text-[#FFFFFF] absolute top-[50px] right-[100px]  "
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

export default Sidebar;
