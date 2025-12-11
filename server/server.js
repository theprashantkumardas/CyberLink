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

// --- 1. ALLOWED ORIGINS ---
// EXACT URL of your frontend (No trailing slash)
const allowedOrigins = [
  "http://localhost:3000",
  "https://cyberlink-404.onrender.com" 
];

// --- 2. CORS OPTIONS ---
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("BLOCKED BY CORS:", origin); // Log the blocked origin for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// --- 3. APPLY MIDDLEWARE ---
// Apply CORS before anything else
app.use(cors(corsOptions));

// Explicitly handle Preflight (OPTIONS) requests
app.options('*', cors(corsOptions));

app.use(express.json());

// Init Database
connectDB();

// Routes
app.use('/auth', authRoutes);

// Health Check Route (To see if server is awake)
app.get('/', (req, res) => {
  res.send('CYBER_LINK SERVER ONLINE');
});

// --- 4. SOCKET.IO SETUP ---
const io = new Server(server, { 
  cors: corsOptions // Reuse the same strict options
});

socketManager(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`>> CYBER_LINK CORE: PORT ${PORT}`));