const pool = require('../config/db');
const { randomUUID } = require('crypto');

const insertParticipant = async (userId, roomId) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        if (!roomId) {
            throw new Error('Room ID is required');
        }

        const result = await pool.query(
            `INSERT INTO participants (id, user_id, room_id) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [randomUUID(), userId, roomId]
        );

        return result.rows[0];

    } catch (error) {
        console.error('Error inserting participant:', {
            message: error.message,
            userId,
            roomId
        });

        if (error.code === '23503') {
            throw new Error('Invalid user or room reference');
        }

        if (error.code === '23505') {
            throw new Error('User already in this room');
        }

        throw error;
    }
};


const getParticipantsByRoomId = async (roomId) => {
    try {
        console.log(' Getting participants for room:', roomId);
        
        const result = await pool.query(
            `SELECT p.id, p.user_id, u.handle, p.joined_at
             FROM participants p
             JOIN users u ON p.user_id = u.id
             WHERE p.room_id = $1
             ORDER BY p.joined_at ASC`,
            [roomId]
        );

        console.log('   Found participants:', result.rows.length);
        return result.rows;

    } catch (error) {
        console.error('Error getting participants:', error.message);
        throw error;
    }
};


const isUserInRoom = async (userId, roomId) => {
    try {
        console.log('🔍 Checking if user in room:', userId, roomId);
        
        const result = await pool.query(
            `SELECT * FROM participants 
             WHERE user_id = $1 AND room_id = $2`,
            [userId, roomId]
        );

        const exists = result.rows.length > 0;
        console.log('   User in room:', exists);
        return exists;

    } catch (error) {
        console.error('Error checking if user in room:', error.message);
        throw error;
    }
};

const countParticipants = async (roomId) => {
    try {
        console.log('📊 Counting participants in room:', roomId);
        
        const result = await pool.query(
            `SELECT COUNT(*) as count FROM participants WHERE room_id = $1`,
            [roomId]
        );

        const count = parseInt(result.rows[0].count, 10);
        console.log('   Count:', count);
        return count;

    } catch (error) {
        console.error('Error counting participants:', error.message);
        throw error;
    }
};




const deleteParticipant = async (userId, roomId) => {
    try {
        console.log('🗑️ Removing participant from room:', userId, roomId);
        
        const result = await pool.query(
            `DELETE FROM participants WHERE user_id = $1 AND room_id = $2 RETURNING *`,
            [userId, roomId]
        );

        console.log('   ✅ Participant removed');
        return result.rows[0];

    } catch (error) {
        console.error('Error deleting participant:', error.message);
        throw error;
    }
};
module.exports = {
    insertParticipant,
    getParticipantsByRoomId,
    isUserInRoom,
    countParticipants,
    deleteParticipant
};
