require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const connection = require('./configurations/database');

const batteryRoutes = require('./routes/battery');

const { notFound } = require('./utils/error');

const appLimiter = require('./middlewares/ratelimit');

const app = express();

app.use(appLimiter);

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to moonBattery API' });
});

app.use('/api/batteries', batteryRoutes);
app.use(notFound);

const PORT = process.env.PORT || 5000;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

connection(CONNECTION_STRING).then(() => {
    app.listen(PORT, () => {
        console.log(`moonBattery server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error(error);
    process.exit();
});

module.exports = app;