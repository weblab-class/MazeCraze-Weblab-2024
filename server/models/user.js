const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  sprite: { type: Number, default: 0 },
  games_played: { type: Number, default: 0 },
  games_won: { type: Number, default: 0 },
  lifetime_coins: { type: Number, default: 0 },
  keybinds: {
    type: mongoose.Schema.Types.Mixed,
    default: { up: "w", down: "s", left: "a", right: "d" },
  },
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
