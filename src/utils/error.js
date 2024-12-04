exports.notFound = (req, res) => {
    res.status(404).json({ error: 'Not found', message: 'The requested resource does not exist' });
};

exports.errorHandler = (error, req, res, next) => {
    res.status(500).json({ error: 'Internal server error', message: error.message });
};