
import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-police-navy">About The Personnel Database</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-4">
              The Personnel Roster Database is a comprehensive system designed to manage and organize 
              information about law enforcement personnel. This system provides an efficient way to search, 
              view, and manage officer records and important departmental information.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 text-police-blue mt-6">Key Features</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Quick search functionality by name or badge number</li>
              <li>Detailed personnel profiles with complete information</li>
              <li>Department and division tracking</li>
              <li>Status monitoring of all personnel</li>
              <li>Secure access to sensitive information</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-3 text-police-blue mt-6">Our Mission</h2>
            <p className="mb-4">
              To provide law enforcement agencies with a reliable, efficient, and secure platform for 
              managing personnel information, enhancing departmental operations and supporting administrative functions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
