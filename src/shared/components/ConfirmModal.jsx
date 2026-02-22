import React from 'react';
import { createPortal } from 'react-dom';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", type = "danger" }) => {
    if (!isOpen) return null;

    const typeClasses = {
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20",
        warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20",
        info: "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20"
    };

    const iconColors = {
        danger: "text-red-400",
        warning: "text-amber-400",
        info: "text-blue-400"
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1a1f26] border border-white/10 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                <div className="p-6 space-y-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`p-3 rounded-full bg-white/5 ${iconColors[type]}`}>
                            {type === 'danger' && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-3.375c0-.621-.504-1.125-1.125-1.125h-2.25c-.621 0-1.125.504-1.125 1.125V3.375m7.5 0H9" />
                                </svg>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                        <p className="text-gray-400 text-sm">{message}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-all"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${typeClasses[type]}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
                .animate-scaleIn { animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>,
        document.body
    );
};

export default ConfirmModal;
