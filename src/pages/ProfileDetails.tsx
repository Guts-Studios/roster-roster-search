
import React from "react";
import { useParams, Link } from "react-router-dom";
import { usePersonnelById } from "../hooks/usePersonnel";
import { getFullName, getTotalCompensation } from "../types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, DollarSign } from "lucide-react";
import { getPhotoUrl } from "@/utils/photoUtils";

const ProfileDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: person, isLoading, error } = usePersonnelById(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inadvertent-yellow"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You need to be authenticated to view public records.</p>
          <Link to="/">
            <Button className="bg-inadvertent-yellow text-inadvertent-dark-text">
              <ArrowLeft size={16} /> Return to Roster
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested profile could not be found.</p>
          <Link to="/">
            <Button className="bg-inadvertent-yellow text-inadvertent-dark-text">
              <ArrowLeft size={16} /> Return to Roster
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const fullName = getFullName(person);
  const initials = `${person.first_name[0]}${person.last_name[0]}`;
  const totalCompensation = getTotalCompensation(person);
  const photoUrl = getPhotoUrl(person);
  
  // Format compensation with commas and dollar sign (consistent with other pay fields)
  const formattedCompensation = totalCompensation > 0
    ? `$${totalCompensation.toLocaleString()}`
    : "Not available";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-inadvertent-yellow hover:text-foreground mb-6">
          <Button variant="outline" className="border-inadvertent-yellow text-inadvertent-yellow hover:bg-inadvertent-yellow/10">
            <ArrowLeft size={16} className="mr-2" /> Back to Roster
          </Button>
        </Link>
        
        <Card className="w-full max-w-4xl mx-auto border-border bg-card">
          <CardHeader className="bg-gradient-to-r from-inadvertent-yellow/10 to-inadvertent-yellow/5 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative h-32 w-24 sm:h-40 sm:w-32 bg-inadvertent-yellow border-4 border-inadvertent-yellow flex-shrink-0 rounded-lg overflow-hidden">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-inadvertent-yellow flex items-center justify-center">
                    <span className="text-inadvertent-dark-text font-bold text-xl sm:text-2xl">{initials}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center sm:items-start">
                <h1 className="text-3xl font-bold text-foreground text-center sm:text-left">{fullName}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 justify-center sm:justify-start">
                  {person.badge_number && <Badge variant="outline" className="text-sm border-inadvertent-yellow bg-inadvertent-yellow/10 px-3 py-1">
                    Badge #{person.badge_number}
                  </Badge>}
                  {person.classification && (
                    <span className="text-sm flex items-center gap-1 bg-inadvertent-yellow/10 px-3 py-1 rounded-full">
                      <Shield size={14} className="text-inadvertent-yellow" />
                      {person.classification}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {person.division && (
                <div className="border-l-2 border-inadvertent-yellow pl-4">
                  <h2 className="text-sm text-muted-foreground uppercase">Division</h2>
                  <p className="text-lg font-medium text-foreground">{person.division}</p>
                </div>
              )}
              
              <div className="border-l-2 border-inadvertent-yellow pl-4">
                <h2 className="text-sm text-muted-foreground uppercase">Total Compensation</h2>
                <p className="text-lg font-medium text-inadvertent-yellow">
                  {formattedCompensation}
                </p>
              </div>
              
              {person.regular_pay && (
                <div className="border-l-2 border-inadvertent-yellow pl-4">
                  <h2 className="text-sm text-muted-foreground uppercase">Regular Pay</h2>
                  <p className="text-lg font-medium text-foreground">
                    ${person.regular_pay.toLocaleString()}
                  </p>
                </div>
              )}

              {person.overtime && person.overtime > 0 && (
                <div className="border-l-2 border-inadvertent-yellow pl-4">
                  <h2 className="text-sm text-muted-foreground uppercase">Overtime</h2>
                  <p className="text-lg font-medium text-foreground">
                    ${person.overtime.toLocaleString()}
                  </p>
                </div>
              )}

              {person.premiums && person.premiums > 0 && (
                <div className="border-l-2 border-inadvertent-yellow pl-4">
                  <h2 className="text-sm text-muted-foreground uppercase">Premiums</h2>
                  <p className="text-lg font-medium text-foreground">
                    ${person.premiums.toLocaleString()}
                  </p>
                </div>
              )}

              {person.payout && person.payout > 0 && (
                <div className="border-l-2 border-inadvertent-yellow pl-4">
                  <h2 className="text-sm text-muted-foreground uppercase">Payout</h2>
                  <p className="text-lg font-medium text-foreground">
                    ${person.payout.toLocaleString()}
                  </p>
                </div>
              )}

              {person.health_dental_vision && person.health_dental_vision > 0 && (
                <div className="border-l-2 border-inadvertent-yellow pl-4">
                  <h2 className="text-sm text-muted-foreground uppercase">Health/Dental/Vision</h2>
                  <p className="text-lg font-medium text-foreground">
                    ${person.health_dental_vision.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileDetails;
