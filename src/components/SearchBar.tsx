
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg"
    >
      <input
        type="text"
        placeholder="Search for terminal or location..."
        className="flex-1 bg-transparent border-none outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button 
        type="submit"
        className="ml-2 text-gray-500 hover:text-primary focus:outline-none"
      >
        <Search size={20} />
      </button>
    </form>
  );
};

export default SearchBar;
