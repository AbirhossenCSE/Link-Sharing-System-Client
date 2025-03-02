import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';
import AuthContext from '../context/Authcontext';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';

const image_hosting_key = import.meta.env.VITE_IMAGE_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const LinkForm = () => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [text, setText] = useState('');
    const [textLink, setTextLink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFileForm, setIsFileForm] = useState(true);
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState('');

    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            Swal.fire('Error', 'Please select a file first.', 'error');
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
                    fileUrl: data.data.url,
                    privacy: isPrivate ? "private" : "public",
                    password: isPrivate ? password : null,
                };
                await axiosPublic.post('/upload', userData);
                Swal.fire('Success', 'File uploaded successfully!', 'success');
                navigate('/myLinks', { state: userData });
            } else {
                Swal.fire('Error', 'Failed to upload file. Please try again.', 'error');
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            Swal.fire('Error', 'An error occurred while uploading the file.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTextSave = async () => {
        if (!text || !user?.displayName || !user?.email) {
            Swal.fire('Error', 'Please enter text and make sure you are logged in.', 'error');
            return;
        }

        const textData = {
            content: text,
            username: user.displayName,
            email: user.email,
            privacy: isPrivate ? "private" : "public",
            password: isPrivate ? password : null,
        };

        try {
            const response = await axiosPublic.post("/save-text", textData);
            console.log("Text saved successfully:", response.data);
            setTextLink(response.data.textLink);
            Swal.fire('Success', 'Text saved successfully!', 'success');
            navigate(`/myLinks`);
        } catch (error) {
            console.error("Error saving text:", error);
            Swal.fire('Error', 'Failed to save text.', 'error');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
                <div className="link-form p-8 max-w-2xl mx-auto shadow-lg rounded-lg mt-8">
                    <h2 className="text-3xl font-semibold text-center mb-6 ">Create Shareable Link</h2>

                    <div className="button-group mb-6 flex justify-center gap-4">
                        <button
                            onClick={() => setIsFileForm(true)}
                            className={`py-2 px-6 rounded-lg ${isFileForm ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                            Image & PDF-File Submission
                        </button>
                        <button
                            onClick={() => setIsFileForm(false)}
                            className={`py-2 px-6 rounded-lg ${!isFileForm ? 'bg-green-600' : 'bg-gray-300'}`}
                        >
                            Text Submission
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold ">Select Privacy:</label>
                        <select
                            className="border p-3 rounded-lg w-full mt-2"
                            value={isPrivate ? "private" : "public"}
                            onChange={(e) => setIsPrivate(e.target.value === "private")}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    {isPrivate && (
                        <div className="mb-4">
                            <label className="block font-semibold ">Set Password:</label>
                            <input
                                type="password"
                                className="border p-3 rounded-lg w-full mt-2"
                                placeholder="Enter a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}

                    {isFileForm ? (
                        <div>
                            <h3 className="text-2xl font-semibold  mb-4">Upload File and Get Shareable Link</h3>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".doc, .docx, .pdf, .jpg, .jpeg, .png"
                                disabled={loading}
                                className="border p-3 rounded-lg w-full mt-4"
                            />
                            <button
                                onClick={handleFileUpload}
                                disabled={loading || !file}
                                className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg w-full"
                            >
                                {loading ? 'Uploading...' : 'Upload File'}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-2xl font-semibold  mb-4">Save Text and Get Shareable Link</h3>
                            <textarea
                                className="border p-3 rounded-lg w-full mt-4"
                                rows="6"
                                placeholder="Enter text here..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            ></textarea>
                            <button
                                onClick={handleTextSave}
                                className="mt-4 bg-green-600 text-white py-2 px-6 rounded-lg w-full"
                            >
                                Save Text
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LinkForm;
