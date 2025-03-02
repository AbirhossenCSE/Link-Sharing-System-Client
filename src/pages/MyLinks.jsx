import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import AuthContext from "../context/Authcontext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyLinks = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [links, setLinks] = useState([]);
    const [texts, setTexts] = useState([]);
    const [loading, setLoading] = useState(true); // Loader state
    const navigate = useNavigate();

    // console.log(user.email);

    useEffect(() => {
        if (user?.email) {
            setLoading(true);
            Promise.all([
                axiosSecure.get(`/uploads?email=${user.email}`).then(res => setLinks(res.data)),
                axiosSecure.get(`/text?email=${user.email}`)
                    .then(res => setTexts(res.data.texts))
                    .catch(error => console.error("Error fetching data:", error))

            ])
                .catch(error => console.error("Error fetching data:", error))
                .finally(() => setLoading(false)); // Stop loading after fetching
        }
    }, [user?.email, axiosSecure]);



    //  Handle Delete with SweetAlert for files
    const handleFileDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this file!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/uploads/${id}`);
                    setLinks(links.filter(link => link._id !== id));
                    Swal.fire("Deleted!", "Your file has been deleted.", "success");
                } catch (error) {
                    console.error("Error deleting file:", error);
                    Swal.fire("Error!", "Failed to delete the file.", "error");
                }
            }
        });
    };

    //  Handle Delete with SweetAlert for texts
    const handleTextDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this text!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/texts/${id}`);
                    setTexts(texts.filter(text => text._id !== id));
                    Swal.fire("Deleted!", "Your text has been deleted.", "success");
                } catch (error) {
                    console.error("Error deleting text:", error);
                    Swal.fire("Error!", "Failed to delete the text.", "error");
                }
            }
        });
    };

    //  Handle Edit for File - Navigate to Edit Page
    const handleFileEdit = (id) => {
        navigate(`/edit-file/${id}`);
    };

    //  Handle Edit for Text - Navigate to Edit Page
    const handleTextEdit = (id) => {
        navigate(`/edit-text/${id}`);
    };




    return (
        <div>
            <Navbar />
            <div className="p-6 max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-8">My Shared Links</h2>

                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* File Links */}
                        {links.length > 0 ? (
                            <div>
                                <h3 className="text-2xl font-bold mb-4">File Links</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {links.map((link) => (
                                        <div key={link._id} className="bg-base-200 shadow-lg rounded-lg overflow-hidden">
                                            <div className="p-6">
                                                <p className="font-semibold">File:</p>
                                                <a
                                                    href={link.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 underline"
                                                >
                                                    {link.fileUrl}
                                                </a>
                                                <p className="mt-2"><strong>Uploaded by:</strong></p>
                                                <p>Name: {link.username}</p>
                                                <p>Email: {link.email}</p>
                                                <p>Link Type: {link.privacy}</p>
                                            </div>
                                            <div className="flex justify-between px-6 py-4 border-t">
                                                <button
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition"
                                                    onClick={() => handleFileEdit(link._id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition"
                                                    onClick={() => handleFileDelete(link._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No file links found.</p>
                        )}

                        {/* Text Links */}
                        {texts.length > 0 ? (
                            <div className="mt-8">
                                <h3 className="text-2xl font-bold mb-4">Text Links</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {texts.map((text) => (
                                        <div key={text._id} className="bg-base-200 shadow-lg rounded-lg overflow-hidden">
                                            <div className="p-6">
                                                <p className="font-semibold">Text Link:</p>
                                                <a
                                                    href={text.textLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 underline"
                                                >
                                                    {text.textLink}
                                                </a>
                                                <p className="mt-2"><strong>Saved by:</strong></p>
                                                <p>Name: {text.username}</p>
                                                <p>Email: {text.email}</p>
                                                <p>Link Type: {text.privacy}</p>
                                            </div>
                                            <div className="flex justify-between py-4 px-6 border-t">
                                                <button
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition"
                                                    onClick={() => handleTextEdit(text._id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition"
                                                    onClick={() => handleTextDelete(text._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 mt-6">No text links found.</p>
                        )}
                    </>
                )}
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MyLinks;
