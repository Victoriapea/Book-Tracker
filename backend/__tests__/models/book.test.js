import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
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

describe("Book Model Test", () => {
  it("create and save book successfully", async () => {
    const validBook = new Book({
      title: "Test Book",
      author: "Test Author",
      status: "À lire",
      userId: new mongoose.Types.ObjectId(),
    });
    const savedBook = await validBook.save();

    expect(savedBook._id).toBeDefined();
    expect(savedBook.title).toBe(validBook.title);
    expect(savedBook.author).toBe(validBook.author);
    expect(savedBook.status).toBe(validBook.status);
    expect(savedBook.userId).toEqual(validBook.userId);
  });

  it("insert book with incorrect status fails", async () => {
    const bookWithInvalidStatus = new Book({
      title: "Invalid Book",
      author: "Invalid Author",
      status: "Invalid status",
      userId: new mongoose.Types.ObjectId(),
    });
    let err;
    try {
      await bookWithInvalidStatus.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});