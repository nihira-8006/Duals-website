const userStore = require('../store/userStore');
const roomStore = require('../store/roomStore');
const participantStore = require('../store/participantStore');
const { generateRoomId, generateRoomCode } = require('../utils/roomGenerator');

const createRoom = async (handle) => {
    try {
        // NO console.logs, just the code
        let user = await userStore.findUserByHandle(handle);

        if (!user) {
            user = await userStore.createUser(handle);
        }

        const roomId = generateRoomId();
        const roomCode = generateRoomCode();

        await roomStore.insertRoom({
            id: roomId,
            code: roomCode,
            status: 'waiting'
        });

        await participantStore.insertParticipant(user.id, roomId);

        return {
            roomId,
            roomCode
        };

    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};

module.exports = {
    createRoom
};