
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Personnel, getFullName, getTotalCompensation } from "../types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Shield } from "lucide-react";
import { getPhotoUrlVariations } from "@/utils/photoUtils";

interface ProfileCardProps {
  person: Personnel;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ person }) => {
  const fullName = getFullName(person);
  const initials = `${person.first_name[0]}${person.last_name[0]}`;
  const totalCompensation = getTotalCompensation(person);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  
  // Check for working photo URL by trying multiple variations
  useEffect(() => {
    const findWorkingPhotoUrl = async () => {
      const potentialUrls = getPhotoUrlVariations(person);
      if (potentialUrls.length === 0) {
        setPhotoUrl(null);
        return;
      }
      
      // Try each URL variation until we find one that works
      for (const url of potentialUrls) {
        try {
          const success = await new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
          });
          
          if (success) {
            setPhotoUrl(url);
            return;
          }
        } catch {
          continue;
        }
      }
      
      // If no variation worked, set to null
      setPhotoUrl(null);
    };
    
    findWorkingPhotoUrl();
  }, [person]);
  
  // Format compensation with commas and dollar sign
  const formattedCompensation = totalCompensation > 0 
    ? `$${totalCompensation.toLocaleString()}`
    : undefined;

  return (
    <Link to={`/profile/${person.id}`}>
      <Card className="w-full hover:shadow-md transition-shadow border-border cursor-pointer bg-card">
        <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 pb-2 bg-gradient-to-r from-inadvertent-yellow/5 to-inadvertent-yellow/0">
          <div className="relative h-20 w-16 sm:h-24 sm:w-20 bg-inadvertent-yellow border-2 border-inadvertent-yellow flex-shrink-0 rounded-md overflow-hidden">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-inadvertent-yellow flex items-center justify-center">
                <span className="text-inadvertent-dark-text font-semibold text-sm sm:text-base">{initials}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col text-center sm:text-left min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">{fullName}</h3>
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
              {person.badge_number && <Badge variant="outline" className="text-xs border-inadvertent-yellow text-foreground bg-inadvertent-yellow/10 whitespace-nowrap">
                Badge #{person.badge_number}
              </Badge>}
              {person.classification && <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 truncate">
                <Shield size={12} className="text-inadvertent-yellow flex-shrink-0" />
                <span className="truncate">{person.classification}</span>
              </span>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 px-3 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-xs sm:text-sm">
            {person.division && (
              <div className="col-span-1 sm:col-span-2">
                <span className="font-medium">Division:</span> <span className="break-words">{person.division}</span>
              </div>
            )}
            {formattedCompensation && (
              <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-medium whitespace-nowrap">Total Compensation:</span>
                <span className="flex items-center text-inadvertent-yellow">
                  <DollarSign size={14} className="inline mr-0.5 flex-shrink-0" />
                  <span className="break-all">{formattedCompensation}</span>
                </span>
              </div>
            )}
            {person.regular_pay && (
              <div className="break-words">
                <span className="font-medium">Base Pay:</span>{" "}
                <span className="break-all">${person.regular_pay.toLocaleString()}</span>
              </div>
            )}
            {person.overtime && person.overtime > 0 && (
              <div className="break-words">
                <span className="font-medium">Overtime:</span>{" "}
                <span className="break-all">${person.overtime.toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProfileCard;
