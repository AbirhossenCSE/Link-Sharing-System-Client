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
    const [text, setText] = useState('');
    const [textLink, setTextLink] = useState(null);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [isFileForm, setIsFileForm] = useState(true);

    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    // Handle file input change
    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };

    // Handle file upload
    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
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
                await axiosPublic.post('/upload', userData);
                navigate('/myLinks', { state: userData });
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

    // Handle text submission
    const handleTextSave = async () => {
        if (!text || !user?.displayName || !user?.email) {
            alert("Please enter text and make sure you are logged in.");
            return;
        }

        const textData = {
            content: text,
            username: user.displayName,
            email: user.email,
        };

        try {
            const response = await axiosPublic.post("/save-text", textData);
            console.log("Text saved successfully:", response.data);
            setTextLink(response.data.textLink);

            // Redirect to the new page with the text ID
            navigate(`/myLinks`);
        } catch (error) {
            console.error("Error saving text:", error);
            alert("Failed to save text.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="link-form p-4 max-w-lg mx-auto">
                <div className="button-group mb-4">
                    <button
                        onClick={() => setIsFileForm(true)}
                        className={`py-2 px-4 rounded ${isFileForm ? 'bg-blue-500' : 'bg-gray-300'}`}>
                        Image & PDF-File Submission
                    </button>
                    <button
                        onClick={() => setIsFileForm(false)}
                        className={`py-2 px-4 ml-4 rounded ${!isFileForm ? 'bg-green-500' : 'bg-gray-300'}`}>
                        Text Submission
                    </button>
                </div>

                {/* Conditional rendering of File Upload Form or Text Submission Form */}
                {isFileForm ? (
                    <div>
                        <h2 className="text-xl font-semibold">Upload File and Get Shareable Link</h2>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".doc, .docx, .pdf, .jpg, .jpeg, .png"
                            disabled={loading}
                            className="mt-2 border p-2 rounded w-full"
                        />
                        <button
                            onClick={handleFileUpload}
                            disabled={loading || !file}
                            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded w-full">
                            {loading ? 'Uploading...' : 'Upload File'}
                        </button>
                        {fileUrl && (
                            <div className="mt-4">
                                <h3>Shareable Link:</h3>
                                <input type="text" value={fileUrl} readOnly className="border p-2 rounded w-full mt-2" />
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 mt-2 inline-block">
                                    View File
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="mt-8 text-xl font-semibold">Save Text and Get Shareable Link</h2>
                        <textarea
                            className="border p-2 rounded w-full mt-2"
                            rows="4"
                            placeholder="Enter text here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                        <button
                            onClick={handleTextSave}
                            className="mt-2 bg-green-500 text-white py-2 px-4 rounded w-full">
                            Save Text
                        </button>
                        {textLink && (
                            <div className="mt-4">
                                <h3>Shareable Text Link:</h3>
                                <a href={textLink} className="text-blue-600 mt-2 inline-block">
                                    View Text
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinkForm;
