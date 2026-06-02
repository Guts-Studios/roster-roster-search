import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, BarChart3, TrendingUp, TrendingDown, Building2, ShieldCheck, Activity } from "lucide-react";
import {
  useTopSalaries,
  usePersonnelAggregates,
  useYoYChanges,
  useBreakdowns,
  StatsFilters,
  YoYChange,
  BreakdownRow,
} from "../hooks/usePersonnelStats";
import { getFullName, getTotalCompensation, Personnel } from "../types";

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const fmtUsd = (n: number) => USD_FORMATTER.format(n);
const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;

const SORT_LABELS: Record<string, string> = {
  total_compensation: 'Total Compensation',
  regular_pay: 'Regular Pay',
  overtime: 'Overtime',
  premiums: 'Premiums',
};

const HISTOGRAM_BUCKETS = [
  { min: 0, max: 50000, label: 'Under $50k' },
  { min: 50000, max: 100000, label: '$50k–$100k' },
  { min: 100000, max: 150000, label: '$100k–$150k' },
  { min: 150000, max: 200000, label: '$150k–$200k' },
  { min: 200000, max: 250000, label: '$200k–$250k' },
  { min: 250000, max: 300000, label: '$250k–$300k' },
  { min: 300000, max: Infinity, label: '$300k+' },
];

const PAGE_SIZE = 10;

