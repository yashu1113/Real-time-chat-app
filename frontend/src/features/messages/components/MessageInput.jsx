import React from 'react';
import { IoSend } from 'react-icons/io5';
import { BsEmojiSmile } from 'react-icons/bs';
import { GrAttachment } from 'react-icons/gr';
import { IoMdMic } from 'react-icons/io';

const MessageInput = ({ messageText, setMessageText, onSubmit, sending }) => {
    return (
        <form onSubmit={onSubmit} className="message-input-container">
            <button type="button" className="input-icon-btn" disabled title="Emoji picker not available">
                <BsEmojiSmile />
            </button>
            <button type="button" className="input-icon-btn" disabled title="Attachments not available">
                <GrAttachment />
            </button>
            <input
                type="text"
                placeholder="Type a message"
                className="message-input"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
            />
            <button
                type="submit"
                className="send-btn"
                disabled={!messageText.trim() || sending}
            >
                {messageText.trim() ? <IoSend /> : <IoMdMic />}
            </button>
        </form>
    );
};

export default MessageInput;
