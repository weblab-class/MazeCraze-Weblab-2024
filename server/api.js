/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Lobby = require("./models/lobby");
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
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|
//Gets User Object
router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send({ user: user });
  });
});
//Posts New Lobby
router.post("/newlobby", auth.ensureLoggedIn, (req, res) => {
  const newLobby = new Lobby({
    lobby_id: req.body.lobby_id,
    user_ids: [req.user._id],
    host_id: req.user._id,
    in_game: false,
  });
  newLobby.save();
  res.send(newLobby);
});
//Updates Lobby, Specifically when a new person joins a lobby
router.post("/lobby", auth.ensureLoggedIn, async (req, res) => {
  //Updates the lobby in DB
  const newLobby = await Lobby.findOneAndUpdate(
    { lobby_id: req.body.lobby_id },
    { $push: { user_ids: req.body.user_id } },
    {
      new: true,
    }
  );
  const joinedUser = await User.findOne({ _id: req.body.user_id });
  //Socket Emit to Players in Lobby
  for (const id of newLobby.user_ids) {
    console.log("PLAYER ID IN LOBBY ", id);
    socketManager.getSocketFromUserID(id).emit("lobby_join", { newLobby, joinedUser });
  }

  res.send({ lobby: newLobby });
});
//Gets all lobbies that arent in_game
router.get("/lobby", auth.ensureLoggedIn, (req, res) => {
  Lobby.find({ in_game: false }).then((lobbies) => {
    res.send(lobbies);
  });
});
//Gets User's Lobby Based on Lobby Id
router.get("/user_lobby", (req, res) => {
  Lobby.findOne({ lobby_id: req.query.lobby_id }).then((single_lobby) => {
    res.send(single_lobby);
  });
});
// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
