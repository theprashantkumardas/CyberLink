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
const io = new Server(server, { cors: { origin: "*" } });

// Init
connectDB();
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Socket Logic
socketManager(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`>> CYBER_LINK CORE: PORT ${PORT}`));