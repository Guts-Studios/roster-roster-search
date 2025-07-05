
import React from "react";
import { Link } from "react-router-dom";
import { Personnel, getFullName, getTotalCompensation } from "../types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Shield } from "lucide-react";
import { getPhotoUrl } from "@/utils/photoUtils";

interface ProfileCardProps {
  person: Personnel;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ person }) => {
  const fullName = getFullName(person);
  const initials = `${person.first_name[0]}${person.last_name[0]}`;
  const totalCompensation = getTotalCompensation(person);
  const photoUrl = getPhotoUrl(person);
  
  // Format compensation with commas and dollar sign
  const formattedCompensation = totalCompensation > 0 
    ? `$${totalCompensation.toLocaleString()}`
    : undefined;

  return (
    <Link to={`/profile/${person.id}`}>
      <Card className="w-full hover:shadow-md transition-shadow border-police-gray/20 cursor-pointer">
        <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-gradient-to-r from-police-blue/5 to-police-blue/0">
          <Avatar className="h-12 w-12 bg-police-blue text-white border-2 border-police-gold">
            {photoUrl && <AvatarImage src={photoUrl} alt={fullName} />}
            <AvatarFallback className="bg-police-blue text-white">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-police-navy">{fullName}</h3>
            <div className="flex items-center gap-2">
              {person.badge_number && <Badge variant="outline" className="text-xs border-police-gold text-police-navy bg-police-badge/10">
                {person.badge_number}
              </Badge>}
              {person.classification && <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Shield size={12} className="text-police-blue" />
                {person.classification}
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
            {formattedCompensation && (
              <div className="col-span-2 flex items-center gap-1">
                <span className="font-medium">Total Compensation:</span>{" "}
                <span className="flex items-center text-police-blue">
                  <DollarSign size={14} className="inline mr-0.5" />
                  {formattedCompensation}
                </span>
              </div>
            )}
            {person.regular_pay && (
              <div>
                <span className="font-medium">Base Pay:</span>{" "}
                ${person.regular_pay.toLocaleString()}
              </div>
            )}
            {person.overtime && person.overtime > 0 && (
              <div>
                <span className="font-medium">Overtime:</span>{" "}
                ${person.overtime.toLocaleString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProfileCard;
