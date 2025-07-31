import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";

function SearchInput({ users, tasks }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Try to find a user by name that matches searchTerm
    const user = users.find(
      (u) => u.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (user) {
      if (user.teamCategory) {
        navigate(`/team/${user.teamCategory}`);
      } else {
        alert("This user does not belong to a team category.");
      }
      return;
    }

    // If not a user, you can implement task search logic here or alert:
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredTasks.length > 0) {
      // Example: Navigate to a tasks search results page
      // or do whatever with the tasks
      console.log("Filtered Tasks:", filteredTasks);
    } else {
      alert("No matching users or tasks found.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-[30rem]">
      <HiOutlineSearch
        fontSize={20}
        className="text-black absolute top-1/2 -translate-y-1/2 left-3"
      />
      <input
        type="text"
        placeholder="Search users or tasks..."
        value={searchTerm}
        onChange={handleInputChange}
        className="text-sm bg-white focus:outline-none active:outline-none h-10 w-full border border-gray-300 rounded-lg pl-11 pr-4"
      />
    </form>
  );
}

export default SearchInput;
