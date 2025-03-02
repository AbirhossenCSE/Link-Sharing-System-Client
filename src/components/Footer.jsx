import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white text-center py-4 mt-10">
            <p className="text-sm">
                © {new Date().getFullYear()} ShareLink. All rights reserved.
            </p>
            <p className="text-sm">
                Built  by <span className="font-semibold">Abir Hossen</span>
            </p>
        </footer>
    );
};

export default Footer;
