require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const roomRoutes = require('./routes/roomRoutes');
const duelRoutes = require('./routes/duelRoutes');
const pool = require('./config/db');

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/duels', duelRoutes);

// Health check
app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
});

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket logic
io.on('connection', (socket) => {
    console.log(`⚡ New WebSocket connection: ${socket.id}`);

    socket.on('join_room', (data) => {
        const { roomId, handle } = data;

        socket.join(roomId);

        console.log(`🚪 [${handle}] joined socket room: ${roomId}`);

        socket.to(roomId).emit('room_update', {
            message: `${handle} has joined the room!`,
            handle: handle
        });
    });

    socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.id}`);
    });
});

// Start server
const startServer = async () => {
    try {
        await pool.query('SELECT NOW()');

        console.log('✅ Database connected');

        server.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();