import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const Mygroup = () => {
  return (
    <div className="mt-[45px] ml-[22px]">
      <div className="w-full shadow-2xl border rounded-[20px] py-[20px] px-[20px] h-[439px]">
        <div className="flex justify-between mb-[17px]">
          <h2 className="font-pop font-semibold text-xl text-[#000000]">
            My Groups
          </h2>
          <BsThreeDotsVertical className="text-[#5F35F5] mt-[5px]" />
        </div>
        <div className="flex justify-between border-b pb-[13px]">
          <div className="flex">
            <picture>
              <img
                className="bg-[red] rounded-full w-[52px] h-[52px]"
                src="images/pic.png"
              />
            </picture>
            <div className="mt-[12px] pl-[14px]">
              <h5 className="font-pop font-semibold text-[14px] leading-[27px] text-[#000000]">
                Raghav
              </h5>
              <p className="font-pop font-medium text-[12px] leading-[21px] text-[#4D4D4DBF]">
                Dinner?
              </p>
            </div>
          </div>

          <p className="font-pop font-medium text-[10px] text-[#000]  mt-[20px] rounded-[5px] mr-[12px]">
            Today, 8:56pm
          </p>
        </div>
        <div className="flex justify-between border-b pb-[13px]">
          <div className="flex">
            <picture>
              <img
                className="bg-[red] rounded-full w-[52px] h-[52px]"
                src="images/pic.png"
              />
            </picture>
            <div className="mt-[12px] pl-[14px]">
              <h5 className="font-pop font-semibold text-[14px] leading-[27px] text-[#000000]">
                Raghav
              </h5>
              <p className="font-pop font-medium text-[12px] leading-[21px] text-[#4D4D4DBF]">
                Dinner?
              </p>
            </div>
          </div>

          <p className="font-pop font-medium text-[10px] text-[#000]  mt-[20px] rounded-[5px] mr-[12px]">
            Today, 8:56pm
          </p>
        </div>
        <div className="flex justify-between mt-[14px] border-b pb-[13px]">
          <div className="flex">
            <picture>
              <img
                className="bg-[red] rounded-full w-[52px] h-[52px]"
                src="images/pic.png"
              />
            </picture>
            <div className="mt-[12px] pl-[14px]">
              <h5 className="font-pop font-semibold text-[14px] leading-[27px] text-[#000000]">
                Raghav
              </h5>
              <p className="font-pop font-medium text-[12px] leading-[21px] text-[#4D4D4DBF]">
                Dinner?
              </p>
            </div>
          </div>

          <p className="font-pop font-medium text-[10px] text-[#000]  mt-[20px] rounded-[5px] mr-[12px]">
            Today, 8:56pm
          </p>
        </div>
        <div className="flex justify-between mt-[14px] ">
          <div className="flex">
            <picture>
              <img
                className="bg-[red] rounded-full w-[52px] h-[52px]"
                src="images/pic.png"
              />
            </picture>
            <div className="mt-[12px] pl-[14px]">
              <h5 className="font-pop font-semibold text-[14px] leading-[27px] text-[#000000]">
                Raghav
              </h5>
              <p className="font-pop font-medium text-[12px] leading-[21px] text-[#4D4D4DBF]">
                Dinner?
              </p>
            </div>
          </div>

          <p className="font-pop font-medium text-[10px] text-[#000]  mt-[20px] rounded-[5px] mr-[12px]">
            Today, 8:56pm
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mygroup;
