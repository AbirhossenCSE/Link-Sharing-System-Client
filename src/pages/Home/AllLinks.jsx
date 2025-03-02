
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllLinks = () => {
    const axiosSecure = useAxiosSecure();
    const [links, setLinks] = useState([]);
    const [texts, setTexts] = useState([]);
    const [passwords, setPasswords] = useState({});
    const [revealedLinks, setRevealedLinks] = useState({});

    useEffect(() => {
        // Fetch file links
        axiosSecure.get("/upload")
            .then(res => setLinks(res.data))
            .catch(error => console.error("Error fetching file links:", error));

        // Fetch text links
        axiosSecure.get("/texts")
            .then(res => setTexts(res.data.texts || []))
            .catch(error => console.error("Error fetching text links:", error));
    }, [axiosSecure]);

    const handlePasswordSubmit = async (id, type) => {
        try {
            const password = passwords[id];
            let response;

            if (type === "file") {
                response = await axiosSecure.post("/upload/private", {
                    id,
                    password
                });
                setRevealedLinks(prev => ({
                    ...prev,
                    [id]: response.data.fileUrl
                }));
            } else if (type === "text") {
                response = await axiosSecure.post("/texts/private", {
                    id,
                    password
                });
                setRevealedLinks(prev => ({
                    ...prev,
                    [id]: response.data.textContent
                }));
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Incorrect password or link not found!',
            });
        }
    };

    const handlePasswordModal = (id, type) => {
        Swal.fire({
            title: 'Enter Password',
            input: 'password',
            inputPlaceholder: 'Password',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            preConfirm: (password) => {
                if (!password) {
                    Swal.showValidationMessage("Password is required!");
                    return false;
                }
                setPasswords(prev => ({ ...prev, [id]: password }));
                handlePasswordSubmit(id, type);
            }
        });
    };

    return (
        <div className="p-8 max-w-3xl mx-auto bg-base-300 shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold text-center mb-6">All Shared Links</h2>

            {/* File Links */}
            <div>
                <h3 className="text-2xl font-semibold mt-6 mb-4 ">File Links</h3>
                {links.length === 0 && <p className="">No file links available.</p>}
                {links.map((link) => (
                    <div key={link._id} className="border-b py-4 flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-medium">{link.privacy === "private" ? "Private File" : "File Link"}</p>
                        </div>

                        {link.privacy === "private" ? (
                            <div className="flex flex-col items-start">
                                {!revealedLinks[link._id] ? (
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                        onClick={() => handlePasswordModal(link._id, "file")}
                                    >
                                        View File
                                    </button>
                                ) : (
                                    <a href={revealedLinks[link._id]} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        {revealedLinks[link._id]}
                                    </a>
                                )}
                            </div>
                        ) : (
                            <a href={link.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {link.fileUrl}
                            </a>
                        )}
                    </div>
                ))}
            </div>

            {/* Text Links */}
            <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4 ">Text Links</h3>
                {texts.length === 0 && <p className="text-gray-500">No text links available.</p>}
                {texts.map((text) => (
                    <div key={text._id} className="border-b py-4 flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-medium">{text.privacy === "private" ? "Private Text" : "Text Content"}</p>
                        </div>

                        {text.privacy === "private" ? (
                            <div className="flex flex-col items-start">
                                {!revealedLinks[text._id] ? (
                                    <button
                                        className="bg-green-500  px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                        onClick={() => handlePasswordModal(text._id, "text")}
                                    >
                                        View Text
                                    </button>
                                ) : (
                                    <p className="bg-gray-100 p-2 rounded">{revealedLinks[text._id]}</p>
                                )}
                            </div>
                        ) : (
                            <p className="p-2 rounded">{text.textLink}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllLinks;
