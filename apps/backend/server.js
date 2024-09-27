const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB, disconnectDB } = require("./db");

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conectar a la base de datos al iniciar la app
connectDB();

app.post("/user", async (request, response) => {
	// TODO: Si el correo no existe, crear un nuevo usuario en la DB (Mongo) y devolver el ID.
	// TODO: Si existe solamente devolver el ID
	// TODO: Redireccionar al frontend con el token en la URL (no es lo más seguro, pero es un ejemplo)
	response.redirect("http://localhost:5500/auth?id=");
});

app.post("/skill", async (request, response) => {
	// TODO: Agregar una habilidad a tu propio usuario en la DB (Mongo)
	response.json({ message: "Nuevo skill agregado." });
});

app.get("/user", async (request, response) => {
	// TODO: Obtener tu información de usuario (incluyendo skills) de la DB (Mongo)
	response.json({ message: "Este es tu usuario." });
});

app.get("/users", async (request, response) => {
	// TODO: Obtener la información de todos los usuarios (incluyendo skills) de la DB (Mongo)
	response.json({ data: [], message: "Usuarios y skills." });
});

app.listen(PORT, () => console.log("Listening on PORT", PORT));

// Desconectar cuando la app se cierre (por ejemplo, en casos de interrupción)
process.on("SIGINT", async () => {
	await disconnectDB();
	process.exit(0);
});
