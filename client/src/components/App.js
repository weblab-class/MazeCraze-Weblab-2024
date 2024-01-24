import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import jwt_decode from "jwt-decode";
import React, { useState, useEffect } from "react";

import NotFound from "./pages/NotFound.js";

import Home from "./pages/Home.js";
import SelectLobby from "./pages/SelectLobby.js";
import Game from "./pages/Game.js";
import "../utilities.css";

import { socket } from "../client-socket.js";
import { get, post } from "../utilities";

import GameLobby from "./pages/GameLobby.js";
import Customize from "./pages/Customize.js";
import Tutorial from "./pages/Tutorial.js";
/**
 * Define the "App" component
 */
function GameLobbyWrapper({ userId }) {
  const { lobbyId } = useParams();
  return <GameLobby lobbyId={lobbyId} userId={userId} />;
}
const App = () => {
  const [userId, setUserId] = useState(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    setIsLoggedIn(true);
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(undefined);
    post("/api/logout");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            userId={userId}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        }
      />
      <Route path="/lobby/" element={<SelectLobby userId={userId} />} />
      <Route path="/gamelobby/:lobbyId/" element={<GameLobbyWrapper userId={userId} />} />
      <Route path="/customize/" element={<Customize userId={userId} />} />
      <Route path="/tutorial/" element={<Tutorial />} />
      <Route path="/gamelobby/:lobbyId/game/" element={<Game userId={userId} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
