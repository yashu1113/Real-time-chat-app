"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import useLogin from "../../hooks/useLogin"
import Image from "next/image"

export function LoginForm({ onForgotPassword }: { onForgotPassword: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useLogin()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

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
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/login-page-pZBjg7Vta1coXXQMIFvKhdubuWT77D.png"
          alt="Login illustration"
          width={500}
          height={500}
          className="w-full max-w-[400px] mx-auto"
          priority
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
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
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
        </form>
      </div>
    </div>
  )
}

const Login = () => {
  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log("Forgot password clicked")
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm onForgotPassword={handleForgotPassword} />
      <div className="absolute bottom-4 right-4">
        <Link to="/signup" className="text-sm text-blue-600 hover:underline">
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  )
}

export default Login

// STARTER CODE FOR THIS FILE
// const Login = () => {
// 	return (
// 		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
// 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
// 				<h1 className='text-3xl font-semibold text-center text-gray-300'>
// 					Login
// 					<span className='text-blue-500'> ChatApp</span>
// 				</h1>

// 				<form>
// 					<div>
// 						<label className='label p-2'>
// 							<span className='text-base label-text'>Username</span>
// 						</label>
// 						<input type='text' placeholder='Enter username' className='w-full input input-bordered h-10' />
// 					</div>

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Enter Password'
// 							className='w-full input input-bordered h-10'
// 						/>
// 					</div>
// 					<a href='#' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
// 						{"Don't"} have an account?
// 					</a>

// 					<div>
// 						<button className='btn btn-block btn-sm mt-2'>Login</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default Login;