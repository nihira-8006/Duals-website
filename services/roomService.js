const userStore = require('../store/userStore');
const roomStore = require('../store/roomStore');
const participantStore = require('../store/participantStore');
const { generateRoomId, generateRoomCode } = require('../utils/roomGenerator');
const { MAX_PLAYERS, ROOM_STATUS } = require('../config/constants');

const createRoom = async (handle) => {
    try {
        console.log('🔍 Creating room for handle:', handle);
        
        // 1. Find or create user
        console.log('📍 Step 1: Finding or creating user...');
        let user = await userStore.findUserByHandle(handle);

        if (!user) {
            console.log('   User not found, creating new user...');
            user = await userStore.createUser(handle);
            console.log('   ✅ User created:', user.id);
        } else {
            console.log('   ✅ User found:', user.id);
        }

        // 2. Create room
        console.log('📍 Step 2: Generating room ID and code...');
        const roomId = generateRoomId();
        const roomCode = generateRoomCode();
        console.log('   ✅ Generated roomId:', roomId);
        console.log('   ✅ Generated roomCode:', roomCode);

        console.log('📍 Step 3: Inserting room into database...');
        await roomStore.insertRoom({
            id: roomId,
            code: roomCode,
            status: ROOM_STATUS.WAITING
        });
        console.log('   ✅ Room inserted');

        // 3. Add participant
        console.log('📍 Step 4: Adding participant...');
        await participantStore.insertParticipant(user.id, roomId);
        console.log('   ✅ Participant added');

        console.log('✅ Room created successfully');
        
        return {
            roomId,
            roomCode
        };

    } catch (error) {
        console.error('❌ Error in createRoom:');
        console.error('   Message:', error.message);
        console.error('   Stack:', error.stack);
        throw error;
    }
};

// ✅ NEW: JOIN ROOM
const joinRoom = async (handle, roomCode) => {
    try {
        console.log('🔍 Joining room - Handle:', handle, 'Code:', roomCode);
        
        // 1. Find room by code
        console.log('📍 Step 1: Finding room by code...');
        const room = await roomStore.findRoomByCode(roomCode);
        
        if (!room) {
            throw new Error('Room not found');
        }
        console.log('   ✅ Room found:', room.id);

        // 2. Check room status
        console.log('📍 Step 2: Checking room status...');
        if (room.status !== ROOM_STATUS.WAITING) {
            throw new Error(`Cannot join room. Room status is ${room.status}`);
        }
        console.log('   ✅ Room is waiting');

        // 3. Check participant count
        console.log('📍 Step 3: Checking participant count...');
        const participantCount = await participantStore.countParticipants(room.id);
        
        if (participantCount >= MAX_PLAYERS) {
            throw new Error(`Room is full. Max players: ${MAX_PLAYERS}`);
        }
        console.log('   ✅ Room has space:', participantCount, '/', MAX_PLAYERS);

        // 4. Find or create user
        console.log('📍 Step 4: Finding or creating user...');
        let user = await userStore.findUserByHandle(handle);
        
        if (!user) {
            console.log('   User not found, creating new user...');
            user = await userStore.createUser(handle);
            console.log('   ✅ User created:', user.id);
        } else {
            console.log('   ✅ User found:', user.id);
        }

        // 5. Check if user already in room
        console.log('📍 Step 5: Checking if user already in room...');
        const userInRoom = await participantStore.isUserInRoom(user.id, room.id);
        
        if (userInRoom) {
            throw new Error('User already in this room');
        }
        console.log('   ✅ User not already in room');

        // 6. Add participant
        console.log('📍 Step 6: Adding participant to room...');
        await participantStore.insertParticipant(user.id, room.id);
        console.log('   ✅ Participant added');

        // 7. Check if room is now full and update status
        console.log('📍 Step 7: Checking if room is now full...');
        const newParticipantCount = await participantStore.countParticipants(room.id);
        
        let updatedRoom = room;  // ✅ Use the original room object
        
        if (newParticipantCount === MAX_PLAYERS) {
            console.log('   Room is now full, updating status to ACTIVE...');
            updatedRoom = await roomStore.updateRoomStatus(room.id, ROOM_STATUS.ACTIVE);
            // ✅ updatedRoom is returned from UPDATE query (RETURNING *)
            console.log('   ✅ Room status updated to ACTIVE');
        }

        // 8. Get all participants
        console.log('📍 Step 8: Getting all participants...');
        const participants = await participantStore.getParticipantsByRoomId(room.id);
        console.log('   ✅ Got', participants.length, 'participants');

        console.log('✅ Successfully joined room');

        return {
            roomId: room.id,
            participants: participants.map(p => ({
                id: p.user_id,
                handle: p.handle
            })),
            status: updatedRoom.status  // ✅ Use updatedRoom.status
        };

    } catch (error) {
        console.error('❌ Error in joinRoom:');
        console.error('   Message:', error.message);
        console.error('   Stack:', error.stack);
        throw error;
    }
};

module.exports = {
    createRoom,
    joinRoom
};
