import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";
import { useSearchAllQuery } from "../redux/slices/api/taskApiSlice";

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Use the search query with skip to avoid unnecessary API calls
  const { data: searchResults, isLoading, error } = useSearchAllQuery(searchTerm, {
    skip: searchTerm.length < 2,
  });

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.length >= 2);
    setIsSearching(value.length >= 2);
  };

  // Handle result selection
  const handleResultClick = (item) => {
    setSearchTerm("");
    setShowResults(false);
    
    if (item.type === 'task') {
      // Navigate to tasks page with the specific task highlighted
      navigate('/tasks', { state: { highlightTask: item._id } });
    } else if (item.type === 'user') {
      // Navigate to team page or user profile
      navigate('/team');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchResults && (searchResults.tasks.length > 0 || searchResults.users.length > 0)) {
      // If there are results, navigate to tasks page with search term
      navigate('/tasks', { state: { searchTerm } });
      setSearchTerm("");
      setShowResults(false);
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update searching state based on query status
  useEffect(() => {
    setIsSearching(isLoading);
  }, [isLoading]);

  return (
    <div ref={searchRef} className="relative w-[30rem]">
      <form onSubmit={handleSubmit}>
        <HiOutlineSearch
          fontSize={20}
          className="text-black absolute top-1/2 -translate-y-1/2 left-3 z-10"
        />
        <input
          type="text"
          placeholder="Search users or tasks..."
          value={searchTerm}
          onChange={handleInputChange}
          className="text-sm bg-white focus:outline-none active:outline-none h-10 w-full border border-gray-300 rounded-lg pl-11 pr-4"
        />
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto mt-1"
        >
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              <p>Search failed. Please try again.</p>
            </div>
          ) : searchResults && (searchResults.tasks.length > 0 || searchResults.users.length > 0) ? (
            <div>
              {/* Tasks Section */}
              {searchResults.tasks.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-100 text-sm font-semibold text-gray-700 border-b">
                    Tasks ({searchResults.tasks.length})
                  </div>
                  {searchResults.tasks.map((task) => (
                    <div
                      key={task._id}
                      onClick={() => handleResultClick(task)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{task.name}</p>
                          <p className="text-sm text-gray-500">
                            Team: {task.team} • Status: {task.status}
                          </p>
                          {task.members.length > 0 && (
                            <p className="text-xs text-gray-400">
                              Members: {task.members.map(m => m.name).join(', ')}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'inProgress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Users Section */}
              {searchResults.users.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-100 text-sm font-semibold text-gray-700 border-b">
                    Users ({searchResults.users.length})
                  </div>
                  {searchResults.users.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleResultClick(user)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">
                            {user.title} • {user.role}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>No results found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchInput;
