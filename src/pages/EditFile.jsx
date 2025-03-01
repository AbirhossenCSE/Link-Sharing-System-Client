import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const EditFile = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [fileUrl, setFileUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axiosSecure.get(`/uploads/${id}`)
            .then(res => setFileUrl(res.data.fileUrl))
            .catch(error => console.error("Error fetching file details:", error));
    }, [id, axiosSecure]);

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Upload file to ImgBB
    const handleFileUpload = async () => {
        if (!selectedFile) {
            Swal.fire("Warning!", "Please select a file to upload!", "warning");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await fetch(image_hosting_api, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setFileUrl(data.data.url);
                Swal.fire("Success!", "File uploaded successfully!", "success");
            } else {
                Swal.fire("Error!", "File upload failed!", "error");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            Swal.fire("Error!", "Failed to upload file!", "error");
        }
        setLoading(false);
    };

    // Update the file URL in the database
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!fileUrl) {
            Swal.fire("Warning!", "Please upload a file or provide a valid file URL!", "warning");
            return;
        }

        try {
            await axiosSecure.put(`/uploads/${id}`, { fileUrl });
            Swal.fire("Success!", "File updated successfully.", "success");
            navigate("/myLinks"); // Redirect after updating
        } catch (error) {
            console.error("Error updating file:", error);
            Swal.fire("Error!", "Failed to update the file.", "error");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Edit File Link</h2>
            
            <form onSubmit={handleUpdate}>
                {/* File Upload Section */}
                <label className="block mb-2">
                    <span className="text-gray-700">Upload New File</span>
                    <input
                        type="file"
                        className="w-full p-2 border rounded"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </label>
                <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                    onClick={handleFileUpload}
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Upload File"}
                </button>

                {/* Display current file URL */}
                <div className="mt-4">
                    <p className="text-gray-700 font-medium">Current File Link:</p>
                    {fileUrl && (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                            {fileUrl}
                        </a>
                    )}
                </div>

                {/* Update Button */}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                    Update File
                </button>
            </form>
        </div>
    );
};

export default EditFile;
