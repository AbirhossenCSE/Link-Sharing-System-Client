import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import AuthContext from "../context/Authcontext";

const EditText = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // State for text data
    const [textData, setTextData] = useState({
        text: "",
        privacy: "public",
        password: "", // Only used for private links
    });

    useEffect(() => {
        axiosSecure.get(`/text/${id}`)
            .then(res => {
                const fetchedData = res.data;
                setTextData({
                    text: fetchedData.text || "",
                    privacy: fetchedData.privacy || "public",
                    password: fetchedData.privacy === "private" ? fetchedData.password || "" : "", // Only set if private
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

        console.log("Sending data:", updatedData); // Debugging

        try {
            const response = await axiosSecure.put(`/text/${id}`, updatedData);
            console.log("Server Response:", response.data); // Debugging
            Swal.fire("Updated!", "Your text has been updated.", "success");
            navigate("/myLinks");
        } catch (error) {
            console.error("Error updating text:", error);
            Swal.fire("Error!", "Failed to update the text.", "error");
        }
    };


    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Edit Text</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Textarea for text content */}
                <textarea
                    name="text"
                    value={textData.text}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows="4"
                    required
                />

                {/* Privacy selection */}
                <label className="block font-semibold">Privacy:</label>
                <select
                    name="privacy"
                    value={textData.privacy}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>

                {/* Password field (only shown if privacy is private) */}
                {textData.privacy === "private" && (
                    <div>
                        <label className="block font-semibold">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={textData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                )}

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditText;
