
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-police-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be authenticated to view personnel records.</p>
          <Link to="/">
            <Button className="bg-police-blue text-white">
              <ArrowLeft size={16} /> Return to Roster
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-police-navy mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">The requested profile could not be found.</p>
          <Link to="/">
            <Button className="bg-police-blue text-white">
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
  
  // Format compensation with commas and dollar sign
  const formattedCompensation = totalCompensation > 0 
    ? `$${totalCompensation.toLocaleString()}`
    : "Not available";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-police-blue hover:text-police-navy mb-6">
          <Button variant="outline" className="border-police-blue text-police-blue hover:bg-police-blue/10">
            <ArrowLeft size={16} className="mr-2" /> Back to Roster
          </Button>
        </Link>
        
        <Card className="w-full max-w-4xl mx-auto border-police-blue/20">
          <CardHeader className="bg-gradient-to-r from-police-blue/10 to-police-blue/5 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
               <Avatar className="h-24 w-24 border-4 border-police-gold bg-police-blue text-white">
                {photoUrl && <AvatarImage src={photoUrl} alt={fullName} />}
                <AvatarFallback className="text-2xl bg-police-blue">{initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col items-center sm:items-start">
                <h1 className="text-3xl font-bold text-police-navy text-center sm:text-left">{fullName}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 justify-center sm:justify-start">
                  {person.badge_number && <Badge variant="outline" className="text-sm border-police-gold bg-police-badge/10 px-3 py-1">
                    {person.badge_number}
                  </Badge>}
                  {person.classification && (
                    <span className="text-sm flex items-center gap-1 bg-police-blue/10 px-3 py-1 rounded-full">
                      <Shield size={14} className="text-police-blue" />
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
                <div className="border-l-2 border-police-blue pl-4">
                  <h2 className="text-sm text-gray-500 uppercase">Division</h2>
                  <p className="text-lg font-medium text-police-navy">{person.division}</p>
                </div>
              )}
              
              <div className="border-l-2 border-police-blue pl-4">
                <h2 className="text-sm text-gray-500 uppercase">Total Compensation</h2>
                <p className="text-lg font-medium text-police-blue flex items-center gap-1">
                  <DollarSign size={16} className="inline" />
                  {formattedCompensation}
                </p>
              </div>
              
              {person.regular_pay && (
                <div className="border-l-2 border-police-blue pl-4">
                  <h2 className="text-sm text-gray-500 uppercase">Regular Pay</h2>
                  <p className="text-lg font-medium text-police-navy">
                    ${person.regular_pay.toLocaleString()}
                  </p>
                </div>
              )}

              {person.overtime && person.overtime > 0 && (
                <div className="border-l-2 border-police-blue pl-4">
                  <h2 className="text-sm text-gray-500 uppercase">Overtime</h2>
                  <p className="text-lg font-medium text-police-navy">
                    ${person.overtime.toLocaleString()}
                  </p>
                </div>
              )}

              {person.premiums && person.premiums > 0 && (
                <div className="border-l-2 border-police-blue pl-4">
                  <h2 className="text-sm text-gray-500 uppercase">Premiums</h2>
                  <p className="text-lg font-medium text-police-navy">
                    ${person.premiums.toLocaleString()}
                  </p>
                </div>
              )}

              {person.payout && person.payout > 0 && (
                <div className="border-l-2 border-police-blue pl-4">
                  <h2 className="text-sm text-gray-500 uppercase">Payout</h2>
                  <p className="text-lg font-medium text-police-navy">
                    ${person.payout.toLocaleString()}
                  </p>
                </div>
              )}

              {person.health_dental_vision && person.health_dental_vision > 0 && (
                <div className="border-l-2 border-police-blue pl-4">
                  <h2 className="text-sm text-gray-500 uppercase">Health/Dental/Vision</h2>
                  <p className="text-lg font-medium text-police-navy">
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
