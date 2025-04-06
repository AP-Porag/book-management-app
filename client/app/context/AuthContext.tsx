import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import API from "../utils/axios";
import {showNotification} from "@mantine/notifications";

interface AuthContextType {
    user: any;
    isLoaded: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState<any>(null);


    const fetchUser = async () => {
        try {
            const response = await API.get("/auth/profile"); // API should return user data
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoaded(true)
        }
    };
    // Check if user is authenticated on mount
    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await API.post("/auth/login", {email, password})
            if (response.status === 200) {
                Cookies.set("access_token", response.data.token);
                fetchUser()
                showNotification({message: 'Login successfully', color: 'green',position: 'top-right'})
            }

        } catch (error) {
            console.error("Login failed", error);
        }
    };


    const signup = async (name: string, email: string, password: string) => {
        try {
            const response = await API.post("/auth/register", {name, email, password});
            if (response.status === 201) {
                Cookies.set("access_token", response.data.token);
                fetchUser()
                showNotification({message: 'Registration successfully', color: 'green',position: 'top-right'})
            }
        } catch (error) {
            console.error("Signup failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{user, signup,login, isLoaded}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
