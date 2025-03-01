import { useNavigate, useLocation } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Swal from "sweetalert2";
import auth from "../firebase/firebase.init";
import useAxiosPublic from "../hooks/useAxiosPublic"; // Import axiosPublic

const SocialLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPublic = useAxiosPublic(); // Use axiosPublic hook

    const googleProvider = new GoogleAuthProvider();

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const user = result.user;

                // Store user info in the database using axiosPublic
                saveUserToDatabase(user.uid, user.email, user.displayName);

                Swal.fire({
                    title: "Success!",
                    text: "Logged in successfully!",
                    icon: "success",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                });

                navigate(location?.state ? location.state : "/");
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    // Function to save user to the database using axiosPublic
    const saveUserToDatabase = (uid, email, displayName) => {
        axiosPublic
            .post("/users", { uid, email, displayName }) // POST request using axiosPublic
            .then((response) => {
                console.log("User saved:", response.data);
            })
            .catch((error) => {
                console.error("Error saving user:", error);
            });
    };

    return (
        <div className="mt-4 flex justify-center">
            <button
                onClick={handleGoogleSignIn}
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
                Sign in with Google
            </button>
        </div>
    );
};

export default SocialLogin;
