
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useResponsivePlaceholder } from "@/hooks/useResponsivePlaceholder";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  const { getPlaceholder } = useResponsivePlaceholder();
  
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
        <Search size={18} />
      </div>
      <Input
        type="text"
        inputMode="search"
        placeholder={getPlaceholder("First name, last name, or badge number", "First or Last Name or Badge #")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 w-full"
      />
    </div>
  );
};

export default SearchBar;
