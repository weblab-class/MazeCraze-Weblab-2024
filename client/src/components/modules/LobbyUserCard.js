import React from "react";

const LobbyUserCard = ({ data }) => {
  return (
    <>
      <div className="flex justify-center items-center px-4 py-2 text-xl text-primary-text">
        {data?.user?.name}
      </div>
    </>
  );
};
export default LobbyUserCard;
