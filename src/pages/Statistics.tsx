import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, BarChart3 } from "lucide-react";
import { useTopSalaries, usePersonnelAggregates, StatsFilters } from "../hooks/usePersonnelStats";
import { getFullName, getTotalCompensation } from "../types";

// Hoisted: constructing Intl.NumberFormat is ~10-50x slower than .format()
const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const fmtUsd = (n: number) => USD_FORMATTER.format(n);

const SORT_LABELS: Record<string, string> = {
  total_compensation: 'Total Compensation',
  regular_pay: 'Regular Pay',
  overtime: 'Overtime',
  premiums: 'Premiums',
};

const Statistics = () => {
  const [filters, setFilters] = useState<StatsFilters>({
    limit: 25,
    sortBy: 'total_compensation',
  });

  const { data: topSalaries, isLoading: loadingTop } = useTopSalaries(filters);
  const { data: aggregates } = usePersonnelAggregates();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Data</h1>
          <p className="text-muted-foreground">
            Top earners and aggregate compensation data for SAPD personnel.
          </p>
        </div>

        {/* Summary cards */}
        {aggregates && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-3xl mx-auto">
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
                      {fmtUsd(aggregates.totalCompensation)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-inadvertent-yellow" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter controls */}
        <Card className="mb-6 bg-card border-border max-w-3xl mx-auto">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-foreground text-lg">
              <BarChart3 className="h-5 w-5" />
              Ranking Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sortBy" className="text-foreground">Rank by</Label>
                <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
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
                <Label htmlFor="limit" className="text-foreground">Show top</Label>
                <Input
                  id="limit"
                  type="number"
                  min={1}
                  max={500}
                  value={filters.limit}
                  onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value) || 25 }))}
                  className="mt-1 bg-input border-border text-foreground"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ranked list */}
        <Card className="bg-card border-border max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-foreground">
              Top {filters.limit} by {SORT_LABELS[filters.sortBy || 'total_compensation']}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTop ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-inadvertent-yellow"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {(topSalaries || [])
                  // Sort client-side by total compensation when that's the active sort,
                  // since the API sorts by regular_pay for that case.
                  .slice()
                  .sort((a, b) => {
                    if (filters.sortBy === 'total_compensation') {
                      return getTotalCompensation(b) - getTotalCompensation(a);
                    }
                    const key = filters.sortBy as keyof typeof a;
                    return Number(b[key] || 0) - Number(a[key] || 0);
                  })
                  .map((person, index) => {
                    const value = filters.sortBy === 'total_compensation'
                      ? getTotalCompensation(person)
                      : Number(person[filters.sortBy as keyof typeof person] || 0);
                    return (
                      <Link key={person.id} to={`/profile/${person.id}`}>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3 min-w-0">
                            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center border-border flex-shrink-0">
                              {index + 1}
                            </Badge>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{getFullName(person)}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {[person.classification, person.division].filter(Boolean).join(' • ')}
                              </p>
                              {person.badge_number && (
                                <p className="text-xs text-muted-foreground">Badge #{person.badge_number}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-3">
                            <p className="font-bold text-foreground">{fmtUsd(value)}</p>
                            <p className="text-xs text-muted-foreground">
                              {SORT_LABELS[filters.sortBy || 'total_compensation']}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
