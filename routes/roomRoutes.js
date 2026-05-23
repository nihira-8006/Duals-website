const express = require('express');
const router = express.Router();

const roomController = require('../controllers/roomController');
const { validateCreateRoom } = require('../middleware/validation');

router.post('/create', validateCreateRoom, roomController.createRoom);

module.exports = router;