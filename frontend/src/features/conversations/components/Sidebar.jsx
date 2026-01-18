import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
    return (
        <div className='border-r border-slate-500 h-full flex flex-col bg-gray-800'>
            <div className='flex-shrink-0 p-4'>
                <SearchInput />
            </div>
            <div className='divider px-3 border-gray-700'></div>
            <div className='flex-1 overflow-y-auto'>
                <Conversations />
            </div>
            <div className='flex-shrink-0 border-t border-gray-700 p-4'>
                <LogoutButton />
            </div>
        </div>
    );
};

export default Sidebar;
