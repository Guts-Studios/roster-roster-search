
import React, { useState } from "react";
import RosterList from "../components/RosterList";
import PersonnelFiltersComponent from "../components/PersonnelFilters";
import Pagination from "../components/Pagination";
import { useAdvancedPersonnel, usePersonnelFilterOptions, PersonnelFilters } from "../hooks/useAdvancedPersonnel";

const Index = () => {
  const [filters, setFilters] = useState<PersonnelFilters>({
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    pageSize: 25,
  });

  const { data: personnelResponse, isLoading, error } = useAdvancedPersonnel(filters);
  const { data: filterOptions } = usePersonnelFilterOptions();

  const handleFiltersChange = (newFilters: Partial<PersonnelFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      pageSize: 25,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need to be authenticated to view personnel records.
          </p>
          <p className="text-sm text-gray-500">
            Please contact your administrator to set up authentication.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-police-navy mb-2">Personnel Database</h1>
          <p className="text-gray-600">
            Search and filter personnel records with advanced sorting and pagination options
          </p>
        </div>

        <PersonnelFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          divisions={filterOptions?.divisions || []}
          classifications={filterOptions?.classifications || []}
        />

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Personnel Records
              {filters.searchTerm && ` - Results for "${filters.searchTerm}"`}
            </h2>
            <div className="text-sm text-gray-500">
              {isLoading ? "Loading..." : `${personnelResponse?.totalCount || 0} total records`}
            </div>
          </div>
          
          <RosterList 
            personnel={personnelResponse?.data || []} 
            isLoading={isLoading} 
          />
          
          {personnelResponse && (
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

export default Index;