const Statistics = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<StatsFilters>({
    // Fetch a larger window so paging stays client-side and snappy.
    limit: 100,
    sortBy: 'total_compensation',
  });

  const { data: topSalaries, isLoading: loadingTop } = useTopSalaries(filters);
  const { data: overtimeLeaders, isLoading: loadingOT } = useTopSalaries({ limit: 10, sortBy: 'overtime' });
  const { data: aggregates } = usePersonnelAggregates();
  const { data: yoyTop, isLoading: loadingYoyTop } = useYoYChanges(10, 'desc');
  const { data: yoyBottom, isLoading: loadingYoyBottom } = useYoYChanges(10, 'asc');
  const { data: breakdowns, isLoading: loadingBreakdowns } = useBreakdowns();
  const { data: allCurrent } = useTopSalaries({ limit: 500, sortBy: 'total_compensation' });

  // Compute histogram client-side from all current personnel.
  const histogram = useMemo(() => {
    if (!allCurrent) return null;
    const counts = HISTOGRAM_BUCKETS.map(b => ({ ...b, count: 0 }));
    for (const p of allCurrent) {
      const t = getTotalCompensation(p);
      if (t <= 0) continue;
      const i = counts.findIndex(b => t >= b.min && t < b.max);
      if (i >= 0) counts[i].count++;
    }
    const max = Math.max(1, ...counts.map(c => c.count));
    return { counts, max };
  }, [allCurrent]);

  // For total-compensation sort, the server falls back to regular_pay ordering,
  // so re-sort client-side using the canonical total.
  const sortedTop = useMemo(() => {
    if (!topSalaries) return [];
    return [...topSalaries].sort((a, b) => {
      if (filters.sortBy === 'total_compensation') return getTotalCompensation(b) - getTotalCompensation(a);
      const key = filters.sortBy as keyof Personnel;
      return Number(b[key] || 0) - Number(a[key] || 0);
    });
  }, [topSalaries, filters.sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedTop.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageRows = sortedTop.slice(pageStart, pageStart + PAGE_SIZE);
  const onSortChange = (sortBy: StatsFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Data</h1>
          <p className="text-muted-foreground">
            Compensation analytics and historical comparisons for SAPD personnel.
          </p>
        </div>

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
                    <p className="text-2xl font-bold text-foreground">{fmtUsd(aggregates.totalCompensation)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-inadvertent-yellow" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top earners ranking — the primary feature */}
        <Card className="mb-6 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="h-5 w-5" />
              Top Earners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 max-w-xs">
              <Label htmlFor="sortBy" className="text-foreground">Rank by</Label>
              <Select value={filters.sortBy} onValueChange={(value) => onSortChange(value as StatsFilters['sortBy'])}>
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
            {loadingTop ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-inadvertent-yellow"></div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {pageRows.map((person, index) => {
                    const value = filters.sortBy === 'total_compensation'
                      ? getTotalCompensation(person)
                      : Number(person[filters.sortBy as keyof Personnel] || 0);
                    return (
                      <Link key={person.id} to={`/profile/${person.id}`}>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3 min-w-0">
                            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center border-border flex-shrink-0">
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
                            <p className="text-xs text-muted-foreground">{SORT_LABELS[filters.sortBy || 'total_compensation']}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {/* Pagination controls — only shown when more than one page exists */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded border border-border text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
                    >
                      Previous
                    </button>
                    <div className="text-muted-foreground">
                      Page {page} of {totalPages} · Ranks {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, sortedTop.length)} of {sortedTop.length}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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

        {/* Year-over-year change cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Biggest 2024 → 2025 Increases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <YoYList rows={yoyTop} kind="increase" loading={loadingYoyTop} />
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Biggest 2024 → 2025 Decreases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <YoYList rows={yoyBottom} kind="decrease" loading={loadingYoyBottom} />
            </CardContent>
          </Card>
        </div>

        {/* Overtime leaders */}
        <Card className="mb-6 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-lg">
              <Activity className="h-5 w-5 text-inadvertent-yellow" />
              Top 10 by Overtime
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingOT ? (
              <div className="text-center py-6 text-muted-foreground">Loading…</div>
            ) : (
              <div className="space-y-2">
                {[...(overtimeLeaders || [])]
                  .sort((a, b) => Number(b.overtime || 0) - Number(a.overtime || 0))
                  .slice(0, 10)
                  .map((p, i) => (
                    <Link key={p.id} to={`/profile/${p.id}`}>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 min-w-0">
                          <Badge variant="outline" className="w-7 h-7 rounded-full flex items-center justify-center border-border flex-shrink-0 text-xs">{i + 1}</Badge>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{getFullName(p)}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {[p.classification, p.division].filter(Boolean).join(' • ')}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-foreground text-right ml-3">{fmtUsd(Number(p.overtime || 0))}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Division and rank breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <Building2 className="h-5 w-5 text-inadvertent-yellow" />
                By Division
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BreakdownTable rows={breakdowns?.byDivision || []} valueKey="total" valueLabel="Total" loading={loadingBreakdowns} />
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <ShieldCheck className="h-5 w-5 text-inadvertent-yellow" />
                By Rank (Average)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BreakdownTable rows={breakdowns?.byRank || []} valueKey="avg" valueLabel="Avg" loading={loadingBreakdowns} />
            </CardContent>
          </Card>
        </div>

        {/* Pay distribution histogram */}
        {histogram && (
          <Card className="mb-6 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">Pay Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {histogram.counts.map((b) => (
                  <div key={b.label} className="flex items-center gap-3">
                    <div className="w-28 text-sm text-muted-foreground flex-shrink-0">{b.label}</div>
                    <div className="flex-1 h-6 bg-muted rounded">
                      <div
                        className="h-full bg-inadvertent-yellow rounded"
                        style={{ width: `${(b.count / histogram.max) * 100}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-sm text-foreground font-medium">{b.count}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Based on total compensation across all current personnel.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const YoYList: React.FC<{ rows: YoYChange[] | undefined; kind: 'increase' | 'decrease'; loading?: boolean }> = ({ rows, kind, loading }) => {
  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (!rows || rows.length === 0) return <div className="text-sm text-muted-foreground">No data available.</div>;
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <Link key={r.id} to={`/profile/${r.id}`}>
          <div className="flex items-center justify-between p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors cursor-pointer">
            <div className="min-w-0 mr-3">
              <p className="text-sm font-semibold text-foreground truncate">{r.first_name} {r.last_name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {fmtUsd(r.total_2024)} → {fmtUsd(r.total_2025)}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`text-sm font-bold ${kind === 'increase' ? 'text-green-700' : 'text-red-700'}`}>
                {fmtPct(r.delta_pct)}
              </p>
              <p className="text-xs text-muted-foreground">{fmtUsd(r.delta)}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

const BreakdownTable: React.FC<{ rows: BreakdownRow[]; valueKey: 'total' | 'avg'; valueLabel: string; loading?: boolean }> = ({ rows, valueKey, valueLabel, loading }) => {
  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (rows.length === 0) return <div className="text-sm text-muted-foreground">No data available.</div>;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
          <th className="py-2">Name</th>
          <th className="py-2 text-right">Count</th>
          <th className="py-2 text-right">{valueLabel}</th>
        </tr>
      </thead>
      <tbody>
        {rows.slice(0, 10).map((r) => (
          <tr key={r.name} className="border-b border-border/40">
            <td className="py-2 pr-2 text-foreground">{r.name}</td>
            <td className="py-2 text-right text-muted-foreground">{r.count}</td>
            <td className="py-2 text-right font-semibold text-foreground">{fmtUsd(r[valueKey])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Statistics;
