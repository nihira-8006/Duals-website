const pool = require('../config/db');
const { ROOM_STATUS } = require('../config/constants');

const insertRoom = async (room) => {
    try {
        // 🔍 1. Basic validation
        if (!room || typeof room !== 'object') {
            throw new Error('Room object is required');
        }

        const { id, code, status } = room;

        // Validate id (UUID)
        if (!id) {
            throw new Error('Room id is required');
        }

        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!UUID_REGEX.test(id)) {
            throw new Error('Room id must be a valid UUID');
        }

        // Validate code
        if (!code || typeof code !== 'string') {
            throw new Error('Room code must be a non-empty string');
        }

        if (code.length < 4 || code.length > 10) {
            throw new Error('Room code must be 4-10 characters');
        }

        if (!/^[a-zA-Z0-9]+$/.test(code)) {
            throw new Error('Room code can only contain letters and numbers');
        }

        // Validate status
        if (!status || typeof status !== 'string') {
            throw new Error('Room status is required and must be a string');
        }

        const validStatuses = Object.values(ROOM_STATUS);
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }

        // 🚀 2. Insert into DB
        const result = await pool.query(
            `INSERT INTO rooms (id, code, status) 
             VALUES ($1, $2, $3)
             RETURNING *`,
            [id, code, status]
        );

        // ✅ 3. Return inserted row
        return result.rows[0];

    } catch (error) {
        // 🧾 4. Proper logging
        console.error('Error inserting room:', {
            message: error.message,
            code: error.code,
            roomId: room?.id,
            roomCode: room?.code,
            status: room?.status
        });

        // 🔄 5. Handle specific database errors
        if (error.code === '23505') {
            throw new Error('Room code already exists - choose a different code');
        }

        if (error.code === '23503') {
            throw new Error('Invalid reference in room data');
        }

        if (error.code === '23502') {
            throw new Error('Missing required room data');
        }

        // ❗ 6. Re-throw for controller to handle
        throw error;
    }
};


const findRoomByCode = async (roomCode) => {
    try {
        console.log('🔍 Finding room by code:', roomCode);
        
        const result = await pool.query(
            `SELECT * FROM rooms WHERE code = $1`,
            [roomCode]
        );

        return result.rows[0];

    } catch (error) {
        console.error('Error finding room by code:', error.message);
        throw error;
    }
};

const updateRoomStatus = async (roomId, status) => {
    try {
        console.log('📝 Updating room status:', roomId, '→', status);
        
        const result = await pool.query(
            `UPDATE rooms SET status = $1 WHERE id = $2 RETURNING *`,
            [status, roomId]
        );

        return result.rows[0];  // ✅ Already updated, don't fetch again

    } catch (error) {
        console.error('Error updating room status:', error.message);
        throw error;
    }
};

module.exports = {
    insertRoom,
    findRoomByCode,
    updateRoomStatus
};