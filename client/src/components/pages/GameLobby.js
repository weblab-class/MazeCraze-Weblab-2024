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
  const [typedMessage, setTypedMessage] = useState("");
  const [lobbyChat, setLobbyChat] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [color, setColor] = useState("#F58216");

  // typed message references so that enter key is able to correctly send typed message
  const typedMessageRef = useRef(typedMessage);
  const setTypedMessageRef = (message) => {
    typedMessageRef.current = message;
    setTypedMessage(message);
  };

  const navigate = useNavigate();
  const navigateBack = () => {
    post("/api/leave_lobby", { lobby_id: lobbyId }).then(()=>{
      socket.off("startGameForPlayers");
      navigate("/");
    }).catch((err)=>{
      console.log("There was an error leaving lobby", err)
    });
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleEventListener = (e) => {
    if (e.key === "Enter") {
      postNewChatMessage();
    }
  }

  const postNewChatMessage = () => {
    console.log("sending");
    if (typedMessageRef.current != "") {
      socket.emit("enteredChatMessage", {
        userId: userId,
        message: typedMessageRef.current,
        lobbyId: lobbyId,
      });
    }
    setTypedMessageRef("");
  };

  const launchGame = () => {
    navigate("game");
  };

  useEffect(() => {
    get("/api/user")
      .then((data2) => {
        const currLobbyId = parseInt(window.location.pathname.slice(-5), 10);

        console.log("User on mount", data2.user._id);

        get("/api/user_lobby", { lobby_id: currLobbyId })
          .then((data) => {
            if (data.lobbyGameState) {
              if (data.lobbyGameState.playerStats[data2.user._id]) {
                setColor(data.lobbyGameState.playerStats[data2.user._id].color);

              // FOR DISPLAYING MESSAGES IN CHAT
              socket.on("displayNewMessage", (data) => {
                let chatMessage = [data.name, data.message];
                setLobbyChat((lobbyChat) => [chatMessage, ...lobbyChat]);
              });
            } else {
              console.log("navigating back in GameLobby1");
              navigate("/");
            }
          } else {
            console.log("navigating back in GameLobby2");
            navigate("/");
          }
        }).catch((err)=> {
          console.log("There was an error getting the user lobby", err);
          console.log("navigating back in GameLobby3");
          navigate("/");
        });
      })
      .catch(() => {
        console.log("navigating back in GameLobby4");
        navigate("/");
      });
    return () => {
      socket.off("displayNewMessage");
    };
  }, []);

  // IF THE PLAYER IS TYPING IN CHAT AND HITS ENTER
  useEffect(() => {
    window.addEventListener("keypress", handleEventListener);

    return () => {
      window.removeEventListener("keypress", handleEventListener);
    };
  }, []);

  useEffect(() => {
    get("/api/user")
      .then((data2) => {
        socket.on("startGameForPlayers", (data) => {
          //sets isAnimated to true here so that animation happens at the same time for everyone

          setIsAnimated(true);
          setTimeout(() => {
            //navigates after animation has happened
            get("/api/user_lobby", { lobby_id: lobbyId })
              .then((data) => {
                // setLobby(data.lobbyGameState);
                // setLobbyUsers(Object.values(data.lobbyGameState.playerStats));
                // setIsHost(userId == data.lobbyGameState.host_id);
                console.log("lobby", data.lobbyGameState);
                console.log("player", data.lobbyGameState.playerStats[data2.user._id]);
                console.log("UserId", data2.user._id);
                console.log("LobbyId", lobbyId);
                if (data.lobbyGameState) {
                  if (data.lobbyGameState.playerStats[data2.user._id]) {
                    navigate("game");
                  }
                }
              })
              .catch((err) => console.log("There was an error getting lobby", err));
          }, 3400);
        });
      })
      .catch((err) => {
        console.log("Error getting user", err);
        navigate("/");
      });
    return () => {
      // socket.off("lobby_join", setNewLobby);
      socket.off("startGameForPlayers");    };
  }, []);

  //Queries the API for the latest lobby using LobbyId
  useEffect(() => {
    get("/api/user_lobby", { lobby_id: lobbyId })
      .then((data) => {
        setLobby(data.lobbyGameState);
        setLobbyUsers(Object.values(data.lobbyGameState.playerStats));
        setIsHost(userId == data.lobbyGameState.host_id);
      })
      .catch((err) => {
        console.log("Getting Lobby with Lobby Id Given Has Error: ", err);
        navigate("/");
      });
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
      socket.emit("updateInGame", { lobbyId: lobbyId });
      socket.emit("serverStartGameRequest", { lobbyId: lobbyId });
    }
  };

  return (
    <div className="bg-primary-block min-h-screen h-full screen relative flex items-center justify-center text-primary-text trailing-widest font-custom tracking-widest">
      <div className="bg-primary-bg w-full h-[15%] absolute top-0 flex justify-center items-center text-6xl z-40 flex-col">
        {isHovered ? (
          <IoArrowBackCircleOutline
            onMouseOut={handleMouseLeave}
            size={60}
            onClick={navigateBack}
            className="absolute left-5 cursor-pointer"
          />
        ) : (
          <IoArrowBackCircle
            onMouseOver={handleMouseEnter}
            size={60}
            onClick={navigateBack}
            className="absolute left-5 cursor-pointer"
          />
        )}
        <div
          className={`aspect-square w-[5%] absolute z-50   rounded-md hidden${
            isAnimated ? "block moveBlock shadow-current " : ""
          }`}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div
              className={`w-full h-full blur-lg absolute`}
              style={{ backgroundColor: color }}
            ></div>
            <div
              className={`w-[90%] h-[90%]  rounded-md absolute`}
              style={{ backgroundColor: color }}
            ></div>
          </div>
        </div>
        <div className="z-50  text-3xl md:text-4xl lg:text-5xl  ">
          Lobby <span className="font-extrabold text-4xl md:text-5xl lg:text-6xl">{lobbyId}</span>
        </div>
      </div>
      <div
        className="bg-primary-bg w-[30%] h-[60%] px-2 absolute bottom-0 flex items-center justify-center cursor-pointer text-center text-2xl z-20 text-primary-pink"
        onClick={handleClick}
      >
        {isHost ? "START GAME" : "WAITING FOR HOST TO START GAME"}
      </div>
      <div className="bg-primary-block h-[80%] w-[35%] absolute left-0 p-3 overflow-y-auto text-3xl inset-y-[15%] z-50">
        <div className="border-b-4 border-primary-text z-50">Player Box</div>
        <div className="flex flex-col w-full overflow-auto">
          {lobbyUsers.map((user, i) => (
            <LobbyUserCard user={user} key={i} />
          ))}
        </div>
      </div>
      <div className="bg-primary-block h-[80%] w-[35%] absolute right-[0.1%] p-3 text-3xl inset-y-[15%] z-50">
        <div className="border-b-4 border-primary-text z-50 text-primary-text ">Chat</div>
        <div className="flex start-end pt-2 justify-between flex-col h-[80%]">
          {/* chat messages and input box container */}
          <div className="overflow-auto w-full h-[90%] flex flex-col-reverse gap-2">
            {/* chat container */}
            {lobbyChat.map((chat, i) => {
              let userName = chat[0]; // Gets name of user who sent message
              let message = chat[1]; // Gets message
              return (
                <div className="text-sm m-2 text-wrap" key={i}>
                  {userName}: {message}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between place-items-center">
            <input
              className="text-lg w-[80%] bg-primary-bg focus:outline-none p-2 rounded-xl"
              type="text"
              value={typedMessage}
              onChange={(e) => {
                setTypedMessageRef(e.target.value);
              }}
            ></input>
            <button
              className="bg-primary-bg text-sm mx-4 p-3 rounded-xl"
              onClick={postNewChatMessage}
            >
              Send
            </button>
          </div>
        </div>
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
