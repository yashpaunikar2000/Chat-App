// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import http from "http";
// import { connectDB } from "./lib/db.js";
// import userRouter from "./routes/userRoutes.js";
// import messageRouter from "./routes/messageRoutes.js";
// import { Server } from "socket.io";

// // Create app and server
// const app = express();
// const server = http.createServer(app);

// // Load .env
// dotenv.config();

// // Allowed frontend origins
// const allowedOrigins = [
//   "https://chat-app-frontend-tau-henna.vercel.app",
//   "http://localhost:3000"
// ];

// // ✅ Express CORS setup
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// // ✅ Body parser
// app.use(express.json({ limit: "4mb" }));

// // ✅ Socket.IO CORS setup
// export const io = new Server(server, {
//   cors: {
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS - Socket.IO"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST"],
//   },
// });

// // Socket.IO Logic
// export const userSocketMap = {};
// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;
//   console.log("User Connected", userId);

//   if (userId) {
//     if (!userSocketMap[userId]) userSocketMap[userId] = new Set();
//     userSocketMap[userId].add(socket.id);
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   }

//   socket.on("disconnect", () => {
//     if (userId && userSocketMap[userId]) {
//       userSocketMap[userId].delete(socket.id);
//       if (userSocketMap[userId].size === 0) delete userSocketMap[userId];
//       io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     }
//   });
// });

// // API routes
// app.use("/api/status", (req, res) => res.send("Server is live"));
// app.use("/api/auth", userRouter);
// app.use("/api/messages", messageRouter);

// // Connect to DB
// await connectDB();

// // Start server
// if (process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT || 5000;
//   server.listen(PORT, () => console.log("Server running on PORT:", PORT));
// }

// export default server;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// create express app and HTTP server
const app = express();
const server = http.createServer(app);

// loading .env file
dotenv.config();

// initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// store online users with multiple sockets
export const userSocketMap = {}; // { userId: Set of socketIds }

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);

    // Emit updated online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);

    if (userId && userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);

      if (userSocketMap[userId].size === 0) {
        delete userSocketMap[userId];
      }

      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// route setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// connect to db
await connectDB();

// always listen (for both development and production)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));

// export server (for testing or optional use)
export default server;