import { InvoiceFilterDto, SubscriptionTier, InvoiceStatus } from "@/types/filter";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Label } from "@radix-ui/react-label";

interface InvoiceFilterProps {
    filters: InvoiceFilterDto;
    onFilterChange: (filters: InvoiceFilterDto) => void;
}

export const InvoiceFilter = ({ filters, onFilterChange }: InvoiceFilterProps) => {
    const handleChange = (key: keyof InvoiceFilterDto, value: any) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const resetFilters = () => {
        onFilterChange({});
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <h3 className="font-semibold">Invoice Filters</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                        Clear All
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={filters.status !== undefined ? String(filters.status) : ""}
                            onValueChange={(value) => {
                                const numValue = value ? Number(value) : undefined;
                                handleChange("status", numValue);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Remove the empty string SelectItem */}
                                {Object.keys(InvoiceStatus)
                                    .filter(key => isNaN(Number(key)))
                                    .map((key) => (
                                        <SelectItem key={key} value={String(InvoiceStatus[key as keyof typeof InvoiceStatus])}>
                                            {key}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tier">Subscription Tier</Label>
                        <Select
                            value={filters.tier !== undefined ? String(filters.tier) : ""}
                            onValueChange={(value) => {
                                const numValue = value ? Number(value) : undefined;
                                handleChange("tier", numValue);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Tiers" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Remove the empty string SelectItem */}
                                {Object.keys(SubscriptionTier)
                                    .filter(key => isNaN(Number(key)))
                                    .map((key) => (
                                        <SelectItem key={key} value={String(SubscriptionTier[key as keyof typeof SubscriptionTier])}>
                                            {key}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Order Code Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="orderCode">Order Code</Label>
                        <Input
                            id="orderCode"
                            type="number"
                            placeholder="Enter order code"
                            value={filters.orderCode || ""}
                            onChange={(e) =>
                                handleChange(
                                    "orderCode",
                                    e.target.value ? Number(e.target.value) : undefined
                                )
                            }
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default InvoiceFilter;