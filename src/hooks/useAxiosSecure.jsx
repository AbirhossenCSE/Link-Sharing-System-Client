import axios from 'axios';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/Authcontext';

const axiosSecure = axios.create({
    baseURL: 'https://link-sharing-system-server-three.vercel.app'
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useContext(AuthContext);

    axiosSecure.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('access-token');
            if (token) {
                config.headers.authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosSecure.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (!error.response) {
                console.error("Network Error:", error);
                return Promise.reject({ message: "Network error, please try again later." });
            }

            const status = error.response.status;
            if (status === 401 || status === 403) {
                await logOut();
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );

    return axiosSecure;
};

export default useAxiosSecure;
