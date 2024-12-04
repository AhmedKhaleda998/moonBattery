const request = require('supertest');
const app = require('../src/app');
const { 
    connectTestDatabase, 
    clearDatabase, 
    disconnectTestDatabase 
} = require('./utils/testDatabase');
const Battery = require('../src/models/battery');
const {generateToken} = require('../src/utils/jwt');

describe('Battery API Tests', () => {
    beforeAll(async () => {
        await connectTestDatabase();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await disconnectTestDatabase();
    });

    describe('POST /api/batteries/register', () => {
        it('should register a new battery and return a token and serial number', async () => {
            const macAddress = 'AA:BB:CC:DD:EE:FF';

            const response = await request(app)
                .post('/api/batteries/register')
                .send({ macAddress });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('serialNumber');
        });

        it('should not register a battery with an invalid MAC address', async () => {
            const macAddress = 'INVALID_MAC';

            const response = await request(app)
                .post('/api/batteries/register')
                .send({ macAddress });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });

        it('should not register a battery if it already exists', async () => {
            const macAddress = 'AA:BB:CC:DD:EE:FF';
            await new Battery({ macAddress, serialNumber: '1234567890AB' }).save();

            const response = await request(app)
                .post('/api/batteries/register')
                .send({ macAddress });

            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe('A battery with this MAC address already exists');
        });
    });

    describe('POST /api/batteries/ping', () => {
        it('should update the last ping time and log it', async () => {
            const macAddress = 'AA:BB:CC:DD:EE:FF';
            const serialNumber = '1234567890AB';
            
            const battery = new Battery({ macAddress, serialNumber });
            await battery.save();

            const payload = { serialNumber, macAddress };
            const response = await request(app)
                .post('/api/batteries/ping')
                .set('Authorization', `Bearer ${generateToken(payload)}`)
                .send({ macAddress });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Battery pinged successfully');

            const updatedBattery = await Battery.findOne({ macAddress });
            expect(updatedBattery.ping.logs.length).toBe(1);
        });

        it('should return unauthorized if the token is invalid', async () => {
            const macAddress = 'AA:BB:CC:DD:EE:FF';

            const response = await request(app)
                .post('/api/batteries/ping')
                .set('Authorization', 'Bearer invalid_token')
                .send({ macAddress });

            expect(response.status).toBe(400)
        });
    });
});
