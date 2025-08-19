import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConverstion";
import useGetconverstion from "../../hooks/useGetconverstion";
import toast from "react-hot-toast";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetconverstion();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    if (search.trim().length < 3) {
      return toast.error("Search query must be at least 3 characters long");
    }

    const foundConversation = conversations.find(
      (c) => c.fullName?.toLowerCase().includes(search.toLowerCase().trim())
    );
    
    if (foundConversation) {
      setSelectedConversation(foundConversation);
      setSearch("");
    } else {
      toast.error("No conversation found with that name");
    }
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className='flex items-center gap-2'>
      <input 
        type='text' 
        placeholder='Search…' 
        value={search}
        onChange={handleInputChange}
        className='input input-bordered rounded-full' 
      />
      <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
        <IoSearchSharp className='w-6 h-6 outline-none' />
      </button>
    </form>
  );
};

export default SearchInput;
