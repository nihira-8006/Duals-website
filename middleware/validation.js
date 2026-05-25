const validateCreateRoom = (req, res, next) => {
    const { handle } = req.body;
    
    if (!handle) {
        return res.status(400).json({ error: 'handle is required' });
    }
    
    if (typeof handle !== 'string') {
        return res.status(400).json({ error: 'handle must be string' });
    }
    
    if (handle.trim() === '') {
        return res.status(400).json({ error: 'handle cannot be empty' });
    }
    
    if (handle.length < 3 || handle.length > 20) {
        return res.status(400).json({ error: 'handle must be 3-20 chars' });
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(handle)) {
        return res.status(400).json({ error: 'invalid characters in handle' });
    }
    
    next();
};

const validateJoinRoom = (req, res, next) => {
    const { handle, roomCode } = req.body;

    if (!handle) {
        return res.status(400).json({ error: 'handle is required' });
    }

    if (!roomCode) {
        return res.status(400).json({ error: 'roomCode is required' });
    }

    if (typeof handle !== 'string') {
        return res.status(400).json({ error: 'handle must be a string' });
    }

    if (typeof roomCode !== 'string') {
        return res.status(400).json({ error: 'roomCode must be a string' });
    }

    if (handle.trim() === '') {
        return res.status(400).json({ error: 'handle cannot be empty' });
    }

    if (roomCode.trim() === '') {
        return res.status(400).json({ error: 'roomCode cannot be empty' });
    }

    if (handle.length < 3 || handle.length > 20) {
        return res.status(400).json({ error: 'handle must be 3-20 characters' });
    }

    if (roomCode.length < 4 || roomCode.length > 10) {
        return res.status(400).json({ error: 'roomCode must be 4-10 characters' });
    }

    next();
};

module.exports = {
    validateCreateRoom,
    validateJoinRoom
};