exports.checkHealth = (req, res) => {
    res.json({ status: 'OK', message: 'API is running smoothly.' });
};