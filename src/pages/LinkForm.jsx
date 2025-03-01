
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';
import AuthContext from '../context/Authcontext';
import Navbar from '../components/Navbar';

const image_hosting_key = import.meta.env.VITE_IMAGE_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const LinkForm = () => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    // Handle file input change
    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };

    // Handle file upload and save to the backend
    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            // Upload the file to ImgBB
            const response = await fetch(image_hosting_api, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setFileUrl(data.data.url);

                const userData = {
                    username: user?.displayName,
                    email: user?.email,
                    fileUrl: data.data.url
                };

                // Call your backend to store the file and user info
                await axiosPublic.post('/upload', userData);

                navigate('/success', { state: userData });
            } else {
                alert("Failed to upload file. Please try again.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className="link-form">
                <h2>Upload Image, PDF-File, and Get Shareable Link</h2>
                <div>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".doc, .docx, .pdf, .jpg, .jpeg, .png"
                        disabled={loading}
                    />
                </div>
                <div>
                    <button
                        onClick={handleFileUpload}
                        disabled={loading || !file}
                        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        {loading ? 'Uploading...' : 'Upload File'}
                    </button>
                </div>

                {fileUrl && (
                    <div className="mt-4">
                        <h3>Shareable Link:</h3>
                        <input
                            type="text"
                            value={fileUrl}
                            readOnly
                            className="border p-2 rounded w-full mt-2"
                        />
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 mt-2 inline-block"
                        >
                            View File
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinkForm;


