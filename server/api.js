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

//Updates Lobby, Specifically when a new person joins a lobby + Emits Sockets to Everyone In Lobby To Notify Who Joined
router.post("/lobby", auth.ensureLoggedIn, async (req, res) => {
  //Updates the lobby in DB
  const newLobby = await Lobby.findOneAndUpdate(
    { lobby_id: req.body.lobby_id },
    { $push: { user_ids: req.body.user_id } },
    { new: true }
  );
  newUsers = []
  for (const user_id of newLobby.user_ids) {
    newUsers.push(await User.findOne({_id : user_id}));
  }
  //Socket Emit to Players in Lobby
  for (const id of newLobby.user_ids) {
    socketManager.getSocketFromUserID(id).emit("lobby_join", { newLobby, newUsers }); //error occurs because you join people's lobbie's when they are logged out so their socket isn't in the socket map. Need to delete lobbied when they are empty
  }
  res.send({ newLobby, newUsers });
});
//Gets all lobbies that arent in_game
router.get("/lobby", auth.ensureLoggedIn, (req, res) => {
  Lobby.find({ in_game: false }).then((lobbies) => {
    res.send(lobbies);
  });
});
//Gets User's Lobby Based on Lobby Id
router.get("/user_lobby", async (req, res) => {
  const user_lobby = await Lobby.findOne({ lobby_id: req.query.lobby_id });
  const user_array = [];
  for (const user_id of user_lobby.user_ids) {
    const user = await User.findOne({ _id: user_id });
    user_array.push(user);
  }
  res.send({ user_lobby, user_array });
});
// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
