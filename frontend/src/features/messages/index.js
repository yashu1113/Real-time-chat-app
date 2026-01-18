// Messages Feature Module
// Barrel exports for clean imports

export { default as MessageContainer } from "./components/MessageContainer";
export { default as Messages } from "./components/Messages";
export { default as Message } from "./components/Message";
export { default as MessageInput } from "./components/MessageInput";
export { default as useGetMessages } from "./hooks/useGetMessages";
export { default as useSendMessage } from "./hooks/useSendMessage";
export * as messagesApi from "./api/messagesApi";
