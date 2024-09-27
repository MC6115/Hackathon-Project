const mongoose = require("mongoose");

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const DB_URL = process.env.DB_URL;
const FIXED_DB_URL = DB_URL.replace("<db_user>", DB_USER).replace("<db_password>", DB_PASS).replace("<db_name>", DB_NAME);

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(FIXED_DB_URL);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1); // Detiene el proceso si no puede conectarse
	}
};

const disconnectDB = async () => {
	try {
		await mongoose.disconnect();
		console.log("MongoDB disconnected");
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1); // Detiene el proceso si no puede desconectarse
	}
};

module.exports = { connectDB, disconnectDB };
