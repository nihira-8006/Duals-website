const pool = require('../config/db');
const { randomUUID } = require('crypto');

const insertParticipant = async (userId, roomId) => {
    await pool.query(
        'INSERT INTO participants (id, user_id, room_id) VALUES ($1, $2, $3)',
        [randomUUID(), userId, roomId]
    );
};

module.exports = {
    insertParticipant
};