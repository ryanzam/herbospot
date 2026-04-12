'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FilterState {
    category: string;
    sort: string;
    priceRange: [number, number];
    inStock: boolean;
}

const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'spices', label: 'Spices' },
    { value: 'aromatic', label: 'Aromatic' }
];


const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Best Rating' },
];

export default function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        price: true,
        sort: true,
        availability: true,
    });

    const [filters, setFilters] = useState<FilterState>({
        category: searchParams.get('category') || 'all',
        sort: searchParams.get('sort') || 'newest',
        priceRange: [0, 50000],
        inStock: searchParams.get('inStock') === 'true',
    });

    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.category && filters.category !== 'all') params.set('category', filters.category);
        if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort);
        if (filters.inStock) params.set('inStock', 'true');
        if (filters.priceRange[0] > 0) params.set('minPrice', filters.priceRange[0].toString());
        if (filters.priceRange[1] < 50000) params.set('maxPrice', filters.priceRange[1].toString());

        router.push(`/products?${params.toString()}`);
    }, [filters, router]);

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCategoryChange = (category: string) => {
        setFilters(prev => ({ ...prev, category }));
    };

    const handleSortChange = (sort: string) => {
        setFilters(prev => ({ ...prev, sort }));
    };

    const handlePriceChange = (type: 'min' | 'max', value: number) => {
        setFilters(prev => ({
            ...prev,
            priceRange: type === 'min' ? [value, prev.priceRange[1]] : [prev.priceRange[0], value],
        }));
    };

    const handleStockChange = (checked: boolean) => {
        setFilters(prev => ({ ...prev, inStock: checked }));
    };

    const clearAllFilters = () => {
        setFilters({
            category: 'all',
            sort: 'newest',
            priceRange: [0, 5000],
            inStock: false,
        });
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.category !== 'all') count++;
        if (filters.sort !== 'newest') count++;
        if (filters.inStock) count++;
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) count++;
        return count;
    };

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden fixed bottom-20 right-4 z-40">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="bg-primary text-white p-4 rounded-full shadow-lg flex items-center gap-2"
                >
                    <FiFilter size={20} />
                    <span className="font-semibold">Filters</span>
                    {getActiveFilterCount() > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {getActiveFilterCount()}
                        </span>
                    )}
                </button>
            </div>

            {/* Filter Drawer - Mobile */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl animate-slide-in">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <FilterContent
                                filters={filters}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                handleCategoryChange={handleCategoryChange}
                                handleSortChange={handleSortChange}
                                handlePriceChange={handlePriceChange}
                                handleStockChange={handleStockChange}
                            />
                        </div>
                        <div className="p-4 border-t">
                            <button
                                onClick={clearAllFilters}
                                className="w-full btn-secondary"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Filters */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Filters</h2>
                    {getActiveFilterCount() > 0 && (
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-primary hover:text-primary/90"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                <FilterContent
                    filters={filters}
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                    handleCategoryChange={handleCategoryChange}
                    handleSortChange={handleSortChange}
                    handlePriceChange={handlePriceChange}
                    handleStockChange={handleStockChange}
                />
            </div>
        </>
    );
}

// Filter Content Component (reused for both mobile and desktop)
function FilterContent({
    filters,
    expandedSections,
    toggleSection,
    handleCategoryChange,
    handleSortChange,
    handlePriceChange,
    handleStockChange,
}: any) {
    return (
        <div className="space-y-6">
            {/* Sort By Section */}
            <div className="border-b pb-4">
                <button
                    onClick={() => toggleSection('sort')}
                    className="flex justify-between items-center w-full font-semibold text-lg mb-2"
                >
                    Sort By
                    {expandedSections.sort ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedSections.sort && (
                    <div className="space-y-2 mt-2">
                        {sortOptions.map((option) => (
                            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sort"
                                    value={option.value}
                                    checked={filters.sort === option.value}
                                    onChange={() => handleSortChange(option.value)}
                                    className="w-4 h-4 text-primary"
                                />
                                <span className="text-gray-700">{option.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Categories Section */}
            <div className="border-b pb-4">
                <button
                    onClick={() => toggleSection('categories')}
                    className="flex justify-between items-center w-full font-semibold text-lg mb-2"
                >
                    Categories
                    {expandedSections.categories ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedSections.categories && (
                    <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                        {categories.map((category) => (
                            <label key={category.value} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="category"
                                    value={category.value}
                                    checked={filters.category === category.value}
                                    onChange={() => handleCategoryChange(category.value)}
                                    className="w-4 h-4 text-primary"
                                />
                                <span className="text-gray-700">{category.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Range Section */}
            <div className="border-b pb-4">
                <button
                    onClick={() => toggleSection('price')}
                    className="flex justify-between items-center w-full font-semibold text-lg mb-2"
                >
                    Price Range
                    {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedSections.price && (
                    <div className="space-y-4 mt-2">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500">Min (Rs.)</label>
                                <input
                                    type="number"
                                    value={filters.priceRange[0]}
                                    onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                                    className="input-field mt-1"
                                    min={0}
                                    max={filters.priceRange[1]}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500">Max (Rs.)</label>
                                <input
                                    type="number"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 5000)}
                                    className="input-field mt-1"
                                    min={filters.priceRange[0]}
                                    max={5000}
                                />
                            </div>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={5000}
                            value={filters.priceRange[1]}
                            onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Rs. 0</span>
                            <span>Rs. 5,000+</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Availability Section */}
            <div className="border-b pb-4">
                <button
                    onClick={() => toggleSection('availability')}
                    className="flex justify-between items-center w-full font-semibold text-lg mb-2"
                >
                    Availability
                    {expandedSections.availability ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedSections.availability && (
                    <label className="flex items-center gap-3 cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={(e) => handleStockChange(e.target.checked)}
                            className="w-4 h-4 text-primary"
                        />
                        <span className="text-gray-700">In Stock Only</span>
                    </label>
                )}
            </div>

            {/* Active Filters Display */}
            {filters.category !== 'all' && (
                <div className="mt-4">
                    <span className="text-sm text-gray-500">Active Filters:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {filters.category !== 'all' && (
                            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                                {categories.find(c => c.value === filters.category)?.label}
                                <button onClick={() => handleCategoryChange('all')}>
                                    <FiX size={14} />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}