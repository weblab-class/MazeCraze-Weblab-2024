import React, { useEffect, useState, useRef } from "react";
import { get, post } from "../../utilities.js";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import { socket } from "../../client-socket.js";
import LobbyUserCard from "../modules/LobbyUserCard.js";
import "./GameLobby.css";
import { player_colors } from "../modules/constants.js";

const GameLobby = ({ lobbyId, userId }) => {
  const [lobby, setLobby] = useState({});
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const [typedMessage, setTypedMesssage] = useState("");
  const [lobbyChat, setLobbyChat] = useState([])
  const [isHost, setIsHost] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  const navigate = useNavigate();
  const navigateBack = () => {
    navigate("/");
    post("/api/leave_lobby", { lobby_id: lobbyId });
    socket.off("startGameForPlayers", (data) => {});
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const postNewChatMessage = () => {
    socket.emit("enteredChatMessage", {userId: userId, message: typedMessage, lobbyId: lobbyId});
  }

  const launchGame = () => {
    navigate("game");
  };

  useEffect(() => {
    socket.on("displayNewMessage", (data) => {
      let chatMessage = [[data.name, data.message]];
      setLobbyChat(lobbyChat.concat(chatMessage));
    });
    return() => {
      socket.off("displayNewMessage", (data) => {
        setLobbyChat(chatMessage);
      });
    }
  }, [])

  useEffect(() => {
    socket.on("startGameForPlayers", (data) => {
      //sets isAnimated to true here so that animation happens at the same time for everyone

      setIsAnimated(true);
      setTimeout(() => {
        //navigates after animation has happened
        get("/api/user_lobby", { lobby_id: lobbyId })
      .then((data) => {
        setLobby(data.lobbyGameState);
        setLobbyUsers(Object.values(data.lobbyGameState.playerStats));
        setIsHost(userId == data.lobbyGameState.host_id);
        if(data.lobbyGameState) {
          if(data.lobbyGameState.playerStats[userId]) {

            navigate("game");
          }
        }
      })
      .catch((err) => console.log("Getting Lobby with Lobby Id Given Has Error: ", err));

          
        
      }, 3400);
    });
    return () => {
      // socket.off("lobby_join", setNewLobby);
      socket.off("startGameForPlayers" );
    };
  }, []);

  //Queries the API for the latest lobby using LobbyId
  useEffect(() => {
    get("/api/user_lobby", { lobby_id: lobbyId })
      .then((data) => {
        setLobby(data.lobbyGameState);
        setLobbyUsers(Object.values(data.lobbyGameState.playerStats));
        setIsHost(userId == data.lobbyGameState.host_id);
      })
      .catch((err) => console.log("Getting Lobby with Lobby Id Given Has Error: ", err));
  }, [userId]);

  //Use Socket Listener to Check When New Player Joins
  useEffect(() => {
    const setNewLobby = (lobbyGameState) => {
      setLobby(lobbyGameState);
      setLobbyUsers(Object.values(lobbyGameState.playerStats));
      if (!Object.keys(lobbyGameState.playerStats).includes(lobbyGameState.host_id)) {
        navigateBack();
      }
    };
    socket.on("lobby_join", setNewLobby);
    return () => {
      socket.off("lobby_join", setNewLobby);
    };
  }, [lobbyUsers]);

  const animate = () => {};
  const handleClick = () => {
    if (lobby.host_id === userId) {
      socket.emit("updateInGame", {lobbyId: lobbyId})
      socket.emit("serverStartGameRequest", { lobbyId: lobbyId });
    }
  };

  return (
    <div className="bg-primary-block min-h-screen h-full screen relative flex items-center justify-center text-primary-text font-custom tracking-widest">
      <div className="bg-primary-bg w-full h-[15%] absolute top-0 flex justify-center items-center text-6xl z-40 flex-col">
        {isHovered ? (
          <IoArrowBackCircleOutline
            onMouseOut={handleMouseLeave}
            size={60}
            onClick={navigateBack}
            className="absolute left-0 cursor-pointer"
          />
        ) : (
          <IoArrowBackCircle
            onMouseOver={handleMouseEnter}
            size={60}
            onClick={navigateBack}
            className="absolute left-0 cursor-pointer"
          />
        )}
        <div
          className={`aspect-square w-[5%] absolute z-50   rounded-md hidden${
            isAnimated ? "block moveBlock shadow-current " : ""
          }`}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full bg-primary-block blur-lg absolute"></div>
            <div className="w-[90%] h-[90%] bg-primary-block rounded-md absolute"></div>
          </div>
        </div>
        <div className="z-50 text-4xl md:text-5xl lg:text-4xl">GameLobby</div>
        <div className=" font-custom trailing-widest text-3xl  md:text-4xl lg:text-3xl">LobbyCode: {lobbyId}</div>
      </div>
      <div
        className="bg-primary-bg w-[30%] h-[60%] px-2 absolute bottom-0 flex items-center justify-center cursor-pointer text-center text-2xl z-20 text-primary-pink"
        onClick={handleClick}
      >
        {isHost ? "START GAME" : "WAITING FOR HOST TO START GAME"}
      </div>
      <div className="bg-primary-block h-[80%] w-[35%] absolute left-0 p-3 overflow-y-auto text-3xl inset-y-[15%] z-50">
        <div className="border-b-4 border-primary-text z-50">Player Box</div>
        {lobbyUsers.map((user, i) => (
          <LobbyUserCard data={user} key={i} />
        ))}
      </div>
      <div className="bg-primary-block h-[80%] w-[35%] absolute right-[0.1%] p-3 text-3xl inset-y-[15%] z-50">
        <div className="border-b-4 border-primary-text z-50 text-primary-text">Chat</div>
        {lobbyChat.map((chat, i) => {
          let userName = chat[0]; // Gets name of user who sent message
          let message = chat[1]; // Gets message 
          return <div className="text-xl" key={i}>{userName}: {message}</div>
        })}
        <input type="text" value={typedMessage} onChange={(e) => {
          setTypedMesssage(e.target.value)
        }}></input>
        <button onClick={postNewChatMessage}>Submit</button>
      </div>
      <div
        className={`bg-primary-block w-[15%] h-[25%] absolute inset-y-[15%] inset-x-[35%]  z-40 ${
          isAnimated ? " moveWallNegative" : ""
        }`}
      ></div>
      <div
        className={`bg-primary-block w-[15%] h-[25%] absolute inset-y-[15%] inset-x-[50%] z-40 ${
          isAnimated ? " moveWallPositive" : ""
        }`}
      ></div>
      <div className="w-full h-[15%] bg-primary-bg absolute bottom-0 z-50 "></div>
      <div className="bg-primary-bg w-[30%] h-[60%] absolute inset-y-[10%] flex items-center justify-center z-0"></div>
    </div>
  );
};

export default GameLobby;
