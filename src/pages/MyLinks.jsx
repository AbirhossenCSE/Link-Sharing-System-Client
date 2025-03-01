
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

    // 🟢 Handle Delete with SweetAlert for files
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

    // 🟢 Handle Delete with SweetAlert for texts
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


    // 🟢 Handle Edit for File - Navigate to Edit Page
    const handleFileEdit = (id) => {
        navigate(`/edit-file/${id}`);
    };

    // 🟢 Handle Edit for Text - Navigate to Edit Page
    const handleTextEdit = (id) => {
        navigate(`/edit-text/${id}`);
    };

    return (
        <div>
            <Navbar />
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">My Shared Links</h2>

                {/* Displaying File Links */}
                {links.length > 0 ? (
                    <div>
                        <h3 className="font-semibold">File Links</h3>
                        <ul>
                            {links.map((link) => (
                                <li key={link._id} className="border p-3 mb-2 flex justify-between">
                                    <div>
                                        <p><strong>File:</strong> <a href={link.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">{link.fileUrl}</a></p>
                                        <p><strong>Uploaded by:</strong></p>
                                        <p>Name: {link.username}</p>
                                        <p>Email: {link.email}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            onClick={() => handleFileEdit(link._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                            onClick={() => handleFileDelete(link._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No file links found.</p>
                )}

                {/* Displaying Text Links */}
                {texts.length > 0 ? (
                    <div className="mt-6">
                        <h3 className="font-semibold">Text Links</h3>
                        <ul>
                            {texts.map((text) => (
                                <li key={text._id} className="border p-3 mb-2 flex justify-between">
                                    <div>
                                        <p><strong>Text Link:</strong> <a href={text.textLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">{text.textLink}</a></p>
                                        <p><strong>Saved by:</strong></p>
                                        <p>Name: {text.username}</p>
                                        <p>Email: {text.email}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            onClick={() => handleTextEdit(text._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                            onClick={() => handleTextDelete(text._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No text links found.</p>
                )}
            </div>
        </div>
    );
};

export default MyLinks;

