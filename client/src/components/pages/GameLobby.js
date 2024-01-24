import React, { useEffect, useState } from "react";
import { get } from "../../utilities.js";
import { socket } from "../../client-socket.js";
import LobbyUserCard from "../modules/LobbyUserCard.js";
const GameLobby = ({ lobbyId }) => {
  const [lobby, setLobby] = useState({});
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const setNewLobby = (data) => {
    console.log("DATA ON SOCKET ", data);
    setLobby(data.newLobby);
    setLobbyUsers(lobbyUsers.concat({ user: data.joinedUser }));
  };
  //Queries the API for the latest lobby using LobbyId
  useEffect(() => {
    get("/api/user_lobby", { lobby_id: lobbyId })
      .then((lobby) => {
        setNewLobby(lobby);
        const promises = [];
        for (const user_id of lobby.user_ids) {
          promises.push(get("/api/user", { userid: user_id }));
        }
        Promise.all(promises).then((users) => {
          setLobbyUsers(users);
        });
      })
      .catch((err) => console.log("Getting Lobby with Lobby Id Given Has Error: ", err));
  }, []);
  //Use Socket Listener to Check When New Player Joins
  useEffect(() => {
    socket.on("lobby_join", setNewLobby);
    return () => {
      socket.off("lobby_join", setNewLobby);
    };
  }, []);

  return (
    <div className="flex flex-col bg-primary-bg w-full h-full min-h-screen px-4 py-2 font-custom tracking-widest">
      <div className="text-5xl text-primary-text font-bold mb-10">GameLobby</div>
      <div className="flex gap-4 h-96">
        <div className="w-full bg-white">
          Player Box
          {lobbyUsers.map((user, i) => (
            <LobbyUserCard data={user} key={i} />
          ))}
        </div>
        <div className="bg-blue-200 w-full">
          <div className="text-2xl text-primary-text font-bold mb-5 text-center">
            Welcome to Room {lobbyId}
          </div>
          <div className="flex flex-col px-10 text-wrap text-xl ">
            <span className="text-black font-bold">
              User Name:
              <span className="font-medium"> content</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
