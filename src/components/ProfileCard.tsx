
import React from "react";
import { Link } from "react-router-dom";
import { Person } from "../types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Shield } from "lucide-react";

interface ProfileCardProps {
  person: Person;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ person }) => {
  const initials = person.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Format salary with commas and dollar sign
  const formattedSalary = person.salary 
    ? `$${person.salary.toLocaleString()}`
    : undefined;

  return (
    <Link to={`/profile/${person.id}`}>
      <Card className="w-full hover:shadow-md transition-shadow border-police-gray/20 cursor-pointer">
        <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-gradient-to-r from-police-blue/5 to-police-blue/0">
          <Avatar className="h-12 w-12 bg-police-blue text-white border-2 border-police-gold">
            {person.imageUrl && <AvatarImage src={person.imageUrl} alt={person.name} />}
            <AvatarFallback className="bg-police-blue text-white">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-police-navy">{person.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-police-gold text-police-navy bg-police-badge/10">
                {person.badgeNumber}
              </Badge>
              {person.rank && <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Shield size={12} className="text-police-blue" />
                {person.rank}
              </span>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            {person.division && (
              <div className="col-span-2">
                <span className="font-medium">Division:</span> {person.division}
              </div>
            )}
            {person.department && (
              <div>
                <span className="font-medium">Department:</span> {person.department}
              </div>
            )}
            {person.status && (
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span className={person.status === "Active" ? "text-green-600" : "text-police-red"}>
                  {person.status}
                </span>
              </div>
            )}
            {formattedSalary && (
              <div className="col-span-2 flex items-center gap-1">
                <span className="font-medium">Salary:</span>{" "}
                <span className="flex items-center text-police-blue">
                  <DollarSign size={14} className="inline mr-0.5" />
                  {formattedSalary}
                </span>
              </div>
            )}
            {person.email && (
              <div className="col-span-2 truncate">
                <span className="font-medium">Email:</span>{" "}
                <a 
                  href={`mailto:${person.email}`} 
                  className="text-police-lightBlue hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {person.email}
                </a>
              </div>
            )}
            {person.phone && (
              <div>
                <span className="font-medium">Phone:</span> {person.phone}
              </div>
            )}
            {person.hireDate && (
              <div>
                <span className="font-medium">Hired:</span>{" "}
                {new Date(person.hireDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProfileCard;
