require("dotenv").config();

const express = require("express");
const router = require("./src/routes");
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

require("./src/socket")(io);

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api/v1/", router);

app.use("/uploads", express.static("uploads/"));
app.use("/uploads/product", express.static("uploads/product"));
app.use("/uploads/profile", express.static("uploads/profile"));

app.get("/", (req, res) => {
  res.send("DumbMerch Back End Runnin on Heroku");
});

server.listen(port, () => console.log(`Listening on port ${port}!`));