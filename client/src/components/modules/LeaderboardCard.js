import React from "react";
import { GiCoins } from "react-icons/gi";

// PLAYER SCHEMA
// const new_player = {
//     id: user_id,
//     name: req.user.name,
//     sprite: req.user.sprite,
//     location: [],
//     roundCoins: 0,
//     totalCoins: 0,
//   };

const LeaderboardCard = ({ playerData, index }) => {
  return (
    <>
      <div className="flex flex-row  justify-between items-center bg-white w-full h-[20%] rounded-xl px-4 py-1 lg:py-3 ">
        <div className="flex flex-row items-center mr-5">
          <div className="text-primary-text text-lg lg:text-2xl  font-bold mb-1.5">{index + 1}</div>
          <div className="w-full bg-green-500 text-primary-bg ml-5 2xl:ml-10 text:md lg:text-xl font-bold text-nowrap truncate">
            {playerData.name}
          </div>
        </div>
        <div className="flex flex-row items-center ">
          <div className="text-primary-bg font-bold text-lg lg:text-2xl">
            {playerData.totalCoins}
          </div>
          <GiCoins className=" text-primary-text ml-4" size={35} />
        </div>
      </div>
    </>
  );
};

export default LeaderboardCard;
