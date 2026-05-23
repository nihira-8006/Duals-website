const pool = require('../config/db');
const { randomUUID } = require('crypto');

const findUserByHandle = async (handle) => {
    const res = await pool.query(
        'SELECT * FROM users WHERE handle = $1',
        [handle]
    );
    return res.rows[0];
};

const createUser = async (handle) => {
    const id = randomUUID();

    const res = await pool.query(
        'INSERT INTO users (id, handle) VALUES ($1, $2) RETURNING *',
        [id, handle]
    );

    return res.rows[0];
};

module.exports = {
    findUserByHandle,
    createUser
};