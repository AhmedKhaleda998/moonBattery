const mongoose = require('mongoose');

exports.connectTestDatabase = async () => {
    const connectionString = process.env.CONNECTION_STRING;
    await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
};

exports.disconnectTestDatabase = async () => {
    await mongoose.disconnect();
};