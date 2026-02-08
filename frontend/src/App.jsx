import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Login, SignUp } from "./features/auth";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./shared/context/AuthContext";
import LoadingSpinner from "./shared/components/ChatWelcome";
import ChatPage from "./pages/ChatPage";
import { useState, useEffect } from "react";

function App() {
	const { authUser } = useAuthContext();
	const [isLoading, setIsLoading] = useState(true);

	// Show loading spinner briefly on initial load
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 800); // 800ms loading animation

		return () => clearTimeout(timer);
	}, [authUser]);

	// Show loading spinner when auth state changes
	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div className='h-screen w-full'>
			<Routes>
				<Route path='/' element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
				<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
				<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
				<Route path='/chat' element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;