
import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import RosterList from "../components/RosterList";
import { rosterData } from "../data/rosterData";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
              Showing {rosterData.length} personnel records
            </div>
          </div>
          <RosterList people={rosterData} searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
};

export default Index;
