const userStore = require('../store/userStore');
const roomStore = require('../store/roomStore');
const participantStore = require('../store/participantStore');
const { generateRoomId, generateRoomCode } = require('../utils/roomGenerator');

const createRoom = async (handle) => {
    // 1. Find or create user
    let user = await userStore.findUserByHandle(handle);

    if (!user) {
        user = await userStore.createUser(handle);
    }

    // 2. Create room
    const roomId = generateRoomId();
    const roomCode = generateRoomCode();

    await roomStore.insertRoom({
        id: roomId,
        code: roomCode,
        status: 'waiting'
    });

    // 3. Add participant
    await participantStore.insertParticipant(user.id, roomId);

    return {
        roomId,
        roomCode
    };
};

module.exports = {
    createRoom
};