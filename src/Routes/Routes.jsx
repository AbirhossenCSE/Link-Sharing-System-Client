import {
    createBrowserRouter,
} from "react-router-dom";
import Main from "../Layout/Main";
import Register from "../Signup/Register";
import SignIn from "../Signup/SignIn";
import LinkForm from "../pages/LinkForm";
import LinkCard from "../pages/LinkCard";



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
    {
        path: '/linkForm',
        element: <LinkForm></LinkForm>,
    },
    {
        path: '/success',
        element: <LinkCard></LinkCard>,
    },


]);