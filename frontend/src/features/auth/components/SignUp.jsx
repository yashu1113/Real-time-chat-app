import { Link, useNavigate } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState, useEffect } from "react";
import useSignup from "../hooks/useSignup";

const SignUp = () => {
    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        gender: "",
    });

    const { loading, signup } = useSignup();

    const handleCheckboxChange = (gender) => {
        setInputs({ ...inputs, gender });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(inputs);
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
        <div className={`min-h-screen flex items-center justify-center py-8 px-2 sm:px-4 lg:px-8 transition-opacity duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
            <div className="grid lg:grid-cols-2 gap-0 items-center max-w-5xl w-full mx-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
                {/* Form Section */}
                <div className="w-full max-w-lg mx-auto order-2 lg:order-1 p-6 sm:p-10 bg-gray-950 flex flex-col justify-center">
                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div className="space-y-3 text-center">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
                                Sign Up <span className="text-blue-500">ChatApp</span>
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base">Create your account to start chatting</p>
                        </div>

                        {googleError && (
                            <div className="bg-red-900/70 text-red-300 rounded px-3 py-2 text-sm font-medium border border-red-700 mb-2 animate-pulse">
                                {googleError}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={googleLoading}
                            className={`w-full flex items-center justify-center gap-2 py-2 px-3 border border-gray-700 rounded-lg bg-gray-800 text-white font-semibold text-base hover:bg-gray-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none
                ${googleLoading ? "opacity-70 cursor-not-allowed" : ""}
              `}
                        >
                            {googleLoading ? (
                                <span className="loading loading-spinner border-blue-400"></span>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-base">Sign up with Google</span>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-gray-950 px-3 text-gray-500 tracking-wider font-semibold">or continue with</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-200 mb-1" htmlFor="fullName">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-60"
                                    value={inputs.fullName}
                                    onChange={e => setInputs({ ...inputs, fullName: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-200 mb-1" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="johndoe"
                                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-60"
                                    value={inputs.username}
                                    onChange={e => setInputs({ ...inputs, username: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-200 mb-1" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter Password"
                                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-60"
                                    value={inputs.password}
                                    onChange={e => setInputs({ ...inputs, password: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-200 mb-1" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-60"
                                    value={inputs.confirmPassword}
                                    onChange={e => setInputs({ ...inputs, confirmPassword: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none mt-2
                ${loading ? "opacity-70 cursor-not-allowed" : ""}
              `}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="loading loading-spinner border-white"></span>
                                    Signing Up...
                                </span>
                            ) : "Sign Up"}
                        </button>

                        <div className="flex justify-center items-center mt-4">
                            <Link
                                to={"/login"}
                                className="text-sm font-medium hover:underline text-blue-400 hover:text-blue-300 transition"
                            >
                                Already have an account?
                            </Link>
                        </div>
                    </form>
                </div>
                {/* Illustration Section */}
                <div className="hidden lg:flex items-center justify-center order-1 lg:order-2 bg-gradient-to-br from-blue-900 to-gray-900 h-full">
                    <img
                        src="/temp_image_1746280397716.png"
                        alt="Signup illustration"
                        className="w-full max-w-[420px] mx-auto rounded-xl shadow-xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default SignUp;
