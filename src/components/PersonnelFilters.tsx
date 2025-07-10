import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonnelFilters } from "@/hooks/useAdvancedPersonnel";
import { Filter, X } from "lucide-react";

interface PersonnelFiltersProps {
  filters: PersonnelFilters;
  onFiltersChange: (filters: Partial<PersonnelFilters>) => void;
  onClearFilters: () => void;
  divisions: string[];
}

const PersonnelFiltersComponent: React.FC<PersonnelFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  divisions,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Sorting
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="First name..."
              value={filters.firstName || ''}
              onChange={(e) => onFiltersChange({ firstName: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Last name..."
              value={filters.lastName || ''}
              onChange={(e) => onFiltersChange({ lastName: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Badge Number */}
          <div>
            <Label htmlFor="badgeNumber">Badge Number</Label>
            <Input
              id="badgeNumber"
              type="text"
              placeholder="Badge number..."
              value={filters.badgeNumber || ''}
              onChange={(e) => onFiltersChange({ badgeNumber: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Division Filter */}
          <div>
            <Label htmlFor="division">Division</Label>
            <Select value={filters.division || 'all'} onValueChange={(value) => onFiltersChange({ division: value === 'all' ? undefined : value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All Divisions" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg max-h-48 overflow-y-auto z-50">
                <SelectItem value="all">All Divisions</SelectItem>
                {divisions.map((division) => (
                  <SelectItem key={division} value={division}>{division}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <Label htmlFor="sortBy">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => onFiltersChange({ sortBy: value as PersonnelFilters['sortBy'] })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="regular_pay">Base Pay</SelectItem>
                <SelectItem value="overtime">Overtime</SelectItem>
                <SelectItem value="total_compensation">Total Compensation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div>
            <Label htmlFor="sortOrder">Order</Label>
            <Select value={filters.sortOrder} onValueChange={(value) => onFiltersChange({ sortOrder: value as 'asc' | 'desc' })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Page Size */}
          <div>
            <Label htmlFor="pageSize">Results per page</Label>
            <Select value={filters.pageSize.toString()} onValueChange={(value) => onFiltersChange({ pageSize: parseInt(value), page: 1 })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClearFilters} variant="outline" className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonnelFiltersComponent;