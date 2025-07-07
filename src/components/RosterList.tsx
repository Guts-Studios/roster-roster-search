
import React from "react";
import { Personnel } from "../types";
import ProfileCard from "./ProfileCard";

interface RosterListProps {
  personnel: Personnel[];
  isLoading: boolean;
}

const RosterList: React.FC<RosterListProps> = ({ personnel, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inadvertent-yellow"></div>
        <p className="text-muted-foreground mt-4">Loading personnel records...</p>
      </div>
    );
  }

  if (personnel.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-xl text-muted-foreground">No matching records found</p>
        <p className="text-sm text-muted-foreground mt-2">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {personnel.map((person) => (
        <ProfileCard key={person.id} person={person} />
      ))}
    </div>
  );
};

export default RosterList;
