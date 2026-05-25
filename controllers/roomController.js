const roomService = require('../services/roomService');

const createRoom = async (req, res) => {
    try {
        const { handle } = req.body;
        const result = await roomService.createRoom(handle);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(400).json({ error: error.message });
    }
};

const joinRoom = async (req, res) => {
    try {
        const { handle, roomCode } = req.body;
        const result = await roomService.joinRoom(handle, roomCode);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error joining room:', error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createRoom,
    joinRoom
};


