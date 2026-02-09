import { Link, useNavigate } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState, useEffect } from "react";
import useSignup from "../hooks/useSignup";

const SignUp = () => {
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { loading, signup } = useSignup();



    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signup(inputs);

        // Navigate to login page after successful signup
        if (result && result.success) {
            navigate('/login');
        }
    };

    const navigate = useNavigate();

    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState(null);

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            setGoogleError(null);
            window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`, "_self");
        } catch (err) {
            setGoogleError("Failed to initiate Google login");
            console.error("Google login error:", err);
        } finally {
            setGoogleLoading(false);
        }
    };

    // Animation state for fade effect
    const [fadeIn, setFadeIn] = useState(false);
    useEffect(() => {
        setFadeIn(true);
        return () => setFadeIn(false);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="grid lg:grid-cols-2 w-full mx-auto bg-white shadow-2xl overflow-hidden">
                {/* Form Section - LEFT SIDE */}
                <div className={`flex items-center justify-center p-6 lg:p-8 transform transition-all duration-700 ${fadeIn ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}>
                    <div className="w-full max-w-md">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1 text-center">
                                <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                                <p className="text-gray-500 text-sm">Join us and start chatting</p>
                            </div>

                            {googleError && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded animate-shake">
                                    {googleError}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                {googleLoading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        <span>Sign up with Google</span>
                                    </>
                                )}
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        disabled={loading}
                                        value={inputs.name}
                                        onChange={e => setInputs({ ...inputs, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        disabled={loading}
                                        value={inputs.email}
                                        onChange={e => setInputs({ ...inputs, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter password"
                                            required
                                            disabled={loading}
                                            value={inputs.password}
                                            onChange={e => setInputs({ ...inputs, password: e.target.value })}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm password"
                                            required
                                            disabled={loading}
                                            value={inputs.confirmPassword}
                                            onChange={e => setInputs({ ...inputs, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="loading loading-spinner"></span>
                                        Signing up...
                                    </span>
                                ) : "Sign up"}
                            </button>

                            <div className="text-center">
                                <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                                    Already have an account? <span className="font-semibold">Log in</span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Illustration Section - RIGHT SIDE */}
                <div className={`hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-16 px-12 transform transition-all duration-700 delay-200 ${fadeIn ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}>
                    <div className="text-center space-y-6 w-full max-w-md">
                        <img
                            src="https://illustrations.popsy.co/white/communication.svg"
                            alt="Signup illustration"
                            className="w-full max-w-[300px] mx-auto drop-shadow-2xl animate-bounce-slow"
                        />
                        <div className="text-white space-y-2">
                            <h2 className="text-2xl font-bold">Welcome to ChatApp!</h2>
                            <p className="text-blue-100 text-base">Connect with friends and start meaningful conversations</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default SignUp;
