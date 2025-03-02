import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import AuthContext from "../context/Authcontext";
import Navbar from "../components/Navbar";

const MyLinks = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [links, setLinks] = useState([]);
    const [texts, setTexts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.email) {
            // Fetch uploaded file links
            axiosSecure.get(`/uploads?email=${user.email}`)
                .then(res => setLinks(res.data))
                .catch(error => console.error("Error fetching links:", error));

            // Fetch saved text links
            axiosSecure.get(`/texts?email=${user.email}`)
                .then(res => setTexts(res.data.texts))
                .catch(error => console.error("Error fetching text links:", error));
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
                <h2 className="text-3xl font-semibold text-center mb-8">My Shared Links</h2>

                {/* Displaying File Links */}
                {links.length > 0 ? (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">File Links</h3>
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

                {/* Displaying Text Links */}
                {texts.length > 0 ? (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Text Links</h3>
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
            </div>
        </div>
    );
};

export default MyLinks;
