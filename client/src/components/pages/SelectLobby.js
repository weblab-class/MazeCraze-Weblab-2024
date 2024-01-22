import React, { useState, useEffect } from "react";
import "./SelectLobby.css";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { get } from "../../utilities";
import SingleLobby from "../modules/SingleLobby";

const SelectLobby = ({ userId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [availableLobbies, setAvailableLobbies] = useState([]); //Contains DB Lobby Info
  const [lobbyInfo, setLobbyInfo] = useState([]); //Contains Info Needed for Front-end (Number + Host)
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  useEffect(() => {
    get("/api/lobby").then(async (data) => {
      if (userId) {
        setAvailableLobbies(data);
        let promises = []
        let lobbies = []

        for (const lobby of data) {
          //Getting who the host is from the api
          console.log("Here is the lobby in frontEnd", lobby)
          promises.push(get("/api/user", { userid: lobby.host_id, lobbyUserIds: lobby.user_ids }))
        };

        Promise.all(promises).then((allresults) => {
          // console.log("Here are all results", allresults)
          for (const Obj of allresults) {lobbies.push({ playerAmount: Obj.user_ids.length, lobbyName: Obj.user.name + "Lobby" })}
          setLobbyInfo(lobbies)
        })
        
          // setLobbyInfo(lobbyInfo.concat([{ playerAmount: lobby.user_ids.length, lobbyName: host.name + "Lobby" }]));
        
        // console.log("Here are the lobbies: ", lobbyInfo);
        // console.log("Here are the lobbies DB: ", data);
        // console.log("Here are the lobbies state: ", lobbyInfo, lobbyInfo.length);
        
      }
    });
  }, []);
  useEffect(() => {console.log("Here are the lobbies state2: ",lobbyInfo, lobbyInfo.length)}, [lobbyInfo]);
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
            {console.log("Here are the lobbies state3:",lobbyInfo, lobbyInfo.length)}
            {console.log(lobbyInfo.constructor === Array )}
                       
            {lobbyInfo.map((lobby, i) => (
                  <SingleLobby lobby={lobby} key = {i}/>            
            ))} 
  
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectLobby;
