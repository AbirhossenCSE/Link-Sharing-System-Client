import React, { useContext, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/Authcontext';


const SignIn = () => {
    const { signInUser, setUser } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignIn = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        signInUser(email, password)
            .then((result) => {
                const user = result.user;
                setUser(user);

                Swal.fire({
                    title: 'Login Successful!',
                    text: 'You have successfully logged into your account.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });

                setTimeout(() => {
                    navigate(location?.state ? location.state : '/');
                }, 2000);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Sign In</h1>

                <form onSubmit={handleSignIn} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter your password"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                        <div className="mt-2 text-right">
                            <a href="#" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 font-medium hover:underline">
                        Register
                    </Link>
                </p>

                <div className="mt-6">
                    {/* <SocialLogin /> */}
                </div>
            </div>
        </div>
    );
};

export default SignIn;
