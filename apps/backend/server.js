const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB, disconnectDB } = require("./db");
const User = require("./models/User");

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.post("/user", async (request, response) => {
    const { email, fullname, phone } = request.body;

    try {
        let user = await User.findOne({ email });
		console.log(user)
        if (!user) {
            user = new User({ email, fullname, phone });
            await user.save();
        }
        response.status(200).json({ user });
    } catch (error) {
        console.error("Error handling user creation or retrieval:", error);
        response.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/skill", async (request, response) => {
	const { userId, skill } = request.body;

	try {
		let user = await User.findById(userId);
		if (!user) {
			return response.status(404).json({ message: "Usuario no encontrado." });
		}

		user.skills.push(skill);
		await user.save();

		response.json({ message: "Nuevo skill agregado.", user });
	} catch (error) {
		console.error("Error adding skill:", error);
		response.status(500).json({ message: "Internal Server Error" });
	}
});

app.get("/user", async (request, response) => {
	const { email } = request.query; 

	try {
		const user = await User.findOne({email: email});
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
        const users = await User.find({}, { email: 1, name: 1, phone: 1, skills: 1 }); 

        response.json({ data: users, message: "Usuarios y skills." });
    } catch (error) {
        console.error("Error retrieving users:", error);
        response.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(PORT, () => console.log("Listening on PORT", PORT));

process.on("SIGINT", async () => {
	await disconnectDB();
	process.exit(0);
});