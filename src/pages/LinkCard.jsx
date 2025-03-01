import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LinkCard = () => {
    const location = useLocation(); // Get the state passed via navigation
    const { username, email, fileUrl } = location.state || {};

    return (
        <div>
            <Navbar></Navbar>
            <div className="link-card">
                <h2>Upload Details</h2>
                <div>
                    <strong>Name:</strong> {username || 'N/A'}
                </div>
                <div>
                    <strong>Email:</strong> {email || 'N/A'}
                </div>
                <div>
                    <strong>File URL:</strong>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                        View File
                    </a>
                    <p>Your Link: {fileUrl}</p>
                </div>
            </div>
        </div>
    );
};

export default LinkCard;
