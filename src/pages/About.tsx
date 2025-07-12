import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X } from "lucide-react";
import { useAdvancedPersonnel, PersonnelFilters } from "../hooks/useAdvancedPersonnel";
import RosterList from "../components/RosterList";
import Pagination from "../components/Pagination";

const About = () => {
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<PersonnelFilters>({
    firstName: '',
    lastName: '',
    badgeNumber: '',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    pageSize: 25,
  });

  // Only fetch search data when there are search criteria
  const hasSearchCriteria = searchFilters.firstName || searchFilters.lastName || searchFilters.badgeNumber;
  const { data: searchResponse, isLoading: searchLoading, error: searchError } = useAdvancedPersonnel(searchFilters);

  // Auto-search with debounce as user types
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        // Check if it's a number (badge number) or text (name)
        const isNumber = /^\d+$/.test(searchQuery.trim());
        
        if (isNumber) {
          setSearchFilters(prev => ({
            ...prev,
            firstName: '',
            lastName: '',
            badgeNumber: searchQuery.trim(),
            page: 1
          }));
        } else {
          // For names, search in both first and last name
          setSearchFilters(prev => ({
            ...prev,
            firstName: searchQuery.trim(),
            lastName: searchQuery.trim(),
            badgeNumber: '',
            page: 1
          }));
        }
      } else {
        // Clear results when search query is empty
        setSearchFilters({
          firstName: '',
          lastName: '',
          badgeNumber: '',
          sortBy: 'name',
          sortOrder: 'asc',
          page: 1,
          pageSize: 25,
        });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Check if it's a number (badge number) or text (name)
      const isNumber = /^\d+$/.test(searchQuery.trim());
      
      if (isNumber) {
        setSearchFilters(prev => ({
          ...prev,
          firstName: '',
          lastName: '',
          badgeNumber: searchQuery.trim(),
          page: 1
        }));
      } else {
        // For names, search in both first and last name
        setSearchFilters(prev => ({
          ...prev,
          firstName: searchQuery.trim(),
          lastName: searchQuery.trim(),
          badgeNumber: '',
          page: 1
        }));
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchFilters({
      firstName: '',
      lastName: '',
      badgeNumber: '',
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      pageSize: 25,
    });
  };

  const handlePageChange = (page: number) => {
    setSearchFilters(prev => ({ ...prev, page }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <>
                <Input
                  type="text"
                  placeholder="Name or Badge"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-10 text-lg py-3 sm:hidden"
                />
                <Input
                  type="text"
                  placeholder="Last or First Name or Badge"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-10 text-lg py-3 hidden sm:block"
                />
              </>
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="bg-inadvertent-yellow hover:bg-inadvertent-yellow-hover px-6 py-3"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Results or About Content */}
        {hasSearchCriteria ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Search Results</h1>
              <p className="text-muted-foreground">Personnel search from the About page</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Search Results
              </h2>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {searchLoading ? "Searching..." : `${searchResponse?.totalCount || 0} records found`}
              </div>
            </div>
            
            {searchError ? (
              <div className="text-center py-8">
                <div className="text-red-600">Error searching personnel</div>
              </div>
            ) : (
              <>
                <RosterList
                  personnel={searchResponse?.data || []}
                  isLoading={searchLoading}
                />
                
                {searchResponse && searchResponse.totalCount > 0 && (
                  <Pagination
                    currentPage={searchResponse.currentPage}
                    totalPages={searchResponse.totalPages}
                    totalCount={searchResponse.totalCount}
                    pageSize={searchFilters.pageSize}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 text-inadvertent-yellow">No Secret Police</h1>
              <p className="text-lg text-foreground">A public records database by Inadvertent</p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-md border border-border">
              <h2 className="text-2xl font-bold mb-4 text-inadvertent-yellow">About</h2>
              <p className="mb-6">
                No Secret Police is a public records database created by Inadvertent.
              </p>
              
              <p className="mb-6">
                This database was created to bring transparency to police agencies in California. It is a tool for the public to learn about their local police department without depending on the police for information. Records displayed are public records and have been sourced through public records requests or lawsuits enforcing public records requests.
              </p>
              
              <p className="mb-6">
                The database currently hosts one agency's records and gives the public access to be able to learn about the department. If you have records to contribute to this database or if you want to learn how to source this type of data from your local police agency, please reach out to us.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-inadvertent-yellow">Why does this database include only the Santa Ana Police Department?</h2>
              <p className="mb-6">
                Consider this database an evergreen project, meaning that it will be updated as more records become available. The Santa Ana Police Department's (SAPD) records are displayed because SAPD was the first California department to release its officer headshot photographs.
              </p>
              
              <p className="mb-6">
                Journalists and members of the public are welcome to contribute these same types of records to this database.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-inadvertent-yellow">How did we get here?</h2>
              <p className="mb-6">
                This database is the culmination of years of work by Ben Camacho, the award-winning journalist behind Inadvertent. On May 5, 2021, off-duty SAPD Major Enforcement Team (MET) Detective John Rodriguez was involved in a fight in Downtown Santa Ana. The city of Santa Ana refused to identify the officer, which resulted in Camacho requesting the SAPD's headshot photographs and roster so that he could identify the officer. Initially, the Santa Ana Police Officers Association (SAPOA) tried to stop the release of these public records using the court. They failed to do this because photographs and basic data about public employees are a public record and cannot be censored. The SAPOA's failure in court and reporting that emerged from the investigation into this officer showed the value in knowing how to navigate the California Public Records Act and knowing who works at a local police agency.
              </p>
              
              <p className="mb-6">
                A few months after SAPD released the records, Camacho requested the same kind of records from the Los Angeles Police Department (LAPD) after observing a pattern of misconduct such as police refusing to identify, shining flashlights into cameras, and hiding badge numbers. The LAPD released its roster but refused to release the photographs, essentially stating that releasing those photographs would be too big of a task. The journalist took the city of Los Angeles to court to enforce the request and the city agreed, via settlement, to release the photos. Camacho later shared the photographs with the Stop LAPD Spying Coalition, who published them in a database. After pressure from the Los Angeles Police Protective League, the city of LA sued Camacho and the Stop LAPD Spying Coalition in an unconstitutional attempt to censor public records. The case ended with the city paying Camacho and the coalition $300,000 in attorney's fees. A second lawsuit was filed by the city of LA to attempt to hold Camacho and coalition financially responsible for any perceived-damages stemming from the release of the records; this case was also struck down by a judge who cited First Amendment rights. The city again paid over $100,000 in fees to Camacho and the coalition.
              </p>
              
              <p className="mb-6">
                Follow <a href="#" className="text-inadvertent-yellow hover:text-inadvertent-yellow-hover underline">this link</a> for a more comprehensive summary of the LAPD headshots saga. You can also read reports about the issue on this page.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-inadvertent-yellow">Is this up to date?</h2>
              <p className="mb-6">
                Data for the SAPD is current as of 2024. It is only as current as the last time the city of Santa Ana released the data. The database is entirely based on the city's data so if you see that something is wrong, it is because updated data has not been released by the city.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-inadvertent-yellow">How can I support this project?</h2>
              <p className="mb-6">
                Maintaining this database is laborious. You can become a paid subscriber to <a href="#" className="text-inadvertent-yellow hover:text-inadvertent-yellow-hover underline">Inadvertent</a> to ensure that the database stays in working condition and continues to be updated. You can also reach out to Inadvertent if you would like to make a one-time donation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
