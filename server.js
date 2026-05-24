
require('dotenv').config(); 
const express = require('express');

const roomRoutes = require('./routes/roomRoutes');
const app = express();
const pool = require('./config/db');

app.use(express.json());
app.use('/api/rooms', roomRoutes);

const PORT = process.env.PORT

console.log('📦 Pool imported:', pool ? '✅ defined' : '❌ undefined');

const startServer = async () => {
    try {
        // Test DB connection
        await pool.query('SELECT NOW()');
        console.log('✅ Database connected');
        
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
