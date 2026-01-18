import useConversation from "../store/useConversation";
import { useSocketContext } from "../../../shared/context/SocketContext";

// Simple emoji utility function
const getRandomEmoji = () => {
    const emojis = ["👋", "💬", "🚀", "⭐", "🎯", "🔥", "💡", "✨"];
    return emojis[Math.floor(Math.random() * emojis.length)];
};

const Conversation = ({ conversation }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { onlineUsers } = useSocketContext();

    const isSelected = selectedConversation?._id === conversation._id;
    const isOnline = onlineUsers.includes(conversation._id);

    const handleClick = () => {
        setSelectedConversation(conversation);
    };

    return (
        <>
            <div
                className={`flex gap-2 items-center rounded p-2 py-1 cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-sky-500' : 'hover:bg-sky-500'
                    }`}
                onClick={handleClick}
            >
                <div className={`avatar ${isOnline ? 'online' : ''}`}>
                    <div className='w-12 h-12 rounded-full ring-2 ring-gray-600'>
                        <img
                            src={conversation?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation?.fullName || 'User')}&background=0D8ABC&color=fff&size=128&bold=true`}
                            alt={conversation?.fullName || 'User'}
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation?.fullName || 'User')}&background=0D8ABC&color=fff&size=128&bold=true`;
                            }}
                        />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex gap-3 justify-between'>
                        <p className={`font-bold ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                            {conversation?.fullName || 'User'}
                        </p>
                        <span className={`text-xl ${isSelected ? 'text-white' : ''}`}>{getRandomEmoji()}</span>
                    </div>
                </div>
            </div>
            <div className='divider my-0 py-0 h-1' />
        </>
    );
};

export default Conversation;
