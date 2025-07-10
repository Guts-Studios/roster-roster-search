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
              <Input
                type="text"
                placeholder="Search personnel by name or badge number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10 text-lg py-3"
              />
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
              <h1 className="text-4xl font-bold mb-2 text-inadvertent-yellow">Public Records Database</h1>
              <p className="text-lg text-foreground">Search and Browse Public Records</p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-md border border-border">
            <h2 className="text-2xl font-bold mb-4 text-inadvertent-yellow">What is this site?</h2>
            <p className="mb-6">
              This is a public records database application that allows you to search and browse through public records.
              The application provides an easy-to-use interface for finding specific individuals and viewing their
              profile information.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-inadvertent-yellow">Features</h2>
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-inadvertent-yellow mr-2">•</span>
                <span>Search public records by name, badge number, or other criteria</span>
              </li>
              <li className="flex items-start">
                <span className="text-inadvertent-yellow mr-2">•</span>
                <span>Browse through public profiles with photos and details</span>
              </li>
              <li className="flex items-start">
                <span className="text-inadvertent-yellow mr-2">•</span>
                <span>View statistical information about the public records database</span>
              </li>
              <li className="flex items-start">
                <span className="text-inadvertent-yellow mr-2">•</span>
                <span>Filter and sort results based on various criteria</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 text-inadvertent-yellow">How to use</h2>
            <p className="mb-4">
              Use the search functionality to find specific public records. You can search by name,
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
        )}
      </div>
    </div>
  );
};

export default About;
