require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const socketManager = require('./sockets/socketManager');

const app = express();
const server = http.createServer(app);

// --- 1. DEFINE ALLOWED ORIGINS ---
// List every URL that needs to access your backend
const allowedOrigins = [
  "http://localhost:3000",                  // Localhost for development
  "https://cyberlink-404.onrender.com"      // Your DEPLOYED Frontend
];

// --- 2. CONFIGURE EXPRESS CORS ---
// We do this BEFORE any routes
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // Allow cookies/headers if needed
}));

app.use(express.json());

// Init Database
connectDB();

// Routes
app.use('/auth', authRoutes);

// --- 3. CONFIGURE SOCKET.IO CORS ---
const io = new Server(server, { 
  cors: { 
    origin: allowedOrigins, // Use the same specific list
    methods: ["GET", "POST"],
    credentials: true
  } 
});

// Socket Logic
socketManager(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`>> CYBER_LINK CORE: PORT ${PORT}`));