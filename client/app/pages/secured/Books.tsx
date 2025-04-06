import React, { useEffect, useRef, useState } from 'react';
import AddEditBook, { type BookEntity } from "@/pages/secured/components/AddEditBook";
import API from "@/utils/axios";
import { useSetState } from "@mantine/hooks";
import {
    Button,
    Pagination,
    Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import {showNotification} from "@mantine/notifications";

const Books: React.FC = () => {
    const { user } = useAuth();
    const addEditBookRef = useRef<any>(null);

    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState<BookEntity[]>([]);

    const [pagination, setPagination] = useSetState({
        total: 0,
        page: 1,
        limit: 5,
    });

    // Fetch all books for the logged-in user
    const loadBooksData = () => {
        setLoading(true);
        API.get("/books", { params: pagination })
            .then(({ data, status }) => {
                if (status === 200) {
                    setBooks(data.books);
                    setPagination({ total: data.total });
                }
            })
            .catch((error) => {
                console.error("Error fetching books", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadBooksData();
    }, [pagination.page]);

    // Show confirmation modal and delete a book
    const openDeleteModal = (book: BookEntity) =>
        modals.openConfirmModal({
            title: 'Please confirm your action',
            children: <Text size="sm">Are you sure you want to delete <strong>{book.title}</strong>?</Text>,
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                setLoading(true);
                const { status } = await API.delete(`/books/${book._id}`)
                    .then(({ data, status }) => {
                        if (status === 200) {
                            showNotification({
                                message: "Book deleted successfully!",
                                color: "green",
                                position: "top-right",
                            });
                            loadBooksData()
                        }
                })
                    .catch((error) => {
                        console.error("Error deleting books", error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            },
        });

    // Show full details of a book
    const openDetailsModal = (book: BookEntity) =>
        modals.open({
            title: book.title,
            size: "lg",
            withCloseButton: true,
            children: (
                <div className="space-y-3">
                    {book.thumbnail && (
                        <img
                            src={book.thumbnail}
                            alt="Thumbnail"
                            className="w-40 h-60 object-cover rounded-lg"
                        />
                    )}
                    <Text><strong>Author:</strong> {book.author}</Text>
                    <Text><strong>Genre:</strong> {book.genre}</Text>
                    <Text><strong>Year:</strong> {book.year}</Text>
                    <Text><strong>Rating:</strong> {book.rating} ⭐</Text>
                    <Text><strong>Short Description:</strong> {book.shortDescription}</Text>
                    <Text><strong>Description:</strong> {book.description}</Text>
                </div>
            ),
        });

    // Logout
    const handleLogout = () => {
        Cookies.remove("access_token");
        window.location.href = "/auth/login";
    };

    return (
        <>
            {/* Header section */}
            <div className="bg-black w-full">
                <div className="max-w-4xl p-4 mb-5 text-white flex justify-between mx-auto">
                    {user ? (
                        <div>
                            <h3>Welcome Back, <strong>{user.name}</strong></h3>
                            <h4>Email: <strong>{user.email}</strong></h4>
                        </div>
                    ) : (
                        <p>No user logged in</p>
                    )}
                    <button
                        onClick={handleLogout}
                        className="bg-white text-black p-2 rounded-lg cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Book management section */}
            <div className="pt-6 max-w-4xl mx-auto">
                <AddEditBook ref={addEditBookRef} onSave={loadBooksData} />

                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold">Your Book Collection</h4>
                    <button
                        onClick={() => addEditBookRef.current?.show()}
                        className="bg-black text-white p-2 rounded-lg cursor-pointer"
                    >
                        + Add Book
                    </button>
                </div>

                {/* Book list */}
                <div className="border-1 border-[#efefef] rounded-md p-6 bg-white shadow-sm">
                    {loading ? (
                        <p>Loading...</p>
                    ) : books.length === 0 ? (
                        <p>No books found.</p>
                    ) : (
                        books.map((book) => (
                            <div key={book._id} className="flex items-start space-x-4 mb-6 border-b pb-4">
                                {/* Book Thumbnail */}
                                <img
                                    src={book.thumbnail || "/default-thumbnail.jpg"}
                                    alt={book.title}
                                    className="w-24 h-36 object-cover rounded-md"
                                />

                                {/* Book Info */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold">{book.title}</h3>
                                    <p className="text-gray-600">{book.shortDescription}</p>
                                    <p className="text-sm text-gray-500">
                                        {book.year} | {book.rating}⭐ | {book.author}
                                    </p>

                                    {/* Action buttons */}
                                    <div className="flex mt-3 gap-2">
                                        <Button
                                            size="xs"
                                            color="dark"
                                            onClick={() => addEditBookRef.current?.show(book)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="xs"
                                            color="red"
                                            onClick={() => openDeleteModal(book)}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            onClick={() => openDetailsModal(book)}
                                        >
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Pagination */}
                    {pagination.total > pagination.limit && (
                        <Pagination
                            className="mt-6"
                            color="black"
                            total={Math.ceil(pagination.total / pagination.limit)}
                            value={pagination.page}
                            onChange={(page) => setPagination({ page })}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Books;
