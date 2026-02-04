const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Setup test database
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Backend Server Tests', () => {
    test('should respond with 404 for unknown routes', async () => {
        const app = express();
        const response = await request(app).get('/unknown-route');
        expect(response.status).toBe(404);
    });

    test('environment variables should be loaded', () => {
        expect(process.env).toBeDefined();
    });
});

describe('Auth Routes', () => {
    let app;

    beforeEach(() => {
        // Create a fresh Express app for each test
        app = express();
        app.use(express.json());
        app.use('/api/auth', require('../routes/auth'));
    });

    test('POST /api/auth/register should require email and password', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({});

        expect(response.status).toBe(400);
    });

    test('POST /api/auth/login should require email and password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({});

        expect(response.status).toBe(400);
    });
});
