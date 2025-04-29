
import React from "react";
import { useParams, Link } from "react-router-dom";
import { rosterData } from "../data/rosterData";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, DollarSign } from "lucide-react";

const ProfileDetails = () => {
  const { id } = useParams<{ id: string }>();
  const person = rosterData.find((p) => p.id === id);

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

  const initials = person.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Format salary with commas and dollar sign
  const formattedSalary = person.salary 
    ? `$${person.salary.toLocaleString()}`
    : "Not available";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-police-blue hover:text-police-navy mb-6">
          <Button variant="outline" className="border-police-blue text-police-blue hover:bg-police-blue/10">
            <ArrowLeft size={16} className="mr-2" /> Back to Roster
          </Button>
        </Link>
        
        <Card className="w-full max-w-3xl mx-auto border-police-blue/20">
          <CardHeader className="bg-gradient-to-r from-police-blue/10 to-police-blue/5 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-police-gold bg-police-blue text-white">
                {person.imageUrl && <AvatarImage src={person.imageUrl} alt={person.name} />}
                <AvatarFallback className="text-2xl bg-police-blue">{initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col items-center sm:items-start">
                <h1 className="text-3xl font-bold text-police-navy text-center sm:text-left">{person.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 justify-center sm:justify-start">
                  <Badge variant="outline" className="text-sm border-police-gold bg-police-badge/10 px-3 py-1">
                    {person.badgeNumber}
                  </Badge>
                  {person.rank && (
                    <span className="text-sm flex items-center gap-1 bg-police-blue/10 px-3 py-1 rounded-full">
                      <Shield size={14} className="text-police-blue" />
                      {person.rank}
                    </span>
                  )}
                  {person.status && (
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      person.status === "Active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-police-red/10 text-police-red"
                    }`}>
                      {person.status}
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
              
              {person.department && (
                <div className="border-l-2 border-police-blue pl-4">
                  <h2 className="text-sm text-gray-500 uppercase">Department</h2>
                  <p className="text-lg font-medium text-police-navy">{person.department}</p>
                </div>
              )}
              
              <div className="border-l-2 border-police-blue pl-4">
                <h2 className="text-sm text-gray-500 uppercase">Salary</h2>
                <p className="text-lg font-medium text-police-blue flex items-center gap-1">
                  <DollarSign size={16} className="inline" />
                  {formattedSalary}
                </p>
              </div>
              
              {person.hireDate && (
                <div className="border-l-2 border-police-blue pl-4">
                  <h2 className="text-sm text-gray-500 uppercase">Hire Date</h2>
                  <p className="text-lg font-medium text-police-navy">
                    {new Date(person.hireDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
              
              {person.email && (
                <div className="border-l-2 border-police-blue pl-4 col-span-1 md:col-span-2">
                  <h2 className="text-sm text-gray-500 uppercase">Email</h2>
                  <a href={`mailto:${person.email}`} className="text-lg font-medium text-police-lightBlue hover:underline">
                    {person.email}
                  </a>
                </div>
              )}
              
              {person.phone && (
                <div className="border-l-2 border-police-blue pl-4">
                  <h2 className="text-sm text-gray-500 uppercase">Phone</h2>
                  <p className="text-lg font-medium text-police-navy">{person.phone}</p>
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
