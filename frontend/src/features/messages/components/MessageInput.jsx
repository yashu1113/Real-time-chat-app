import { useState, useRef, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import useSendMessage from "../hooks/useSendMessage";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const { sendMessage, loading } = useSendMessage();
	const emojiPickerRef = useRef(null);
	const inputRef = useRef(null);

	// Close emoji picker when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
				setShowEmojiPicker(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;
		await sendMessage(message);
		setMessage("");
	};

	const handleEmojiClick = (emojiData) => {
		const emoji = emojiData.emoji;
		setMessage((prev) => prev + emoji);
		inputRef.current?.focus();
	};

	const toggleEmojiPicker = () => {
		setShowEmojiPicker((prev) => !prev);
	};

	const handleKeyDown = (e) => {
		// Enter to send, Shift+Enter for new line (future: use textarea)
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<form className="px-6 py-4 bg-gray-800 border-t border-gray-700" onSubmit={handleSubmit}>
			<div className="w-full relative pb-5">
				{/* Emoji Picker Popup */}
				{showEmojiPicker && (
					<div
						ref={emojiPickerRef}
						className="absolute bottom-full mb-2 left-0 z-50 animate-slideUp"
					>
						<EmojiPicker
							onEmojiClick={handleEmojiClick}
							theme="dark"
							width={350}
							height={400}
							searchDisabled={false}
							skinTonesDisabled
							previewConfig={{ showPreview: false }}
						/>
					</div>
				)}

				{/* Input Container */}
				<div className="flex items-center gap-2">
					{/* Emoji Button */}
					<button
						type="button"
						onClick={toggleEmojiPicker}
						className="p-3 text-gray-400 hover:text-yellow-400 transition-colors duration-200 hover:bg-gray-700 rounded-full"
						title="Add emoji"
					>
						<MdEmojiEmotions className="w-6 h-6" />
					</button>

					{/* Message Input */}
					<div className="flex-1 relative">
						<input
							ref={inputRef}
							type="text"
							className="border text-base rounded-xl w-full p-4 pr-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
							placeholder="✨ Type your message here..."
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						{/* Keyboard Hint */}
						<div className="absolute -bottom-5 left-0 text-xs text-gray-500">
							Press <span className="text-gray-400 font-semibold">Enter</span> to send ↵
						</div>
					</div>

					{/* Send Button */}
					<button
						type="submit"
						className="absolute right-4 text-blue-500 hover:text-blue-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={loading || !message.trim()}
						title="Send message (Enter)"
					>
						{loading ? (
							<div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
						) : (
							<BsSend className="w-5 h-5" />
						)}
					</button>
				</div>
			</div>

			<style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.2s ease-out;
        }
      `}</style>
		</form>
	);
};

export default MessageInput;
