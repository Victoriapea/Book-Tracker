import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  addBook,
  getBooks,
  updateBook,
  deleteBook,
  getReadingStats,
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/", verifyToken, addBook);
router.get("/", verifyToken, getBooks);
router.put("/:id", verifyToken, updateBook);
router.delete("/:id", verifyToken, deleteBook);
router.get("/stats", verifyToken, getReadingStats);

export default router;
