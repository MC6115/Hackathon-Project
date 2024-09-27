const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true }, 
    skills: { type: [String], default: [] } 
});

const User = mongoose.model("User", userSchema);
module.exports = User;