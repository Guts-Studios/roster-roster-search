import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp, BarChart3, RefreshCw } from "lucide-react";
import { useTopSalaries, usePersonnelAggregates, useUniqueValues, StatsFilters } from "../hooks/usePersonnelStats";
import { getFullName, getTotalCompensation } from "../types";
import { useToast } from "@/hooks/use-toast";
import { loadSampleData, checkDataCount } from "@/utils/loadPersonnelData";

const Statistics = () => {
  const [filters, setFilters] = useState<StatsFilters>({
    limit: 5,
    sortBy: 'total_compensation'
  });
  const { toast } = useToast();

  const { data: topSalaries, isLoading: loadingTop, refetch: refetchTopSalaries } = useTopSalaries(filters);
  const { data: aggregates, isLoading: loadingAggs, refetch: refetchAggregates } = usePersonnelAggregates();
  const { data: uniqueValues, refetch: refetchUniqueValues } = useUniqueValues();

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

  const handleLoadSampleData = async () => {
    try {
      const result = await loadSampleData();
      if (result.success) {
        await handleRefresh();
        toast({
          title: "Sample Data Loaded",
          description: "Sample public records data has been loaded successfully.",
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
        description: `Current public records: ${result.count || 0}`,
      });
    } catch (error) {
      toast({
        title: "Check Failed",
        description: "Failed to check data count.",
        variant: "destructive",
      });
    }
  };

  // Main statistics interface
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
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
                          <p className="text-sm text-muted-foreground">{stats.count} records</p>
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