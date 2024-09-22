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

describe('Auth Routes', () => {
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
  });

  it('should login an existing user', async () => {
    const password = 'TestPassword';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username: 'TestUser',
      email: 'test@example.com',
      password: hashedPassword,
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
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  it('should return an error if the user does not exist', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'TestPassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', "L'utilisateur n'existe pas");
  });

  it('should return an error if the password is incorrect', async () => {
    const password = 'TestPassword';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username: 'TestUser',
      email: 'test@example.com',
      password: hashedPassword,
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
});