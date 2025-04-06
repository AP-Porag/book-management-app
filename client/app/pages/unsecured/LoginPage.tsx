import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Button, TextInput, PasswordInput } from "@mantine/core";

// Define the shape of user form data
export type UserEntity = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const { login } = useAuth(); // Get login function from auth context
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Setup react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserEntity>({
        mode: "all",
    });

    // Function to handle login
    const handleLogin = async (data: UserEntity) => {
        setLoading(true);
        try {
            await login(data.email, data.password);
            navigate("/"); // Redirect after successful login
        } catch (error) {
            console.error("Login Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 transition-all duration-500">
            {/* Left side - Login form */}
            <div className="w-full sm:w-1/2 flex items-center justify-center bg-white p-8 sm:p-10 rounded-lg shadow-lg">
                <div className="p-10 w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back !!</h2>
                    <p className="mb-5">Please enter your credentials to log in</p>

                    {/* Login form using react-hook-form */}
                    <form onSubmit={handleSubmit(handleLogin)} className="grid gap-4">
                        {/* Email input */}
                        <TextInput
                            label="Email"
                            type="email"
                            {...register("email", {
                                required: "Email is required!",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email format",
                                },
                            })}
                            error={errors.email?.message}
                        />

                        {/* Password input */}
                        <PasswordInput
                            label="Password"
                            {...register("password", {
                                required: "Password is required!",
                            })}
                            error={errors.password?.message}
                        />

                        {/* Login button */}
                        <Button type="submit" color="black" loading={loading}>
                            Login
                        </Button>
                    </form>

                    {/* Link to Signup page */}
                    <p className="mt-3 text-sm">
                        New to our platform?{" "}
                        <Link to="/auth/signup" className="text-blue-600 underline">
                            Sign Up now
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right side - Banner image */}
            <div
                className="hidden sm:block w-1/2 rounded-l-3xl text-white relative overflow-hidden bg-cover bg-no-repeat p-12 text-center"
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
        </div>
    );
};

export default LoginPage;

// Background styles
const bgImageStyle = {
    backgroundImage: `url(../auth-bg.jpg)`,
    height: "100vh",
};

const overlayStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
};
