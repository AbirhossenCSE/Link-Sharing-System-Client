import React from 'react';
import Navbar from '../components/Navbar';
import AllLinks from '../pages/Home/AllLinks';
import Footer from '../components/Footer';
import Home from '../components/Home';

const Main = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Home></Home>
            <Footer></Footer>
        </div>
    );
};

export default Main;

