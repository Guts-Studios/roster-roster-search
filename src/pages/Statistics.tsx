import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const updateFilter = (key: keyof StatsFilters, value: any) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-police-navy mb-2">Personnel Statistics</h1>
              <p className="text-gray-600">Comprehensive analytics and insights into personnel compensation data</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleCheckData} variant="outline" size="sm">
                Check Data Count
              </Button>
              <Button onClick={handleLoadSampleData} variant="outline" size="sm">
                Load Sample Data
              </Button>
              <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="limit">Top Results</Label>
                <Input
                  id="limit"
                  type="number"
                  min="1"
                  max="50"
                  value={filters.limit}
                  onChange={(e) => updateFilter('limit', parseInt(e.target.value) || 5)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="sortBy">Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total_compensation">Total Compensation</SelectItem>
                    <SelectItem value="regular_pay">Regular Pay</SelectItem>
                    <SelectItem value="overtime">Overtime</SelectItem>
                    <SelectItem value="premiums">Premiums</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="division">Division</Label>
                <Select value={filters.division || 'all'} onValueChange={(value) => updateFilter('division', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Divisions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Divisions</SelectItem>
                    {uniqueValues?.divisions.map((division) => (
                      <SelectItem key={division} value={division}>{division}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="classification">Classification</Label>
                <Select value={filters.classification || 'all'} onValueChange={(value) => updateFilter('classification', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Classifications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classifications</SelectItem>
                    {uniqueValues?.classifications.map((classification) => (
                      <SelectItem key={classification} value={classification}>{classification}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {aggregates && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Personnel</p>
                    <p className="text-2xl font-bold text-police-navy">{aggregates.totalPersonnel}</p>
                  </div>
                  <Users className="h-8 w-8 text-police-blue" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Compensation</p>
                    <p className="text-2xl font-bold text-police-navy">
                      ${aggregates.totalCompensation.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-police-blue" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Compensation</p>
                    <p className="text-2xl font-bold text-police-navy">
                      ${Math.round(aggregates.avgCompensation).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-police-blue" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Overtime</p>
                    <p className="text-2xl font-bold text-police-navy">
                      ${aggregates.totalOvertime.toLocaleString()}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-police-blue" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Salaries */}
          <Card>
            <CardHeader>
              <CardTitle>
                Top {filters.limit} by {filters.sortBy.replace('_', ' ').toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingTop ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-police-blue"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {topSalaries?.map((person, index) => (
                    <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-semibold text-police-navy">{getFullName(person)}</p>
                          <p className="text-sm text-gray-600">{person.classification} • {person.division}</p>
                          {person.badge_number && (
                            <p className="text-xs text-gray-500">Badge: {person.badge_number}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-police-blue">
                          ${getTotalCompensation(person).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Total Compensation</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Division Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Division Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAggs ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-police-blue"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {aggregates && Object.entries(aggregates.divisionBreakdown)
                    .sort(([,a], [,b]) => b.totalCompensation - a.totalCompensation)
                    .map(([division, stats]) => (
                      <div key={division} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-police-navy">{division}</p>
                          <p className="text-sm text-gray-600">{stats.count} personnel</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-police-blue">
                            ${stats.totalCompensation.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
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