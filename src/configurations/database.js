const mongoose = require('mongoose');

const connection = async (connectionString) => {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to database');
    } catch (error) {
        console.error(error);
    }
};

module.exports = connection;