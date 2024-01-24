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
  console.log("Lobby Getting Created in API ");
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
router.post("/lobby", auth.ensureLoggedIn, (req, res) => {
  const newLobby = new Lobby({
    lobby_id: req.body.lobby_id,
    players: [req.body.players].concat(req.user._id),
    host_id: req.body._id,
    in_game: req.body.in_game,
  });
  newLobby.save();
});
//Gets all lobbies that arent in_game
router.get("/lobby", auth.ensureLoggedIn, (req, res) => {
  Lobby.find({ in_game: false }).then((lobbies) => {
    res.send(lobbies);
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
