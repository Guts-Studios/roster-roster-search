import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp, BarChart3, RefreshCw } from "lucide-react";
import { useTopSalaries, usePersonnelAggregates, useUniqueValues, StatsFilters } from "../hooks/usePersonnelStats";
import { getFullName, getTotalCompensation } from "../types";
import { useToast } from "@/hooks/use-toast";
import { loadSampleData, checkDataCount } from "@/utils/loadPersonnelData";
import { verifyPassword } from "../utils/auth";

const Statistics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [filters, setFilters] = useState<StatsFilters>({
    limit: 5,
    sortBy: 'total_compensation'
  });
  const { toast } = useToast();

  const { data: topSalaries, isLoading: loadingTop, refetch: refetchTopSalaries } = useTopSalaries(
    isAuthenticated ? filters : { ...filters, limit: 0 }
  );
  const { data: aggregates, isLoading: loadingAggs, refetch: refetchAggregates } = usePersonnelAggregates();
  const { data: uniqueValues, refetch: refetchUniqueValues } = useUniqueValues();

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
        description: "Personnel statistics have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoadSampleData = async () => {
    try {
      const result = await loadSampleData();
      if (result.success) {
        await handleRefresh();
        toast({
          title: "Sample Data Loaded",
          description: "Sample personnel data has been loaded successfully.",
        });
      } else {
        throw result.error;
      }
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load sample data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckData = async () => {
    try {
      const result = await checkDataCount();
      toast({
        title: "Data Count Check",
        description: `Current personnel records: ${result.count || 0}`,
      });
    } catch (error) {
      toast({
        title: "Check Failed",
        description: "Failed to check data count.",
        variant: "destructive",
      });
    }
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
              Enter the password to access personnel statistics
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
                {isVerifying ? "Verifying..." : "Access Statistics"}
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

  // Main statistics interface
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Personnel Statistics</h1>
              <p className="text-muted-foreground">Comprehensive analytics and insights into personnel compensation data</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleCheckData} variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                Check Data Count
              </Button>
              <Button onClick={handleLoadSampleData} variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                Load Sample Data
              </Button>
              <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2 border-border text-foreground hover:bg-muted">
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAuthenticated(false)}
                className="border-border text-foreground hover:bg-muted"
              >
                <Lock className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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

              <div>
                <Label htmlFor="division" className="text-foreground">Division</Label>
                <Select value={filters.division || 'all'} onValueChange={(value) => updateFilter('division', value)}>
                  <SelectTrigger className="mt-1 bg-input border-border text-foreground">
                    <SelectValue placeholder="All Divisions" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Divisions</SelectItem>
                    {uniqueValues?.divisions.map((division) => (
                      <SelectItem key={division} value={division}>{division}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="classification" className="text-foreground">Classification</Label>
                <Select value={filters.classification || 'all'} onValueChange={(value) => updateFilter('classification', value)}>
                  <SelectTrigger className="mt-1 bg-input border-border text-foreground">
                    <SelectValue placeholder="All Classifications" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Classifications</SelectItem>
                    {uniqueValues?.classifications.map((classification) => (
                      <SelectItem key={classification} value={classification}>{classification}</SelectItem>
                    ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Personnel</p>
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

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Compensation</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${Math.round(aggregates.avgCompensation).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-inadvertent-yellow" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Overtime</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${aggregates.totalOvertime.toLocaleString()}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-inadvertent-yellow" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <div key={person.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Division Breakdown */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Division Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAggs ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-inadvertent-yellow"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {aggregates && Object.entries(aggregates.divisionBreakdown)
                    .sort(([,a], [,b]) => b.totalCompensation - a.totalCompensation)
                    .map(([division, stats]) => (
                      <div key={division} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-semibold text-foreground">{division}</p>
                          <p className="text-sm text-muted-foreground">{stats.count} personnel</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-inadvertent-yellow">
                            ${stats.totalCompensation.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Avg: ${Math.round(stats.totalCompensation / stats.count).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statistics;