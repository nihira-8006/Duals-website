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

module.exports = {
    validateCreateRoom
};