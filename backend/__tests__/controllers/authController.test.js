import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from '../../src/routes/authRoutes.js';
import User from '../../src/models/User.js';
import bcrypt from 'bcryptjs';

let mongoServer;
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  process.env.JWT_SECRET = 'testsecret';
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'TestUser',
        email: 'test@example.com',
        password: 'TestPassword',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', 'TestUser');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');

    const userInDb = await User.findOne({ email: 'test@example.com' });
    expect(userInDb).not.toBeNull();
    expect(userInDb.username).toBe('TestUser');
  });

  it('should not register a user with an existing email', async () => {
    const user = new User({
      username: 'TestUser',
      email: 'test@example.com',
      password: await bcrypt.hash('TestPassword', 10),
    });
    await user.save();

    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'AnotherUser',
        email: 'test@example.com',
        password: 'AnotherPassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should log in an existing user', async () => {
    const user = new User({
      username: 'TestUser',
      email: 'test@example.com',
      password: await bcrypt.hash('TestPassword', 10),
    });
    await user.save();

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPassword',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', 'TestUser');
  });

  it('should not log in with an incorrect password', async () => {
    const user = new User({
      username: 'TestUser',
      email: 'test@example.com',
      password: await bcrypt.hash('TestPassword', 10),
    });
    await user.save();

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Mot de passe incorrect');
  });

  it('should not log in with a non-existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'SomePassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', "L'utilisateur n'existe pas");
  });
});
