import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RosterList from "../components/RosterList";
import PersonnelFiltersComponent from "../components/PersonnelFilters";
import Pagination from "../components/Pagination";
import { useAdvancedPersonnel, usePersonnelFilterOptions, PersonnelFilters } from "../hooks/useAdvancedPersonnel";
import { verifyPassword } from "../utils/auth";

const Search = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [filters, setFilters] = useState<PersonnelFilters>({
    firstName: '',
    lastName: '',
    badgeNumber: '',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    pageSize: 25,
  });

  const { data: personnelResponse, isLoading, error } = useAdvancedPersonnel(
    isAuthenticated ? filters : { ...filters, firstName: '', lastName: '', badgeNumber: '' }
  );
  const { data: filterOptions } = usePersonnelFilterOptions();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError("");

    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError("Invalid password. Please try again.");
      }
    } catch (error) {
      setAuthError("Authentication error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFiltersChange = (newFilters: Partial<PersonnelFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
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

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-foreground">
              <Lock className="h-6 w-6 text-inadvertent-yellow" />
              Secure Access Required
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter the password to access the personnel database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 bg-input border-border text-foreground"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {authError && (
                <p className="text-sm text-destructive">{authError}</p>
              )}
              <Button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-inadvertent-yellow hover:bg-inadvertent-yellow-hover disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Access Database"}
              </Button>
            </form>
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">
                Password is securely hashed and verified.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle API errors
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You need to be authenticated to view personnel records.
          </p>
          <p className="text-sm text-muted-foreground">
            Please contact your administrator to set up authentication.
          </p>
        </div>
      </div>
    );
  }

  // Main search interface
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Personnel Search</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Search and filter personnel records with advanced sorting and pagination options
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsAuthenticated(false)}
              className="border-border text-foreground hover:bg-muted flex-shrink-0 self-start sm:self-center"
              size="sm"
            >
              <Lock className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>

        <PersonnelFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          divisions={filterOptions?.divisions || []}
        />

        <div className="mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Personnel Records
              {(filters.firstName || filters.lastName || filters.badgeNumber) &&
                ` - Filtered Results`}
            </h2>
            <div className="text-xs sm:text-sm text-muted-foreground">
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

export default Search;