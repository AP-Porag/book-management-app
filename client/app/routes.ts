import {index, layout, prefix, route, type RouteConfig} from "@react-router/dev/routes";

export default [
    layout("./pages/RootLayout.tsx", [
        index("./pages/secured/Books.tsx"),
        ...prefix("auth", [
            route("login", "./pages/unsecured/LoginPage.tsx"),
            route("signup", "./pages/unsecured/SignupPage.tsx"),
        ])
    ])

] satisfies RouteConfig;
