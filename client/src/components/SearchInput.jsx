import { useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi'; // ensure you imported this

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    console.log('Searching:', e.target.value); // replace with your search logic
  };

  return (
    <div className="relative w-[30rem]">
      <HiOutlineSearch
        fontSize={20}
        className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
      />
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        className="text-sm bg-white focus:outline-none active:outline-none h-10 w-full border border-gray-300 rounded-lg pl-11 pr-4"
      />
    </div>
  );
}

export default SearchInput;
