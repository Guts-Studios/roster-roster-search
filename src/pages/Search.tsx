import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X } from "lucide-react";
import RosterList from "../components/RosterList";
import Pagination from "../components/Pagination";
import { useAdvancedPersonnel, PersonnelFilters } from "../hooks/useAdvancedPersonnel";
import { useResponsivePlaceholder } from "../hooks/useResponsivePlaceholder";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { getPlaceholder } = useResponsivePlaceholder();
  
  const [filters, setFilters] = useState<PersonnelFilters>({
    firstName: '',
    lastName: '',
    badgeNumber: '',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    pageSize: 25,
  });

  // Only fetch data when there are search criteria
  const hasSearchCriteria = filters.firstName || filters.lastName || filters.badgeNumber;
  const { data: personnelResponse, isLoading, error } = useAdvancedPersonnel(filters);

  // Auto-search with debounce as user types
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        // Check if it's a number (badge number) or text (name)
        const isNumber = /^\d+$/.test(searchQuery.trim());
        
        if (isNumber) {
          setFilters(prev => ({
            ...prev,
            firstName: '',
            lastName: '',
            badgeNumber: searchQuery.trim(),
            page: 1
          }));
        } else {
          // Parse name input to handle both single names and full names
          const nameParts = searchQuery.trim().split(/\s+/);
          
          if (nameParts.length === 1) {
            // Single name: search both first and last name fields
            const singleName = nameParts[0];
            setFilters(prev => ({
              ...prev,
              firstName: singleName,
              lastName: singleName,
              badgeNumber: '',
              page: 1
            }));
          } else {
            // Multiple names: treat as first name + last name
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');
            setFilters(prev => ({
              ...prev,
              firstName: firstName,
              lastName: lastName,
              badgeNumber: '',
              page: 1
            }));
          }
        }
      } else {
        // Clear results when search query is empty
        setFilters({
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
        setFilters(prev => ({
          ...prev,
          firstName: '',
          lastName: '',
          badgeNumber: searchQuery.trim(),
          page: 1
        }));
      } else {
        // Parse name input to handle both single names and full names
        const nameParts = searchQuery.trim().split(/\s+/);
        
        if (nameParts.length === 1) {
          // Single name: search both first and last name fields
          const singleName = nameParts[0];
          setFilters(prev => ({
            ...prev,
            firstName: singleName,
            lastName: singleName,
            badgeNumber: '',
            page: 1
          }));
        } else {
          // Multiple names: treat as first name + last name
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');
          setFilters(prev => ({
            ...prev,
            firstName: firstName,
            lastName: lastName,
            badgeNumber: '',
            page: 1
          }));
        }
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilters({
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
    setFilters(prev => ({ ...prev, page }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle API errors
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Data</h1>
          <p className="text-muted-foreground mb-6">
            There was an error loading the public records.
          </p>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  // Main search interface
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">No Secret Police</h1>
          <p className="text-lg text-muted-foreground">A public records database</p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                inputMode="search"
                placeholder={getPlaceholder("First name, last name, or badge number", "First or Last Name or Badge #")}
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

        {hasSearchCriteria && (
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Search Results
              </h2>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {isLoading ? "Searching..." : `${personnelResponse?.totalCount || 0} records found`}
              </div>
            </div>
            
            <RosterList
              personnel={personnelResponse?.data || []}
              isLoading={isLoading}
            />
            
            {personnelResponse && personnelResponse.totalCount > 0 && (
              <Pagination
                currentPage={personnelResponse.currentPage}
                totalPages={personnelResponse.totalPages}
                totalCount={personnelResponse.totalCount}
                pageSize={filters.pageSize}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}

        {!hasSearchCriteria && (
          <div className="mt-8 text-center">
            <p className="text-lg text-muted-foreground">
              View full roster{" "}
              <Link
                to="/roster"
                className="text-inadvertent-yellow hover:text-inadvertent-yellow-hover underline font-medium"
              >
                here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;