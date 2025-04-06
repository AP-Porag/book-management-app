import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    author: string;
    genre: string;
    description: string;
    thumbnail: string;
    rating: string;
    year: string;
    shortDescription: string;
}

const bookSchema = new Schema<IBook>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        author: { type: String, required: false },
        genre: { type: String, required: false },
        description: { type: String, required: false },
        thumbnail: { type: String, required: false },
        rating: { type: String, required: false },
        year: { type: String, required: false },
        shortDescription: { type: String, required: false },
    },
    { timestamps: true }
);

export default mongoose.model<IBook>('Book', bookSchema);
