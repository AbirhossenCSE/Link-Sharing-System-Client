import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import AuthContext from "../context/Authcontext";
import logo from "../assets/links.svg";

const Navbar = () => {
    const { user, signOutUser } = useContext(AuthContext);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleSignOut = () => {
        signOutUser()
            .then(() => console.log('Sign out successful'))
            .catch(() => console.log('Sign out failed'));
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const links = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? "text-blue-500 font-bold" : ""}
                >
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/allLinks"
                    className={({ isActive }) => isActive ? "text-blue-500 font-bold" : ""}
                >
                    All Links
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/linkForm"
                    className={({ isActive }) => isActive ? "text-blue-500 font-bold" : ""}
                >
                    Form
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/myLinks"
                    className={({ isActive }) => isActive ? "text-blue-500 font-bold" : ""}
                >
                    My Links
                </NavLink>
            </li>
        </>
    );

    return (
        <nav className="bg-base-300 shadow-md">
            <div className="container mx-auto px-5 lg:px-20 flex items-center justify-between py-3">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2">
                    <img src={logo} className="w-10 h-10" alt="Logo" />
                    <span className="text-2xl font-bold">ShareLink</span>
                </Link>

                {/* Desktop Links */}
                <ul className="hidden lg:flex space-x-6 text-lg">{links}</ul>

                {/* Theme & Auth Buttons */}
                <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="btn btn-ghost"
                        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    >
                        {theme === "light" ? <FaMoon /> : <FiSun />}
                    </button>

                    {/* Auth Button */}
                    {user ? (
                        <button onClick={handleSignOut} className="btn">
                            Sign Out
                        </button>
                    ) : (
                        <Link to="/signin" className="btn btn-primary">Sign-In</Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button onClick={toggleMenu} className="lg:hidden btn btn-ghost">
                        {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-base-100 w-full py-4">
                    <ul className="flex flex-col items-center space-y-4">{links}</ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
