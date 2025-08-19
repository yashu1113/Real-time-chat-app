import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/usesendmessage";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { sendMessage, loading } = useSendMessage();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;
		await sendMessage(message);
		setMessage("");
	};

	return (
		<form className='px-6 py-4 bg-gray-800 border-t border-gray-700' onSubmit={handleSubmit}>
			<div className='w-full relative'>
				<input
					type='text'
					className='border text-base rounded-xl block w-full p-4 pr-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
					placeholder='✨ Type your message here...'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button 
					type="submit" 
					className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-500 hover:text-blue-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={loading || !message.trim()}
				>
					{loading ? (
						<div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
					) : (
						<BsSend className="w-5 h-5" />
					)}
				</button>
			</div>
		</form>
	);
};

export default MessageInput;
