import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AllLinks = () => {
    const axiosSecure = useAxiosSecure();
    const [links, setLinks] = useState([]);
    const [texts, setTexts] = useState([]);
    const [passwords, setPasswords] = useState({});
    const [revealedLinks, setRevealedLinks] = useState({});
    const [loading, setLoading] = useState(true); // Loader state

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [fileRes, textRes] = await Promise.all([
                    axiosSecure.get("/upload"),
                    axiosSecure.get("/texts")
                ]);

                setLinks(fileRes.data);
                setTexts(textRes.data.texts || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosSecure]);

    const handlePasswordSubmit = async (id, type) => {
        try {
            const password = passwords[id];
            let response;

            if (type === "file") {
                response = await axiosSecure.post("/upload/private", { id, password });
                setRevealedLinks(prev => ({ ...prev, [id]: response.data.fileUrl }));
            } else if (type === "text") {
                response = await axiosSecure.post("/texts/private", { id, password });
                setRevealedLinks(prev => ({ ...prev, [id]: response.data.textContent }));
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Incorrect password or link not found!",
            });
        }
    };

    const handlePasswordModal = (id, type) => {
        Swal.fire({
            title: "Enter Password",
            input: "password",
            inputPlaceholder: "Password",
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
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
        <div>
            <Navbar />
            <div className="p-8 mt-4 max-w-3xl mx-auto bg-base-300 shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-center mb-6">All Shared Links</h2>

                {/* Loader */}
                {loading && (
                    <div className="flex justify-center items-center h-screen">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                )}

                {/* File Links */}
                {!loading && (
                    <div>
                        <h3 className="text-2xl font-bold mt-6 mb-4">File Links</h3>
                        {links.length === 0 ? <p>No file links available.</p> : links.map((link) => (
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
                )}

                {/* Text Links */}
                {!loading && (
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold mb-4">Text Links</h3>
                        {texts.length === 0 ? <p className="text-gray-500">No text links available.</p> : texts.map((text) => (
                            <div key={text._id} className="border-b py-4 flex flex-col space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium">{text.privacy === "private" ? "Private Text" : "Text Content"}</p>
                                </div>

                                {text.privacy === "private" ? (
                                    <div className="flex flex-col items-start">
                                        {!revealedLinks[text._id] ? (
                                            <button
                                                className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                                onClick={() => handlePasswordModal(text._id, "text")}
                                            >
                                                View Text
                                            </button>
                                        ) : (
                                            <p className="bg-base-100 p-2 rounded">{revealedLinks[text._id]}</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="p-2 rounded">{text.textLink}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer></Footer>
        </div>
    );
};

export default AllLinks;
