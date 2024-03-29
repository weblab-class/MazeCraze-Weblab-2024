import React, { useEffect } from "react";

const LobbyUserCard = ({ user }) => {
  let textColor;
  switch (user.color) {
    case "#FDC0CD":
      textColor = "text-[#FDC0CD]";
      break;
    case "#F7277F":
      textColor = "text-[#F7277F]";
      break;
    case "#B47EDE":
      textColor = "text-[#B47EDE]";
      break;
    case "#F58216":
      textColor = "text-[#F58216]";
      break;
    case "#98FB98":
      textColor = "text-[#98FB98]";
      break;
  }

  return (
    <>
      <div className={`text-wrap overflow-hidden w-[80%] px-4 py-2 text-xl ${textColor}`}>
        {user.name}
      </div>
    </>
  );
};
export default LobbyUserCard;
