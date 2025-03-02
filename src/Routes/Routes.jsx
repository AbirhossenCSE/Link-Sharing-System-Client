import {
    createBrowserRouter,
} from "react-router-dom";
import Main from "../Layout/Main";
import Register from "../Signup/Register";
import SignIn from "../Signup/SignIn";
import LinkForm from "../pages/LinkForm";
import LinkCard from "../pages/LinkCard";
import MyLinks from "../pages/MyLinks";
import EditFile from "../pages/EditFile";
import EditText from "../pages/EditText";
import PrivateRoute from "./PrivateRoute";
import AllLinks from "../pages/Home/AllLinks";



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
        path: '/allLinks',
        element: <AllLinks></AllLinks>,
    },
    {
        path: '/linkForm',
        element: <PrivateRoute><LinkForm></LinkForm></PrivateRoute>,
    },
    {
        path: '/success',
        element: <LinkCard></LinkCard>,
    },
    {
        path: '/myLinks',
        element: <PrivateRoute><MyLinks></MyLinks></PrivateRoute>,
    },
    {
        path: '/edit-file/:id',
        element: <EditFile></EditFile>,
    },
    {
        path: '/edit-text/:id',
        element: <EditText></EditText>,
    },


]);