/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/
const { gameStates } = require("./gameLogic/GameManager.js");
const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Lobby = require("./models/lobby");
const mongoose = require("mongoose");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const lobby = require("./models/lobby");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
    res.send({});
  }
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|
//Gets User Object
router.get("/user", (req, res) => {
  User.findById(new mongoose.Types.ObjectId(req.user._id))
    .then((exists) => {
      if (exists) {
        User.findById(req.user._id).then((user) => {
          res.send({ user: user });
        });
      } else {
        console.log("this user doesnt exist");
      }
    })
    .catch((err) => {
      console.log("Error checking existence of user", err);
    });
});

//updates user's username
router.post("/user", (req, res) => {
  User.findById(req.user._id)
    .then((exists) => {
      if (exists) {
        User.findByIdAndUpdate(new mongoose.Types.ObjectId(req.user._id), { name: req.body.name })
          .then((results) => {
            console.log("document updated successfully", results);
          })
          .catch((error) => {
            console.log("Error updating document: ", error);
          });
      } else {
        console.log("Document with _id does not exist");
      }
    })
    .catch((error) => {
      console.log("Error checking existence: ", error);
    });
});

//Posts New Lobby
router.post("/newlobby", auth.ensureLoggedIn, (req, res) => {
  const user_id = req.user._id;
  const host_player = {
    id: user_id,
    name: req.user.name,
    sprite: req.user.sprite,
    location: [],
    roundCoins: 0,
    totalCoins: 0,
  };
  const GameState = {
    host_id: user_id,
    playerStats: {},
    totalPlayers: 1,
    round: 1,
    activatedPerks: [],
    timeLeft: 30,
    gridLayout: [],
  };
  GameState.playerStats[user_id] = host_player;
  gameStates[req.body.lobby_id] = GameState;
  res.send({ gameStates: GameState });
});

// Updates user's keybinds in the database
router.post("/keybinds", auth.ensureLoggedIn, (req, res) => {
  User.findById(req.user._id)
    .then((exists) => {
      if (exists) {
        User.findByIdAndUpdate(new mongoose.Types.ObjectId(req.user._id), {
          keybinds: {
            up: req.body.up,
            down: req.body.down,
            left: req.body.left,
            right: req.body.right,
          },
        })
          .then((results) => {
            console.log("document updated successfully", results);
          })
          .catch((error) => {
            console.log("Error updating document: ", error);
          });
      } else {
        console.log("Document with _id does not exist");
      }
    })
    .catch((error) => {
      console.log("Error checking existence: ", error);
    });
});

//Updates Lobby when user leaves lobby; when host leaves lobby, lobby will close and screens will be sent to dashboard
router.post("/leave_lobby", auth.ensureLoggedIn, async (req, res) => {
  const current_gameState = gameStates[req.body.lobby_id];
  const user_id = req.user._id;

  delete current_gameState.playerStats[user_id];

  for (const [id, player] of Object.entries(current_gameState.playerStats)) {
    socketManager.getSocketFromUserID(id)?.emit("lobby_join", current_gameState);
  }

  res.send({ gameStates: current_gameState });
});
//Updates Lobby, Specifically when a new person joins a lobby + Emits Sockets to Everyone In Lobby To Notify Who Joined
router.post("/lobby", auth.ensureLoggedIn, async (req, res) => {
  const current_gameState = gameStates[req.body.lobby_id];
  const user_id = req.user._id;
  const new_player = {
    id: user_id,
    name: req.user.name,
    sprite: req.user.sprite,
    location: [],
    roundCoins: 0,
    totalCoins: 0,
  };
  current_gameState.playerStats[user_id] = new_player;

  for (const [id, player] of Object.entries(current_gameState.playerStats)) {
    socketManager.getSocketFromUserID(id)?.emit("lobby_join", current_gameState);
  }

  res.send({ gameStates: current_gameState });
});
//Gets all lobbies that arent in_game
router.get("/lobby", auth.ensureLoggedIn, (req, res) => {
  res.send({ gameStates });
});
//Gets User's Lobby Based on Lobby Id
router.get("/user_lobby", async (req, res) => {
  const lobbyGameState = gameStates[req.query.lobby_id];
  res.send({ lobbyGameState });
});
// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
