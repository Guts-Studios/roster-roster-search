import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTopSalaries, StatsFilters } from "../hooks/usePersonnelStats";
import { useRosterUrlState } from "../hooks/useUrlState";
import { getFullName, getTotalCompensation, Personnel } from "../types";

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const fmtUsd = (n: number) => USD_FORMATTER.format(n);

// Categories Ben requested. "Total" is computed client-side as the sum of all pay
// columns; the others map directly to Personnel fields.
type SortKey = 'total' | 'regular_pay' | 'overtime' | 'premiums' | 'other_pay' | 'payout';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'total', label: 'Total' },
  { value: 'regular_pay', label: 'Regular Pay' },
  { value: 'overtime', label: 'Overtime' },
  { value: 'premiums', label: 'Premiums' },
  { value: 'other_pay', label: 'Other Pay' },
  { value: 'payout', label: 'Payout' },
];

// Server-side sort key for the API request. The four columns the server can sort
// on map directly; new categories ("other_pay", "payout") use total_compensation
// as a wide fetch and then sort client-side.
const sortToServer: Record<SortKey, StatsFilters['sortBy']> = {
  total: 'total_compensation',
  regular_pay: 'regular_pay',
  overtime: 'overtime',
  premiums: 'premiums',
  other_pay: 'total_compensation',
  payout: 'total_compensation',
};

const valueFor = (person: Personnel, key: SortKey): number => {
  if (key === 'total') return getTotalCompensation(person);
  return Number(person[key as keyof Personnel] || 0);
};

const PAGE_SIZE = 10;

const Statistics = () => {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('total');

  // Fetch the entire current-active roster (500 is well above the ~360 active records
  // currently in the DB) so pagination has the full dataset to walk through.
  const { data: topSalaries, isLoading } = useTopSalaries({
    limit: 500,
    sortBy: sortToServer[sortKey],
  });
  const { setRosterState } = useRosterUrlState();

  // Mark our origin so back-from-profile lands here, not on /roster.
  React.useEffect(() => {
    setRosterState({ source: 'statistics' });
  }, [setRosterState]);

  const sortedTop = useMemo(() => {
    if (!topSalaries) return [];
    return [...topSalaries].sort((a, b) => valueFor(b, sortKey) - valueFor(a, sortKey));
  }, [topSalaries, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedTop.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageRows = sortedTop.slice(pageStart, pageStart + PAGE_SIZE);

  const onSortChange = (next: SortKey) => {
    setSortKey(next);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Data Analysis</h1>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="mb-4 max-w-md">
              <Label htmlFor="sortBy" className="text-foreground">
                Sort officers by compensation amounts
              </Label>
              <Select value={sortKey} onValueChange={(v) => onSortChange(v as SortKey)}>
                <SelectTrigger className="mt-1 bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-inadvertent-yellow"></div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {pageRows.map((person, index) => {
                    const value = valueFor(person, sortKey);
                    return (
                      <Link
                        key={person.id}
                        to={`/profile/${person.id}?returnTo=/statistics`}
                      >
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3 min-w-0">
                            <Badge
                              variant="outline"
                              className="w-8 h-8 rounded-full flex items-center justify-center border-border flex-shrink-0"
                            >
                              {pageStart + index + 1}
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
                              {SORT_OPTIONS.find((o) => o.value === sortKey)?.label}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded border border-border text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
                    >
                      Previous
                    </button>
                    <div className="text-muted-foreground">
                      Page {page} of {totalPages} · Ranks {pageStart + 1}–
                      {Math.min(pageStart + PAGE_SIZE, sortedTop.length)} of {sortedTop.length}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded border border-border text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
