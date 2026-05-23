const roomService = require('../services/roomService');

const createRoom = async (req, res) => {
    const { handle } = req.body;

    const result = await roomService.createRoom(handle);

    res.status(201).json(result);
};

module.exports = {
    createRoom
};