import axios from 'axios';
import React from 'react';

const axiosPublic = axios.create({
    baseURL: 'https://link-sharing-system-server-three.vercel.app'
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;