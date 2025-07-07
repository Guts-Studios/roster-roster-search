import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-inadvertent-yellow">Personnel Database</h1>
            <p className="text-lg text-foreground">Search and Browse Personnel Records</p>
          </div>
          
          <div className="bg-card p-8 rounded-lg shadow-md border border-border">
            <h2 className="text-2xl font-bold mb-4 text-inadvertent-yellow">What is this site?</h2>
            <p className="mb-6">
              This is a personnel database application that allows you to search and browse through personnel records. 
              The application provides an easy-to-use interface for finding specific individuals and viewing their 
              profile information.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-inadvertent-yellow">Features</h2>
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-inadvertent-yellow mr-2">•</span>
                <span>Search personnel by name, badge number, or other criteria</span>
              </li>
              <li className="flex items-start">
                <span className="text-inadvertent-yellow mr-2">•</span>
                <span>Browse through personnel profiles with photos and details</span>
              </li>
              <li className="flex items-start">
                <span className="text-inadvertent-yellow mr-2">•</span>
                <span>View statistical information about the personnel database</span>
              </li>
              <li className="flex items-start">
                <span className="text-inadvertent-yellow mr-2">•</span>
                <span>Filter and sort results based on various criteria</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 text-inadvertent-yellow">How to use</h2>
            <p className="mb-4">
              Use the search functionality to find specific personnel records. You can search by name, 
              badge number, or use the advanced filters to narrow down results. Click on any profile 
              to view detailed information.
            </p>
            
            <p className="mb-6">
              The statistics page provides an overview of the data in the database, including 
              breakdowns by various categories and metrics.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-inadvertent-yellow">Data Information</h2>
            <p className="mb-6">
              The information displayed in this database is sourced from available records. 
              Data accuracy is dependent on the source materials and may not reflect the most 
              current information. Please verify important details independently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
