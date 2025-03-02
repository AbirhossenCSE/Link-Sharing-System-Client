import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import AuthContext from "../context/Authcontext";
import Navbar from "../components/Navbar";

const EditText = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // State for text data
    const [textData, setTextData] = useState({
        text: "",
        privacy: "public",
        password: "",
    });

    useEffect(() => {
        axiosSecure.get(`/text/${id}`)
            .then(res => {
                const fetchedData = res.data;
                setTextData({
                    text: fetchedData.text || "",
                    privacy: fetchedData.privacy || "public",
                    password: fetchedData.privacy === "private" ? fetchedData.password || "" : "",
                });
            })
            .catch(error => console.error("Error fetching text data:", error));
    }, [id, axiosSecure]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTextData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = { ...textData };
        if (updatedData.privacy === "public") {
            delete updatedData.password;
        }

        try {
            await axiosSecure.put(`/text/${id}`, updatedData);
            Swal.fire("Updated!", "Your text has been updated.", "success");
            navigate("/myLinks");
        } catch (error) {
            console.error("Error updating text:", error);
            Swal.fire("Error!", "Failed to update the text.", "error");
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className="flex items-center justify-center min-h-screen  px-4">
                <div className="bg-base-300 shadow-lg rounded-lg p-6 max-w-lg w-full">
                    <h2 className="text-3xl font-semibold  mb-5 text-center">
                        Edit Text
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Textarea for text content */}
                        <div>
                            <label className=" font-medium">Text Content:</label>
                            <textarea
                                name="text"
                                value={textData.text}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none mt-1"
                                rows="5"
                                required
                            />
                        </div>

                        {/* Privacy selection */}
                        <div>
                            <label className=" font-medium">Privacy:</label>
                            <select
                                name="privacy"
                                value={textData.privacy}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none mt-1"
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        {/* Password field (only shown if privacy is private) */}
                        {textData.privacy === "private" && (
                            <div>
                                <label className="text-gray-700 font-medium">Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={textData.password}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none mt-1"
                                    required
                                />
                            </div>
                        )}

                        {/* Save button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-md text-lg font-medium transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditText;
