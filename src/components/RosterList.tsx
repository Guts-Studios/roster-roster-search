
import React from "react";
import { Person } from "../types";
import ProfileCard from "./ProfileCard";

interface RosterListProps {
  people: Person[];
  searchTerm: string;
}

const RosterList: React.FC<RosterListProps> = ({ people, searchTerm }) => {
  // Filter the people based on the search term
  const filteredPeople = people.filter((person) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      person.name.toLowerCase().includes(searchLower) ||
      person.badgeNumber.toLowerCase().includes(searchLower)
    );
  });

  if (filteredPeople.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-xl text-gray-500">No matching records found</p>
        <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPeople.map((person) => (
        <ProfileCard key={person.id} person={person} />
      ))}
    </div>
  );
};

export default RosterList;
