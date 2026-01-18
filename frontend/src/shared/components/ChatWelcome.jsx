import { useState, useEffect } from "react";

const ChatWelcome = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const loadingSteps = [
        { emoji: "👋", message: "Welcome back!" },
        { emoji: "�", message: "Loading your chats..." },
        { emoji: "✨", message: "Setting up conversations..." },
        { emoji: "🚀", message: "Almost there..." }
    ];

    useEffect(() => {
        // Cycle through loading steps
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < loadingSteps.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 500);

        return () => clearInterval(stepInterval);
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
            {/* Animated Background Circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 px-4">
                {/* Chat Bubbles Animation */}
                <div className="flex flex-col gap-3 w-80">
                    {/* Incoming Message Bubble */}
                    <div className="flex items-end gap-2 animate-slideInLeft">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <span className="text-white text-sm">👋</span>
                        </div>
                        <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs shadow-xl border border-gray-700">
                            <p className="text-white text-sm">Hey there! Getting your chats ready...</p>
                        </div>
                    </div>

                    {/* Typing Indicator */}
                    <div className="flex items-end gap-2 animate-slideInLeft" style={{ animationDelay: '400ms' }}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <span className="text-white text-sm">💬</span>
                        </div>
                        <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-5 py-3 shadow-xl border border-gray-700">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Loading Status */}
                <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl animate-bounce">{loadingSteps[currentStep].emoji}</span>
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
                            {loadingSteps[currentStep].message}
                        </h2>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex gap-2 justify-center">
                        {loadingSteps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 rounded-full transition-all duration-500 ${index <= currentStep
                                        ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                                        : 'w-1 bg-gray-700'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Floating Icons Animation */}
                <div className="relative w-64 h-16">
                    <div className="absolute inset-0 flex items-center justify-center gap-4">
                        <span className="text-2xl animate-float" style={{ animationDelay: '0s' }}>💬</span>
                        <span className="text-2xl animate-float" style={{ animationDelay: '0.5s' }}>✨</span>
                        <span className="text-2xl animate-float" style={{ animationDelay: '1s' }}>🚀</span>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default ChatWelcome;
