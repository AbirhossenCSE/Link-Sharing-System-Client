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
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/uploads?email=${user.email}`)
                .then(res => setLinks(res.data))
                .catch(error => console.error("Error fetching links:", error));
        }
    }, [user?.email, axiosSecure]);

    // 🟢 Handle Delete with SweetAlert
    const handleDelete = async (id) => {
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
                    console.error("Error deleting link:", error);
                    Swal.fire("Error!", "Failed to delete the file.", "error");
                }
            }
        });
    };

    // 🟢 Handle Edit - Navigate to Edit Page
    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    return (
        <div>
            <Navbar />
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">My Shared Links</h2>
                {links.length > 0 ? (
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
                                        onClick={() => handleEdit(link._id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleDelete(link._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No links found.</p>
                )}
            </div>
        </div>
    );
};

export default MyLinks;
