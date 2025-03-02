import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";

const image_hosting_key = import.meta.env.VITE_IMAGE_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const EditFile = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [fileData, setFileData] = useState({ fileUrl: "", privacy: "public", password: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axiosSecure.get(`/uploads/${id}`)
            .then(res => setFileData(res.data))
            .catch(error => console.error("Error fetching file details:", error));
    }, [id, axiosSecure]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFileData({ ...fileData, [name]: value });
        if (name === "privacy" && value === "public") {
            setFileData((prev) => ({ ...prev, password: "" }));
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            Swal.fire("Warning!", "Please select a file to upload!", "warning");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("image", selectedFile);
        try {
            const response = await fetch(image_hosting_api, { method: "POST", body: formData });
            const data = await response.json();
            if (data.success) {
                setFileData((prev) => ({ ...prev, fileUrl: data.data.url }));
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!fileData.fileUrl) {
            Swal.fire("Warning!", "Please upload a file or provide a valid file URL!", "warning");
            return;
        }
        const updateData = { ...fileData };
        if (updateData.privacy === "public") delete updateData.password;
        try {
            await axiosSecure.put(`/uploads/${id}`, updateData);
            Swal.fire("Success!", "File updated successfully.", "success");
            navigate("/myLinks");
        } catch (error) {
            console.error("Error updating file:", error);
            Swal.fire("Error!", "Failed to update the file.", "error");
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className="max-w-lg mx-auto bg-base-100 shadow-lg rounded-lg p-8 mt-10">
                <h2 className="text-3xl font-semibold mb-6 text-center">Edit File Link</h2>
                <form onSubmit={handleUpdate} className="space-y-5">
                    <div>
                        <label className="block  font-medium">Upload New File</label>
                        <input type="file" className="w-full p-3 border rounded-lg mt-2" onChange={handleFileChange} accept="image/*" />
                        <button type="button" className="w-full bg-green-500 text-white px-4 py-2 rounded-lg mt-3 hover:bg-green-600 transition" onClick={handleFileUpload} disabled={loading}>
                            {loading ? "Uploading..." : "Upload File"}
                        </button>
                    </div>
                    {fileData.fileUrl && (
                        <div className="text-center">
                            <p className=" font-medium">Current File:</p>
                            <a href={fileData.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 break-all">
                                {fileData.fileUrl}
                            </a>
                        </div>
                    )}
                    <div>
                        <label className="block font-medium">Privacy</label>
                        <select name="privacy" value={fileData.privacy} onChange={handleChange} className="w-full p-3 border rounded-lg">
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                    {fileData.privacy === "private" && (
                        <div>
                            <label className="block text-gray-700 font-medium">Set Password</label>
                            <input type="password" name="password" value={fileData.password} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        </div>
                    )}
                    <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                        Update File
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditFile;