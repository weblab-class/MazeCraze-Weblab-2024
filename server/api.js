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
const gameManager = require("./gameLogic/GameManager");

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
  if (req.user) {
    User.findById(new mongoose.Types.ObjectId(req.user._id))
      .then((exists) => {
        if (exists) {
          User.findById(req.user._id).then((user) => {
            res.send({ user: user });
          });
        } else {
          console.log("this user doesnt exist");
          res.send({});
        }
      })
      .catch((err) => {
        console.log("Error checking existence of user", err);
        res.send({});
      });
  } else {
    res.send({});
  }
});
//updates user's stats after a game
router.post("/update_user_stats", (req, res) => {
  User.findById(req.user._id)
    .then((exists) => {
      if (exists) {
        User.findByIdAndUpdate(
          new mongoose.Types.ObjectId(req.user._id),
          { $inc : {
             games_won: req.user._id == req.body.winner_id ? 1 : 0,
             lifetime_coins: req.body.playerStats[req.user._id].totalCoins * 100,
             games_played: 1,
          }},
          { new: true }
        )
          .then((results) => {
            console.log("document updated successfully", results);
            res.send({})
          })
          .catch((error) => {
            console.log("Error updating document: ", error);
            res.send({})
          });
      } else {
        console.log("Document with _id does not exist");
        res.send({})
      }
    })
    .catch((error) => {
      console.log("Error checking existence: ", error);
      res.send({})
    });
});
//updates user's customization
router.post("/update_user", (req, res) => {
  User.findById(req.user._id)
    .then((exists) => {
      if (exists) {
        User.findByIdAndUpdate(
          new mongoose.Types.ObjectId(req.user._id),
          {
            name: req.body.name,
            keybinds: {
              up: req.body.up,
              down: req.body.down,
              left: req.body.left,
              right: req.body.right,
            },
          },
          { new: true }
        )
          .then((results) => {
            console.log("document updated successfully", results);
            res.send({})
          })
          .catch((error) => {
            console.log("Error updating document: ", error);
            res.send({})
          });
      } else {
        console.log("Document with _id does not exist");
        res.send({})
      }
    })
    .catch((error) => {
      console.log("Error checking existence: ", error);
      res.send({})
    });
});

//Posts New Lobby
router.post("/newlobby", auth.ensureLoggedIn, (req, res) => {
  const user_id = req.user._id;
  const host_player = {
    id: user_id,
    name: req.user.name,
    sprite: req.user.sprite,
    color: "",
    isAlive: true,
    deathCountdown: 3,
    location: [],
    roundCoins: 0,
    totalCoins: 0,
    isMoving: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    lastMoveDirection: "", // This is for sprites
  };
  const GameState = {
    host_id: user_id,
    playerStats: {},
    totalPlayers: 1,
    playerSpeed: 8, // TILES PER SECOND
    crownPlayer: "",
    crownPlayerCoins: 0,
    colors: ["#FDC0CD", "#F7277F", "#B47EDE", "#F58216", "#98FB98"],
    round: 1,
    activatedPerks: [],
    availablePerks: [
      "Crumbling Walls",
      "Hermes Boots",
      "Hydra Coins",
      "Maze Haze",
      "Social Distancing",
      "Three Blind Mice",
      "Wandering Coins",
      "Who's Who",
    ],
    lastPerk: "",
    timeLeft: 30,
    betweenRoundTimeLeft: 40,
    gridLayout: [],
    coinLocations: [],
    wanderingCoinDirections: [], // THIS IS FOR WHAT DIRECTION EACH COIN IS WANDERING
    blindMiceLocations: [], // THIS IS FOR THREE BLIND MICE
    blindMiceDirections: [], // THIS IS FOR THREE BLIND MICE
    hasHydraCoins: false,
    socialDistancing: false,
    hasMazeHaze: false,
    unknownSprites: false,
    in_round: false,
    in_game: false,
  };

  let randomColorIndex = Math.floor(Math.random() * GameState.colors.length);
  host_player.color = GameState.colors[randomColorIndex];
  GameState.colors.splice(randomColorIndex, 1);

  GameState.playerStats[user_id] = host_player;
  gameStates[req.body.lobby_id] = GameState;
  res.send({ gameStates: GameState });
});

//Updates Lobby when user leaves lobby; when host leaves lobby, lobby will close and screens will be sent to dashboard
router.post("/leave_lobby", auth.ensureLoggedIn, async (req, res) => {
  const current_gameState = gameStates[req.body.lobby_id];
  const user_id = req.user._id;
  if (current_gameState) {
    delete current_gameState.playerStats[user_id];
    if (Object.keys(current_gameState.playerStats).length <= 0) {
      delete gameStates[req.body.lobby_id];
    } else {
      for (const [id, player] of Object.entries(current_gameState.playerStats)) {
        socketManager.getSocketFromUserID(id)?.emit("lobby_join", current_gameState);
      }
    }
  }

  res.send({ lobbyGameState: current_gameState });
});

router.post("/removeUserFromAllLobbies", async (req, res) => {
  if (req.user) {
    const user = req.user._id;
    for (const [lobbyId, lobby] of Object.entries(gameManager.gameStates)) {
      if (lobby) {

        if(lobby.playerStats) {

          if (Object.keys(lobby.playerStats).includes(user)) {
            delete lobby.playerStats[user];

            if (Object.keys(lobby.playerStats).length <= 0) {
              delete gameStates[lobbyId];
            } else {
              for (const [id, player] of Object.entries(lobby.playerStats)) {
                socketManager.getSocketFromUserID(id)?.emit("lobby_join", lobby);
              }
            }
          }
        }
      }
    }
  }
  res.send({});
});

//Updates Lobby, Specifically when a new person joins a lobby + Emits Sockets to Everyone In Lobby To Notify Who Joined
router.post("/lobby", auth.ensureLoggedIn, async (req, res) => {
  if (gameManager.gameStates[req.body.lobby_id]) {
    const current_gameState = gameStates[req.body.lobby_id];
    const user_id = req.user._id;
    const new_player = {
      id: user_id,
      name: req.user.name,
      sprite: req.user.sprite,
      color: "",
      isAlive: true,
      deathCountdown: 3,
      location: [],
      roundCoins: 0,
      totalCoins: 0,
      isMoving: {
        up: false,
        down: false,
        left: false,
        right: false,
      },
      lastMoveDirection: "", // This is for sprites
    };
    current_gameState.playerStats[user_id] = new_player;
    current_gameState.totalPlayers += 1;

    // SELECTS COLOR
    let randomColorIndex = Math.floor(Math.random() * current_gameState.colors.length);
    current_gameState.playerStats[user_id].color = current_gameState.colors[randomColorIndex];
    current_gameState.colors.splice(randomColorIndex, 1);

    for (const [id, player] of Object.entries(current_gameState.playerStats)) {
      socketManager.getSocketFromUserID(id)?.emit("lobby_join", current_gameState);
    }

    res.send(current_gameState);
  } else {
    res.send({});
  }
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
