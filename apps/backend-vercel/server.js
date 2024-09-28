const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB, disconnectDB } = require("./db");
const User = require("./models/User");


const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.post("/user", async (request, response) => {
    const { email, fullname, phone } = request.body;

    try {
        console.log("Checking for user with email:", email);
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, fullname, phone });
            await user.save();
            return response.status(201).json({ user });
        } else {
            return response.status(409).json({ user });
        }
    } catch (error) {
        console.error("Error handling user creation or retrieval:", error);
        response.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/skill", async (request, response) => {
	const { userId, skill } = request.body;

	if (!skill.name || !skill.level) {
		return response.status(400).json({ message: "Skill must include name and level." });
	}

	try {
		let user = await User.findById(userId);
		if (!user) {
			return response.status(404).json({ message: "Usuario no encontrado." });
		}
		console.log(userId, skill);

		user.skills.push({
			name: skill.name,
			level: skill.level
		});

		await user.save();

		response.json({ message: "Nuevo skill agregado.", user });
	} catch (error) {
		console.error("Error adding skill:", error);
		response.status(500).json({ message: "Internal Server Error" });
	}
});

app.get("/user", async (request, response) => {
    const { id } = request.query;

    try {
        const user = await User.findById(id);
        if (!user) {
            return response.status(404).json({ message: "Usuario no encontrado." });
        }
        response.json({ user });
    } catch (error) {
        console.error("Error retrieving user:", error);
        response.status(500).json({ message: "Internal Server Error" });
    }
});
app.get("/users", async (request, response) => {
	try {
		const users = await User.find({}, { _id: 1, email: 1, fullname: 1, phone: 1, skills: 1 });// 

		response.json({ data: users, message: "Usuarios y skills." });
	} catch (error) {
		console.error("Error retrieving users:", error);
		response.status(500).json({ message: "Internal Server Error" });
	}
});

process.on("SIGINT", async () => {
	await disconnectDB();
	process.exit(0);
});

module.exports = app;