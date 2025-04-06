import express from "express";
import { addBook, editBook, deleteBook, getBooks,getBookById } from "../controllers/book.controller";
import { authenticate } from '../middleware';

const router = express.Router();

router.post("/", authenticate, addBook);
router.put("/:id", authenticate, editBook);
router.get("/:id", authenticate, getBookById);
router.delete("/:id", authenticate, deleteBook);
router.get("/", authenticate, getBooks);

export default router;
