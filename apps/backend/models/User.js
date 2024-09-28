const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
    name:{type:String},
    level:{type:String}
})

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    skills: [skillSchema]
}, { collection: "user_skills" });

const User = mongoose.model("User", userSchema);
module.exports = User;