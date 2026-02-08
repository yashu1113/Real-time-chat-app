"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import useLogin from "../hooks/useLogin"

export function LoginForm({ onForgotPassword }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const { login } = useLogin()

    async function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            await login(email, password)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            <div className="hidden lg:block">
                <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/login-page-pZBjg7Vta1coXXQMIFvKhdubuWT77D.png"
                    alt="Login illustration"
                    width={500}
                    height={500}
                    className="w-full max-w-[400px] mx-auto"
                />
            </div>
            <div className="w-full max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold">Welcome back</h1>
                        <p className="text-gray-500">Enter your credentials to access your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Login with credentials</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    required
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Log in"}
                    </button>

                    <div className="text-center">
                        <Link to="/signup" className="text-sm text-blue-600 hover:underline font-normal">
                            Don't have an account? Sign up
                        </Link>
                    </div>

                    <div className="text-center">
                        <button
                            className="text-sm text-blue-600 hover:underline font-normal"
                            onClick={(e) => {
                                e.preventDefault()
                                onForgotPassword()
                            }}
                        >
                            Forgot your password?
                        </button>
                    </div>

                    {/* Google Sign-In Button */}
                    <div className="mt-6 text-center">
                        <a
                            href="/api/auth/google"
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                                <path d="M21.805 10.023h-9.82v3.954h5.64c-.243 1.44-1.68 4.23-5.64 4.23-3.4 0-6.17-2.82-6.17-6.3s2.77-6.3 6.17-6.3c1.93 0 3.22.82 3.97 1.52l2.7-2.6C17.3 5.1 15.4 4.2 12 4.2 6.6 4.2 2.3 8.5 2.3 14s4.3 9.8 9.7 9.8c5.6 0 9.3-3.9 9.3-9.4 0-.63-.07-1.1-.485-1.353z" fill="#4285F4" />
                                <path d="M3.5 7.5l3.3 2.4c.9-2.7 3.6-4.5 6.7-4.5 1.9 0 3.3.7 4.3 1.7l2.7-2.6C16.9 3.7 14.7 3 12 3 7.3 3 3.5 6.3 3.5 7.5z" fill="#34A853" />
                                <path d="M12 21.8c2.7 0 5-1.1 6.7-2.9l-3.1-2.5c-.9.6-2.1 1-3.6 1-2.7 0-5-1.8-5.8-4.3l-3.3 2.5c1.3 2.6 4.3 4.2 7.8 4.2z" fill="#FBBC05" />
                                <path d="M21.8 10c0-.7-.1-1.3-.3-1.9H12v3.9h5.6c-.2 1-.7 1.8-1.4 2.4l3.1 2.4c1.8-1.7 2.9-4.2 2.9-7.2z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}

const Login = () => {
    const [fadeIn, setFadeIn] = useState(false);
    useEffect(() => {
        setFadeIn(true);
        return () => setFadeIn(false);
    }, []);

    return (
        <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
            <LoginForm onForgotPassword={() => { }} />
        </div>
    )
}

export default Login
