import React, { useState, useEffect } from "react";
import "./SelectLobby.css";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { get } from "../../utilities";
const SelectLobby = ({ userId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [availableLobbies, setAvailableLobbies] = useState([]); //Contains DB Lobby Info
  const [lobbyInfo, setLobbyInfo] = useState([]); //Contains Info Needed for Front-end
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  useEffect(() => {
    get("/api/lobby").then((data) => {
      if (userId) {
        setAvailableLobbies(data);
        let lobbies = [];
        data.forEach((lobby) => {
          get("/api/user", { userid: lobby.host_id }).then((host) => {
            lobbies.push({ playerAmount: lobby.user_ids.length, lobbyName: host.name + "Lobby" });
          });
        });
        setLobbyInfo(lobbies);
        console.log("Here are the lobbies: ", lobbies);
        console.log("Here are the lobbies DB: ", data);
      }
    });
  }, []);
  return (
    <>
      <div className="flex flex-col text-center font-bold bg-primary-bg w-full h-full min-h-screen">
        <div className="flex justify-between px-5 items-center">
          <div className="">
            {isHovered ? (
              <IoArrowBackCircleOutline
                className="arrow-icon"
                onMouseLeave={handleMouseLeave}
                size={60}
              />
            ) : (
              <IoArrowBackCircle className="arrow-icon" onMouseEnter={handleMouseEnter} size={60} />
            )}
          </div>
          <div className="text-primary-text py-8 text-5xl">Lobby Select</div>
          <div />
        </div>

        <div className="LobbyContainerOuter">
          <div className="LobbyContainerInner">
            {lobbyInfo.map((lobby, i) => {
              return (
                <>
                  <div key={i} className="p-10 bg-black text-primary-text">
                    {lobby}
                    {/* {lobby.playerAmount} <br /> {lobby.lobbyName} <br />  */}
                  </div>
                </>
              );
            })}
            hi {lobbyInfo.length}
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectLobby;
