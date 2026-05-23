
const validateCreateRoom = (req, res, next) => {
    const { handle } = req.body;

    if (!handle) {
        return res.status(400).json({ error: 'handle is required' });
    }

    if (typeof handle !== 'string') {
        return res.status(400).json({ error: 'handle must be a string' });
    }

    if (handle.trim() === '') {
        return res.status(400).json({ error: 'handle cannot be empty' });
    }

    next();
};

module.exports = {
    validateCreateRoom
};