const pool = require('../config/db');

const insertRoom = async (room) => {
    await pool.query(
        'INSERT INTO rooms (id, code, status) VALUES ($1, $2, $3)',
        [room.id, room.code, room.status]
    );
};

module.exports = {
    insertRoom
};