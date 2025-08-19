import { getRandomEmoji } from "../../../utils/emojis";
import useGetConversations from "../../hooks/useGetconverstion";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();
	console.log("conversations", conversations);
	
	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{conversations.map((conversation) => (
				<Conversation key={conversation._id} conversation={conversation} />
				
			))}
		</div>
	);
};

export default Conversations;
