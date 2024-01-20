const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  sprite: Number,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
