import React from 'react';
import Navbar from '../components/Navbar';

const Main = () => {
    return (
        <div>
            <Navbar></Navbar>
        </div>
    );
};

export default Main;





// // Toggle dark/light mode
// const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     document.documentElement.setAttribute('data-theme', newTheme);
// };


// {/* Theme Toggle */ }
// <button
//     onClick={toggleTheme}
//     className="btn btn-ghost mr-2"
//     title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
// >
//     {theme === "light" ? <FaMoon /> : <FiSun />}
// </button>