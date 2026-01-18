import { MessageContainer } from "../../features/messages";
import { Sidebar } from "../../features/conversations";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const Home = () => {
	const [showSidebar, setShowSidebar] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Check if device is mobile
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Close sidebar when selecting conversation on mobile
	const handleConversationSelect = () => {
		if (isMobile) {
			setShowSidebar(false);
		}
	};

	return (
		<div className='h-screen w-full flex bg-gray-900'>
			{/* Mobile overlay */}
			{isMobile && showSidebar && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
					onClick={() => setShowSidebar(false)}
				/>
			)}

			{/* Sidebar - responsive drawer on mobile */}
			<div className={`
				${isMobile ?
					`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`
					: 'w-full md:w-1/3 lg:w-96'
				}
				h-full bg-gray-800 border-r border-gray-700
			`}>
				<div className="flex flex-col h-full">
					{/* Mobile header with close button */}
					{isMobile && (
						<div className="flex items-center justify-between p-4 border-b border-gray-700">
							<h2 className="text-white font-semibold">Chats</h2>
							<button
								onClick={() => setShowSidebar(false)}
								className="text-white p-2 hover:bg-gray-700 rounded"
							>
								<HiX size={24} />
							</button>
						</div>
					)}
					<Sidebar />
				</div>
			</div>

			{/* Main content area */}
			<div className='flex-1 h-full flex flex-col'>
				{/* Mobile header with menu button */}
				{isMobile && (
					<div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center">
						<button
							onClick={() => setShowSidebar(true)}
							className="text-white p-2 hover:bg-gray-700 rounded mr-3"
						>
							<HiMenu size={24} />
						</button>
						<span className="text-white font-semibold">Chat</span>
					</div>
				)}
				<MessageContainer />
			</div>
		</div>
	);
};

export default Home;
