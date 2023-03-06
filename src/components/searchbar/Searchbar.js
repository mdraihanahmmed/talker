import React from "react";
import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";
const Searchbar = () => {
  return (
    <div className="relative bg-white w-full my-6 lg:mt-0">
      <input
        type="text"
        placeholder="Search"
        className="w-full shadow-lg rounded-lg py-5 pl-[78px] outline-none"
      />
      <BsSearch className="absolute top-7 left-[33px]" />
      <BsThreeDotsVertical className="absolute top-7 right-[33px] text-primary" />
    </div>
  );
};

export default Searchbar;
