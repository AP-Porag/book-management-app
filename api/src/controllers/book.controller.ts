import { Request, Response } from "express";
import Book from "../models/book.model";

interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}

// @desc Add a new book
// @route POST /api/books
// @access Private
export const addBook = async (req: AuthRequest, res: Response) => {
    try {
        const {
            title,
            author,
            genre,
            description,
            thumbnail,
            rating,
            year,
            shortDescription,
        } = req.body;

        const newBook = new Book({
            user: req.user?.userId,
            title,
            author,
            genre,
            description,
            thumbnail,
            rating,
            year,
            shortDescription,
        });

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc Edit a book
// @route PUT /api/books/:id
// @access Private
export const editBook = async (req: AuthRequest, res: Response) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) return res.status(404).json({ message: "Book not found" });

        if (book.user.toString() !== req.user?.userId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedBook);
    } catch (error) {
        console.error("Error editing book:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc Get a single book
export const getBookById = async (req: Request, res: Response) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) return res.status(404).json({ message: "Book not found" });

        res.json(book);
    } catch (error) {
        console.error("Error getting book:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc Delete a book
// @route DELETE /api/books/:id
// @access Private
export const deleteBook = async (req: AuthRequest, res: Response) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) return res.status(404).json({ message: "Book not found" });

        if (book.user.toString() !== req.user?.userId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Book.deleteOne({ _id: book._id });

        res.json({ message: "Book removed successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc Get all books (with pagination)
// @route GET /api/books?page=1&limit=10
// @access Private
export const getBooks = async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find({ user: req.user?.userId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Book.countDocuments({ user: req.user?.userId });

        res.json({
            books,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
