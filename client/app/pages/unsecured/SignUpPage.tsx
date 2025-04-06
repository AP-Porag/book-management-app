import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";

// Define the shape of the form data
type UserEntity = {
    name: string;
    email: string;
    password: string;
};

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup } = useAuth(); // Get the signup function from context

    const [loading, setLoading] = useState(false);

    // Setup react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserEntity>({
        mode: "all", // Validate on change and submit
    });

    // Function to handle form submission
    const handleSignup = async (name: string, email: string, password: string) => {
        setLoading(true);
        try {
            await signup(name, email, password);
            navigate("/"); // Redirect after successful signup
        } catch (error) {
            console.error("Signup Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 transition-all duration-500">
            {/* Left Side - Banner */}
            <div
                className="hidden sm:block w-1/2 rounded-r-3xl text-white relative overflow-hidden bg-cover bg-no-repeat p-12 text-center"
                style={bgImageStyle}
            >
                <div
                    className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed"
                    style={overlayStyle}
                >
                    <div className="flex h-full items-center justify-center">
                        <div className="text-white">
                            <h1 className="text-4xl font-bold">Book Collection</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full sm:w-1/2 flex items-center justify-center bg-white p-8 sm:p-10 rounded-lg shadow-lg">
                <div className="p-10 w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
                    <p className="mb-5">Sign up to access your books</p>

                    {/* Signup Form */}
                    <form
                        onSubmit={handleSubmit((data) =>
                            handleSignup(data.name, data.email, data.password)
                        )}
                        className="grid gap-4"
                    >
                        {/* Name Input */}
                        <TextInput
                            label="Name"
                            {...register("name", { required: "Name is required!" })}
                            error={errors.name?.message}
                        />

                        {/* Email Input */}
                        <TextInput
                            label="Email"
                            type="email"
                            {...register("email", {
                                required: "Email is required!",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address",
                                },
                            })}
                            error={errors.email?.message}
                        />

                        {/* Password Input */}
                        <PasswordInput
                            label="Password"
                            {...register("password", {
                                required: "Password is required!",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            error={errors.password?.message}
                        />

                        {/* Submit Button */}
                        <Button color="black" loading={loading} type="submit">
                            Sign Up
                        </Button>
                    </form>

                    {/* Link to login */}
                    <p className="mt-3 text-sm">
                        Already have an account?{" "}
                        <Link to="/auth/login" className="text-blue-600 underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

// Background image and overlay styles
const bgImageStyle = {
    backgroundImage: `url(../auth-bg.jpg)`,
    height: "100vh",
};

const overlayStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
};
