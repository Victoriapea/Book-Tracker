import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import * as bookController from "../../src/controllers/bookController";
import Book from "../../src/models/Book";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Book Controller Test", () => {
  it("should add a book", (done) => {
    const req = {
      body: {
        title: "Test Book",
        author: "Test Author",
        status: "Terminé",
      },
      user: { id: new mongoose.Types.ObjectId() },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    bookController.addBook(req, res);
    setTimeout(() => {
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Book",
          author: "Test Author",
          status: "Terminé",
        })
      );
      done();
    }, 500);
  });

  it("should get books for a user", (done) => {
    const userId = new mongoose.Types.ObjectId();
    Book.create([
      {
        title: "Test Book 1",
        author: "Test Author 1",
        status: "Terminé",
        userId,
      },
      {
        title: "Test Book 2",
        author: "Test Author 2",
        status: "À lire",
        userId,
      },
    ])
      .then(() => {
        const req = { user: { id: userId } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

        bookController.getBooks(req, res);
        setTimeout(() => {
          expect(res.json).toHaveBeenCalledWith(
            expect.arrayContaining([
              expect.objectContaining({ title: "Test Book 1" }),
              expect.objectContaining({ title: "Test Book 2" }),
            ])
          );
          done();
        }, 200);
      })
      .catch((err) => {
        done(err);
      });
  });

  it("should update a book", (done) => {
    const userId = new mongoose.Types.ObjectId();
    Book.create({
      title: "Test Book",
      author: "Test Author",
      status: "Terminé",
      userId,
    })
      .then((createdBook) => {
        const req = {
          params: { id: createdBook._id },
          body: { title: "Updated Book", author: "Updated Author", status: "À lire" },
          user: { id: userId },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

        bookController.updateBook(req, res);
        setTimeout(() => {
          expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
              title: "Updated Book",
              author: "Updated Author",
              status: "À lire",
            })
          );
          done();
        }, 200);
      })
      .catch((err) => {
        done(err);
      });
  });

  it("should delete a book", (done) => {
    const userId = new mongoose.Types.ObjectId();
    Book.create({
      title: "Test Book",
      author: "Test Author",
      status: "Terminé",
      userId,
    })
      .then((createdBook) => {
        const req = {
          params: { id: createdBook._id },
          user: { id: userId },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

        bookController.deleteBook(req, res);
        setTimeout(() => {
          expect(res.json).toHaveBeenCalledWith({ message: "Livre supprimé avec succès" });
          done();
        }, 200);
      })
      .catch((err) => {
        done(err);
      });
  });

  it("should get reading stats", (done) => {
    const userId = new mongoose.Types.ObjectId();
    Book.create([
      {
        title: "Test Book 1",
        author: "Test Author 1",
        status: "Terminé",
        userId,
      },
      {
        title: "Test Book 2",
        author: "Test Author 2",
        status: "À lire",
        userId,
      },
      {
        title: "Test Book 3",
        author: "Test Author 3",
        status: "En cours",
        userId,
      },
    ])
      .then(() => {
        const req = { user: { id: userId } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

        bookController.getReadingStats(req, res);
        setTimeout(() => {
          expect(res.json).toHaveBeenCalledWith({
            totalBooks: 3,
            readBooks: 1,
            readingBooks: 1,
            toReadBooks: 1,
          });
          done();
        }, 200);
      })
      .catch((err) => {
        done(err);
      });
  });
});