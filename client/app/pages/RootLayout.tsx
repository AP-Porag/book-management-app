import React from 'react';
import {useAuth} from "@/context/AuthContext";
import {Navigate, Outlet, useLocation} from "react-router";
import Loader from "@/pages/unsecured/components/Loader";

const RootLayout = () => {
    const {isLoaded, user} = useAuth();
    let {pathname} = useLocation()
    if (!isLoaded)
        return <Loader />;
    if (pathname.startsWith("/auth") && user)
        return <Navigate to={"/"}/>

    if (!pathname.startsWith("/auth") && !user) return <Navigate to={"/auth/login"}/>


    return <Outlet/>
};

export default RootLayout;
