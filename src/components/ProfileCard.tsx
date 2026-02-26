
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Personnel, getFullName } from "../types";
import { Card, CardHeader } from "@/components/ui/card";
import { getPhotoUrlVariations } from "@/utils/photoUtils";
import { useRosterUrlState } from "../hooks/useUrlState";

interface ProfileCardProps {
  person: Personnel;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ person }) => {
  const fullName = getFullName(person);
  const initials = `${person.first_name?.[0] || ''}${person.last_name?.[0] || ''}`;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const { createProfileLink } = useRosterUrlState();

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

  return (
    <Link to={createProfileLink(person.id)}>
      <Card className="w-full h-full hover:shadow-md transition-shadow border-border cursor-pointer bg-card">
        <CardHeader className="flex flex-row items-center gap-4 sm:gap-6 pb-3 bg-gradient-to-r from-inadvertent-yellow/5 to-inadvertent-yellow/0">
          <div className="relative h-32 w-24 sm:h-40 sm:w-32 bg-inadvertent-yellow border-2 border-inadvertent-yellow flex-shrink-0 rounded-md overflow-hidden">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-inadvertent-yellow flex items-center justify-center">
                <span className="text-inadvertent-dark-text font-semibold text-lg sm:text-xl">{initials}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col text-left min-w-0 flex-1 justify-center">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground truncate mb-2">{fullName}</h3>
            {person.badge_number && (
              <span className="text-sm sm:text-base text-muted-foreground">
                Badge #{person.badge_number}
              </span>
            )}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default ProfileCard;
