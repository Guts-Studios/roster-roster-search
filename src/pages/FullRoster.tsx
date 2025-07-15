import React, { useState } from "react";
import RosterList from "../components/RosterList";
import Pagination from "../components/Pagination";
import { useAllPersonnel, AllPersonnelFilters } from "../hooks/useAllPersonnel";

const FullRoster = () => {
  const [filters, setFilters] = useState<AllPersonnelFilters>({
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    pageSize: 25,
  });

  const { data: personnelResponse, isLoading, error } = useAllPersonnel(filters);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">Full Roster</h1>
        </div>

        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${personnelResponse?.totalCount || 0} total records`}
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
      </div>
    </div>
  );
};

export default FullRoster;