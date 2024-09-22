import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from '../../src/routes/authRoutes.js';
import bookRoutes from '../../src/routes/bookRoutes.js';
import User from '../../src/models/User.js';
import Book from '../../src/models/Book.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let mongoServer;
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

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

describe('Book Routes', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Book.deleteMany({});

    const password = 'TestPassword';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username: 'TestUser',
      email: 'test@example.com',
      password: hashedPassword,
    });
    
    const savedUser = await user.save();
    userId = savedUser._id;
    
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
  });

  it('should add a new book', async () => {
    const res = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Book',
        author: 'Test Author',
        status: 'À lire',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Test Book');
    expect(res.body).toHaveProperty('author', 'Test Author');
  });

  it('should get all books for the user', async () => {
    const book = new Book({
      title: 'Test Book',
      author: 'Test Author',
      status: 'À lire',
      userId,
    });
    await book.save();

    const res = await request(app)
      .get('/books')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('title', 'Test Book');
  });

  it('should update a book', async () => {
    const book = new Book({
      title: 'Test Book',
      author: 'Test Author',
      status: 'À lire',
      userId,
    });
    await book.save();

    const res = await request(app)
      .put(`/books/${book._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Book',
        author: 'Updated Author',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Updated Book');
  });

  it('should delete a book', async () => {
    const book = new Book({
      title: 'Test Book',
      author: 'Test Author',
      status: 'À lire',
      userId,
    });
    await book.save();

    const res = await request(app)
      .delete(`/books/${book._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Livre supprimé avec succès');
  });

  it('should return reading stats', async () => {
    const books = [
      { title: 'Book 1', author: 'Author 1', status: 'Terminé', userId },
      { title: 'Book 2', author: 'Author 2', status: 'En cours', userId },
      { title: 'Book 3', author: 'Author 3', status: 'À lire', userId },
    ];

    await Book.insertMany(books);

    const res = await request(app)
      .get('/books/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('totalBooks', 3);
    expect(res.body).toHaveProperty('readBooks', 1);
    expect(res.body).toHaveProperty('readingBooks', 1);
    expect(res.body).toHaveProperty('toReadBooks', 1);
  });
});
