import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp, BarChart3, RefreshCw, Search as SearchIcon, X } from "lucide-react";
import { useTopSalaries, usePersonnelAggregates, useUniqueValues, StatsFilters } from "../hooks/usePersonnelStats";
import { useAdvancedPersonnel, PersonnelFilters } from "../hooks/useAdvancedPersonnel";
import { getFullName, getTotalCompensation } from "../types";
import { useToast } from "@/hooks/use-toast";
// Removed loadSampleData, checkDataCount imports - functions disabled for frontend/backend separation
import RosterList from "../components/RosterList";
import Pagination from "../components/Pagination";

const Statistics = () => {
  const [filters, setFilters] = useState<StatsFilters>({
    limit: 5,
    sortBy: 'total_compensation'
  });
  const { toast } = useToast();

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<PersonnelFilters>({
    firstName: '',
    lastName: '',
    badgeNumber: '',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    pageSize: 24,
  });

  // Only fetch search data when there are search criteria
  const hasSearchCriteria = searchFilters.firstName || searchFilters.lastName || searchFilters.badgeNumber;
  const { data: searchResponse, isLoading: searchLoading, error: searchError } = useAdvancedPersonnel(searchFilters);

  const { data: topSalaries, isLoading: loadingTop, refetch: refetchTopSalaries } = useTopSalaries(filters);
  const { data: aggregates, isLoading: loadingAggs, refetch: refetchAggregates } = usePersonnelAggregates();
  const { data: uniqueValues, refetch: refetchUniqueValues } = useUniqueValues();

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
          pageSize: 24,
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
      pageSize: 24,
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

  const updateFilter = (key: keyof StatsFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      limit: 5,
      sortBy: 'total_compensation'
    });
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchTopSalaries(),
        refetchAggregates(),
        refetchUniqueValues()
      ]);
      toast({
        title: "Data Refreshed",
        description: "Public records statistics have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // These functions are disabled for frontend/backend separation
  const handleLoadSampleData = async () => {
    toast({
      title: "Function Disabled",
      description: "Sample data loading is disabled. Use backend scripts for data operations.",
      variant: "destructive",
    });
  };

  const handleCheckData = async () => {
    toast({
      title: "Function Disabled",
      description: "Data count checking is disabled. Use backend scripts for data operations.",
      variant: "destructive",
    });
  };

  // Main statistics interface
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-foreground">
            No Secret Police
          </h1>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search name or badge #"
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

        {/* Search Results or Statistics Content */}
        {hasSearchCriteria ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Search Results</h1>
              <p className="text-muted-foreground">Personnel search from the Statistics page</p>
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
          <div>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">Public Records Statistics</h1>
              <p className="text-muted-foreground">Comprehensive analytics and insights into public records compensation data</p>
            </div>

        {/* Filters */}
        <Card className="mb-6 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="h-5 w-5" />
              Analytics Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="limit" className="text-foreground">Top Results</Label>
                <Input
                  id="limit"
                  type="number"
                  min="1"
                  max="50"
                  value={filters.limit}
                  onChange={(e) => updateFilter('limit', parseInt(e.target.value) || 5)}
                  className="mt-1 bg-input border-border text-foreground"
                />
              </div>
              
              <div>
                <Label htmlFor="sortBy" className="text-foreground">Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger className="mt-1 bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="total_compensation">Total Compensation</SelectItem>
                    <SelectItem value="regular_pay">Regular Pay</SelectItem>
                    <SelectItem value="overtime">Overtime</SelectItem>
                    <SelectItem value="premiums">Premiums</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <div className="flex items-end">
                <Button onClick={clearFilters} variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {aggregates && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Records</p>
                    <p className="text-2xl font-bold text-foreground">{aggregates.totalPersonnel}</p>
                  </div>
                  <Users className="h-8 w-8 text-inadvertent-yellow" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Compensation</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${aggregates.totalCompensation.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-inadvertent-yellow" />
                </div>
              </CardContent>
            </Card>


          </div>
        )}

        <div className="mb-6">
          {/* Top Salaries */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Top {filters.limit} by {filters.sortBy.replace('_', ' ').toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingTop ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-inadvertent-yellow"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {topSalaries?.map((person, index) => (
                    <Link key={person.id} to={`/profile/${person.id}`}>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center border-border">
                            {index + 1}
                          </Badge>
                          <div>
                            <p className="font-semibold text-foreground">{getFullName(person)}</p>
                            <p className="text-sm text-muted-foreground">{person.classification} • {person.division}</p>
                            {person.badge_number && (
                              <p className="text-xs text-muted-foreground">Badge: {person.badge_number}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-inadvertent-yellow">
                            ${getTotalCompensation(person).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Total Compensation</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;