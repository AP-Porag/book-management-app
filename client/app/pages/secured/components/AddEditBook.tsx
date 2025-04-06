import React, {
    useImperativeHandle,
    useState,
    forwardRef,
    useRef,
} from "react";
import { useForm, Form } from "react-hook-form";
import {
    Button,
    Modal,
    TextInput,
    Textarea,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import API from "@/utils/axios";

// Type for a single book entry
export type BookEntity = {
    _id?: string;
    user?: string;
    title: string;
    author: string;
    genre: string;
    description: string;
    thumbnail: string;
    rating: string;
    year: string;
    shortDescription: string;
};

// Props expected by this component
type AddEditBookProps = {
    onSave?: () => void;
};

// The component uses forwardRef to expose a `.show()` method
const AddEditBook = forwardRef(({ onSave }: AddEditBookProps, ref) => {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [book, setBook] = useState<BookEntity | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const {
        register,
        control,
        formState: { errors },
        reset,
        handleSubmit,
        setValue,
    } = useForm<BookEntity>({
        mode: "onChange",
    });

    // Expose the `.show()` method to the parent
    useImperativeHandle(ref, () => ({
        show: (bookData?: BookEntity) => {
            setBook(bookData || null);

            if (bookData) {
                // Pre-fill form if editing
                reset(bookData);
                setPreview(bookData.thumbnail);
            } else {
                // Reset form for adding new book
                reset();
                setPreview(null);
            }

            setIsOpen(true);
        },
    }));

    // Convert image file to base64 and update form
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            const base64 = reader.result as string;
            setValue("thumbnail", base64);
            setPreview(base64);
        };

        reader.onerror = (error) => {
            console.error("Error converting image to base64:", error);
        };
    };

    // Save new book to database
    const addBook = async (data: BookEntity) => {
        setLoading(true);
        try {
            const response = await API.post("/books", data);
            if (response.status === 201) {
                showNotification({
                    message: "Book saved successfully!",
                    color: "green",
                    position: "top-right",
                });
                setIsOpen(false);
                onSave?.();
                reset(); // Reset form after success
                setPreview(null);
            }
        } catch (error) {
            console.error("Error adding book:", error);
        } finally {
            setLoading(false);
        }
    };

    // Update existing book in database
    const editBook = async (data: BookEntity) => {
        if (!book?._id) return;
        setLoading(true);
        try {
            const response = await API.put(`/books/${book._id}`, data);
            if (response.status === 201 || response.status === 200) {
                showNotification({
                    message: "Book updated successfully!",
                    color: "green",
                    position: "top-right",
                });
                setIsOpen(false);
                onSave?.();
                reset(); // Reset form after success
                setPreview(null);
            }
        } catch (error) {
            console.error("Error updating book:", error);
        } finally {
            setLoading(false);
        }
    };

    // Submit handler (add or edit based on book state)
    const onSubmit = (data: BookEntity) => {
        book ? editBook(data) : addBook(data);
    };

    return (
        <Modal
            title={book ? "Edit Book" : "Add New Book"}
            opened={isOpen}
            size="lg"
            onClose={() => {
                setIsOpen(false);
                reset();
                setPreview(null);
            }}
        >
            <Form control={control} onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                {/* Thumbnail Preview */}
                {preview && (
                    <div className="mt-4">
                        <h2>Preview:</h2>
                        <img src={preview} alt="Preview" width={200} />
                    </div>
                )}

                {/* Thumbnail File Upload */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-4 border-1 border-[#efefef] p-2 rounded-md"
                />

                {/* Title */}
                <TextInput
                    label="Title"
                    {...register("title", { required: "Book title is required!" })}
                    error={errors.title?.message}
                />

                {/* Author */}
                <TextInput
                    label="Author"
                    {...register("author", { required: "Book author is required!" })}
                    error={errors.author?.message}
                />

                {/* Genre */}
                <TextInput
                    label="Genre"
                    {...register("genre", { required: "Book genre is required!" })}
                    error={errors.genre?.message}
                />

                {/* Rating */}
                <TextInput
                    label="Rating"
                    type="number"
                    {...register("rating", { required: "Book rating is required!" })}
                    error={errors.rating?.message}
                />

                {/* Year */}
                <TextInput
                    label="Publishing Year"
                    type="number"
                    {...register("year", { required: "Publishing year is required!" })}
                    error={errors.year?.message}
                />

                {/* Short Description */}
                <Textarea
                    label="Short Description"
                    placeholder="Short summary..."
                    {...register("shortDescription", { required: "Short description is required!" })}
                    error={errors.shortDescription?.message}
                />

                {/* Full Description */}
                <Textarea
                    label="Full Description"
                    placeholder="More detailed description..."
                    {...register("description", { required: "Description is required!" })}
                    error={errors.description?.message}
                />

                {/* Submit Button */}
                <Button color="black" loading={loading} type="submit">
                    {book ? "Update" : "Save"}
                </Button>
            </Form>
        </Modal>
    );
});

export default AddEditBook;
