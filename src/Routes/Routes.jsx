import {
    createBrowserRouter,
} from "react-router-dom";
import Main from "../Layout/Main";
import Register from "../Signup/Register";
import SignIn from "../Signup/SignIn";



export const router = createBrowserRouter([

    {
        path: '/',
        element: <Main></Main>
    },
    {
        path: '/register',
        element: <Register></Register>,
    },
    {
        path: '/signin',
        element: <SignIn></SignIn>,
    },


]);