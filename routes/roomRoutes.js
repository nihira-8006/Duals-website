const express = require('express');
const router = express.Router();

const roomController = require('../controllers/roomController');
const { validateCreateRoom, validateJoinRoom } = require('../middleware/validation');

router.post('/create', validateCreateRoom, roomController.createRoom);
router.post('/join', validateJoinRoom, roomController.joinRoom);
router.get('/:roomId/status', roomController.getRoomStatus);
router.delete('/:roomId/leave', roomController.leaveRoom);
module.exports = router;