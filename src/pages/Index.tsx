
import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import RosterList from "../components/RosterList";
import { usePersonnelSearch } from "../hooks/usePersonnel";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: personnel = [], isLoading, error } = usePersonnelSearch(searchTerm);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need to be authenticated to view personnel records.
          </p>
          <p className="text-sm text-gray-500">
            Please contact your administrator to set up authentication.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Personnel Search</h2>
          <p className="text-gray-600 mb-6">
            Search the roster by name or badge number to find personnel information
          </p>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Roster {searchTerm && `- Search Results for "${searchTerm}"`}
            </h2>
            <div className="text-sm text-gray-500">
              {isLoading ? "Loading..." : `Showing ${personnel.length} personnel records`}
            </div>
          </div>
          <RosterList personnel={personnel} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
