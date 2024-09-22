import mongoose from "mongoose";
import User from "../../src/models/User";
import { MongoMemoryServer } from "mongodb-memory-server";

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

describe("User Model Test", () => {
  it("create and save user successfully", async () => {
    const validUser = new User({
      username: "Test User",
      email: "Test Email",
      password: "Test Password",
      readingGoal: 0,
    });
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(validUser.username);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.password).toBe(validUser.password);
    expect(savedUser.readingGoal).toBe(validUser.readingGoal);
  });

  it("inser user with incorrect email fails", async () => {
    const userWithInvalidEmail = new User({
      userrname: "Invalid Usser",
      email: "Invalid Email",
      password: "Invalid Password",
      readingGoal: 0,
    });
    let err;
    try {
      await userWithInvalidEmail.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
