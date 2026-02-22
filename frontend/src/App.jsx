import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Login, SignUp } from "./features/auth";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./shared/context/AuthContext";
import LoadingSpinner from "./shared/components/ChatWelcome";
import ChatPage from "./pages/ChatPage";

function App() {
	const { authUser, loading } = useAuthContext();

	// Only show spinner during OAuth token verification (token exists, user not yet loaded)
	// Never show spinner to fresh unauthenticated visitors
	if (loading) {
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