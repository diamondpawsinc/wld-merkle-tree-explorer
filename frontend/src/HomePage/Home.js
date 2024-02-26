import React, { useState, useEffect } from "react";
import WLDLogo from "../../img/logo-small.svg";
import Search from "../Search";
import { useDebouncedValue } from "../utils";
import HomeRecommendation from "./HomeRecommendation";

function Home({ setSearchInput }) {
  const [value, setValue] = useState("");
  const debouncedSearchTerm = useDebouncedValue(value, 500);
  useEffect(() => {
    setSearchInput(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full h-full flex flex-col items-center justify-center gap-8 px-8">
        <div className="flex gap-x-4">
          <img className="h-16 w-auto" src={WLDLogo} alt="" />
          <div className="flex flex-col justify-center items-center"></div>
        </div>
        <Search
          setValue={setValue}
          value={value}
          className={
            "block w-full max-w-[584px] rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-black sm:text-sm sm:leading-6"
          }
        />
        <HomeRecommendation setValue={setValue} />
      </div>
      <div className="text-center my-10 text-xs">
        Merkle Tree Explorer Powered by Diamond Paws Inc.
      </div>
    </div>
  );
}
export default Home;
