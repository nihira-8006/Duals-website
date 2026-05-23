const { randomUUID } = require('crypto');

const generateRoomId = () => {
    return randomUUID();
};

const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8);
};

module.exports = {
    generateRoomId,
    generateRoomCode
};