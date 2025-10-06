import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Serve static files from the root folder
app.use(express.static(__dirname));

// Store users per room
const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (room, username) => {
    socket.join(room);
    if (!rooms[room]) rooms[room] = {};
    rooms[room][socket.id] = username;

    socket.to(room).emit("user-joined", username);
    console.log(`${username} joined room ${room}`);
  });

  socket.on("send-message", (room, data) => {
    socket.to(room).emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    for (let room in rooms) {
      if (rooms[room][socket.id]) {
        const username = rooms[room][socket.id];
        socket.to(room).emit("user-left", username);
        delete rooms[room][socket.id];
        console.log(`${username} left room ${room}`);
      }
    }
  });
});

// Start server
const PORT = 4000;   // new port

httpServer.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
