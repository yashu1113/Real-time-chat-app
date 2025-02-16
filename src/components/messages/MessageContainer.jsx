import React from "react";
import PropTypes from "prop-types"; // To enforce type checking
import { TiMessages } from "react-icons/ti"; // Message icon
import { useAuthContext } from "../../context/AuthContext"; // Importing your context (adjust the path if needed)

// Component definition
const NoChatSelected = () => {
  const { authUser } = useAuthContext();

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-900">
      <div className="w-full max-w-4xl px-10 text-center flex flex-col items-center gap-8"> {/* Much wider container */}
        {/* Welcome message */}
        <p className="text-2xl md:text-3xl font-semibold text-gray-200">
          Welcome 👋 {authUser?.fullName || "Guest"} ❄
        </p>
        {/* Prompt to select a chat */}
        <p className="text-lg md:text-xl text-gray-400">
          Select a chat to start messaging
        </p>
        {/* Icon */}
        <TiMessages className="text-5xl md:text-7xl text-blue-500" aria-label="Message Icon" />
      </div>
    </div>
  );
};

// PropTypes validation
NoChatSelected.propTypes = {
  authUser: PropTypes.shape({
    fullName: PropTypes.string,
  }),
};

export default NoChatSelected;
