import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/routes.js";

const app = express();

const PORT = 8081;
dotenv.config();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", routes);

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("assets"));

app.listen(PORT, (req, res) => {
    console.log("server listening on port", PORT);
});
