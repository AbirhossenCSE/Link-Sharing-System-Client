import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col">

            {/* Hero Section */}
            <div className="flex-1 bg-base-200 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-4xl md:text-5xl font-bold ">
                    Share Your Links Securely
                </h1>
                <p className="text-lg mt-4">
                    Upload images, PDF or Text and generate private & public links.
                </p>

                <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <Link
                        to="/linkForm"
                        className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                        Get Started
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-12 bg-base-300">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold ">Why Choose ShareLink?</h2>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6  shadow rounded-lg">
                            <h3 className="text-xl font-semibold ">Easy File Upload</h3>
                            <p className="text-gray-400 mt-2">
                                Upload and generate shareable links instantly.
                            </p>
                        </div>
                        <div className="p-6  shadow rounded-lg">
                            <h3 className="text-xl font-semibold ">Secure Sharing</h3>
                            <p className="text-gray-400 mt-2">
                                Control access with private or public sharing options.
                            </p>
                        </div>
                        <div className="p-6  shadow rounded-lg">
                            <h3 className="text-xl font-semibold "> Signup Required</h3>
                            <p className="text-gray-400 mt-2">
                                Start sharing links with registration.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
