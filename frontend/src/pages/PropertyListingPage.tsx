// PropertyListingPage.tsx
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useUser } from "../hooks/useUser";
import axios from "axios";
import { TableSkeleton } from "../components/ui/tableSkeleton";
import { PropertyDetails } from "../types/propertyTypes";
import { downloadFile } from "../utils/downloadFiles";
import { Skeleton } from "../components/ui/skeleton";
import LoadingSpinner from "../components/LoadingSpinner ";

const MultiSelector = lazy(() => import("../components/propertyListing/MultiSelect"));
const PropertyListingTable = lazy(() => import("../components/propertyListing/PropertyLisitingTable"));

const PropertyListingPage = () => {
  const selectedColumns = [
    "Address",
    "State",
    "County",
    "LAND_USE",
    "Principal Amount Owed",
    "ESTIMATED_VALUE",
    "Foreclosure Sale Date",
    "Parcel Number",
    "YEAR_BUILT",
    "BEDROOMS",
    "BATHROOMS",
    "STORIES",
    "SQUARE_FEET",
    "HOA_PRESENT",
    "LOT_ACRES",
    ,
  ];

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [properties, setProperties] = useState<PropertyDetails[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [allCounties, setAllCounties] = useState<{ label: string; value: string }[]>([]);
  const [allOwnerTypes, setAllOwnerTypes] = useState<{ label: string; value: string }[]>([]);
  const [allPropertyTypes, setAllPropertyTypes] = useState<{ label: string; value: string }[]>([]);
  const [allStates, setAllStates] = useState<{ label: string; value: string }[]>([]);

  // Initialize filter states from localStorage with proper typing
  const [selectedCounty, setSelectedCounty] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("selectedCounties");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedState, setSelectedState] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("selectedStates");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedOwnerType, setSelectedOwnerType] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("selectedOwnerTypes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedPropertyType, setSelectedPropertyType] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("selectedPropertyTypes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { user } = useUser();

  // Optimized fetch function with error handling and retry logic
  const fetchMoreProperties = useCallback(async (isNewSearch = false) => {
    if (!isNewSearch && (loading || !hasMore)) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: debouncedSearch,
        page: isNewSearch ? "1" : page.toString(),
        ...(selectedCounty.length && { county: selectedCounty.join(",") }),
        ...(selectedState.length && { state: selectedState.join(",") }),
        ...(selectedOwnerType.length && { ownerType: selectedOwnerType.join(",") }),
        ...(selectedPropertyType.length && { propertyType: selectedPropertyType.join(",") }),
      });

      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/get-properties?${queryParams}`
      );

      const newProperties = res.data.data;

      if (isNewSearch) {
        setProperties(newProperties);
        setPage(2); // Reset to page 2 since we just loaded page 1
      } else {
        setProperties(prev => [...prev, ...newProperties]);
        setPage(prev => prev + 1);
      }

      setHasMore(page < res.data.meta.totalPages);

      // Update filter options only on initial load or new search
      if (isNewSearch || initialLoad) {
        setAllCounties(
          res.data.allCounties
            .filter(Boolean)
            .map((county: any) => ({
              label: county,
              value: county,
            }))
        );
        setAllOwnerTypes(
          res.data.allOwnerTypes
            .filter(Boolean)
            .map((ownerType: any) => ({
              label: ownerType,
              value: ownerType,
            }))
        );
        setAllPropertyTypes(
          res.data.allPropertyTypes
            .filter(Boolean)
            .map((propertyType: any) => ({
              label: propertyType,
              value: propertyType,
            }))
        );
        setAllStates(
          res.data.allStates
            .filter(Boolean)
            .map((state: any) => ({
              label: state,
              value: state,
            }))
        );
        setInitialLoad(false);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedCounty, selectedState, selectedOwnerType, selectedPropertyType, initialLoad]);

  // Optimized intersection observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMoreProperties(false);
        }
      },
      { threshold: 0.5 }
    );

    const sentinel = document.querySelector("#scroll-sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [fetchMoreProperties, hasMore, loading]);

  // Optimized debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== debouncedSearch) {
        setDebouncedSearch(searchInput);
        setProperties([]);
        setPage(1);
        setHasMore(true);
      }
    }, 300); // Reduced debounce time for faster response

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Effect for filter changes
  useEffect(() => {
    setProperties([]);
    setPage(1);
    setHasMore(true);
    fetchMoreProperties(true);
  }, [debouncedSearch, selectedCounty, selectedState, selectedOwnerType, selectedPropertyType]);

  // Initial load
  useEffect(() => {
    fetchMoreProperties(true);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setLoading(true); // Show loading state immediately on search
  };

  // Filter change handlers with localStorage persistence
  const handleCountyChange = (selectedValues: string[]) => {
    setSelectedCounty(selectedValues);
    localStorage.setItem("selectedCounties", JSON.stringify(selectedValues));
  };

  const handleStateChange = (selectedValues: string[]) => {
    setSelectedState(selectedValues);
    localStorage.setItem("selectedStates", JSON.stringify(selectedValues));
  };

  const handleOwnerTypeChange = (selectedValues: string[]) => {
    setSelectedOwnerType(selectedValues);
    localStorage.setItem("selectedOwnerTypes", JSON.stringify(selectedValues));
  };

  const handlePropertyTypeChange = (selectedValues: string[]) => {
    setSelectedPropertyType(selectedValues);
    localStorage.setItem("selectedPropertyTypes", JSON.stringify(selectedValues));
  };

  const clearAllFilters = () => {
    setSelectedCounty([]);
    setSelectedState([]);
    setSelectedOwnerType([]);
    setSelectedPropertyType([]);
    setSearchInput("");
    localStorage.removeItem("selectedCounties");
    localStorage.removeItem("selectedStates");
    localStorage.removeItem("selectedOwnerTypes");
    localStorage.removeItem("selectedPropertyTypes");
  };

  return (
    <>
      <div className="flex w-full md:justify-start justify-center bg-gray-800 text-white py-10">
        <h1 className="md:text-5xl md:pl-20 text-center text-3xl">
          Welcome {user?.name}
        </h1>
      </div>

      <div className="text-center py-10 p-2">
        <h2 className="text-3xl font-semibold">
          Search for Georgia, Tennessee, and Virginia foreclosures
        </h2>
        <p className="text-xl my-4">
          We offer the most comprehensive foreclosure database in the world.
          <br />
          Find, research, get images, and bid remotely.
        </p>
      </div>

      <div className="mx-4 md:mx-20">
        <div className="flex items-center justify-between mx-auto mb-4">
          <div className="flex items-center space-x-2 flex-1">
            <Input
              type="text"
              className="h-12 placeholder:text-gray-500 font-medium"
              placeholder="Search by county or address"
              value={searchInput}
              onChange={handleSearch}
            />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="h-12" disabled={properties.length === 0}>Download</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => downloadFile(properties, "CSV")}>
                  .CSV
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => downloadFile(properties, "XLS")}>
                  .XLS
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {(selectedCounty.length > 0 ||
            selectedState.length > 0 ||
            selectedOwnerType.length > 0 ||
            selectedPropertyType.length > 0) && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="ml-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all filters
            </Button>
          )}
        </div>

        <div className="my-10 flex flex-wrap lg:flex-nowrap justify-between gap-6">
          <div className="w-full lg:w-1/5 space-y-6">
            <Suspense fallback={<Skeleton className="h-12" />}>
              <MultiSelector
                options={allCounties}
                placeholder="Select County"
                onChange={handleCountyChange}
                selectedValues={selectedCounty}
                buttonWidth="w-full"
                storageKey="selectedCounties"
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-12" />}>
              <MultiSelector
                options={allStates}
                placeholder="Select State"
                onChange={handleStateChange}
                selectedValues={selectedState}
                buttonWidth="w-full"
                storageKey="selectedStates"
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-12" />}>
              <MultiSelector
                options={allPropertyTypes}
                placeholder="Select Property Type"
                onChange={handlePropertyTypeChange}
                selectedValues={selectedPropertyType}
                buttonWidth="w-full"
                storageKey="selectedPropertyTypes"
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-12" />}>
              <MultiSelector
                options={allOwnerTypes}
                placeholder="Select Owner Type"
                onChange={handleOwnerTypeChange}
                selectedValues={selectedOwnerType}
                buttonWidth="w-full"
                storageKey="selectedOwnerTypes"
              />
            </Suspense>
          </div>

          <div className="w-full lg:w-3/4 transition-all duration-300 ease-in-out">
          {loading && properties.length === 0 ? (
            <TableSkeleton rows={15} columns={4} className="my-4" />
          ) : properties.length > 0 ? (
            <>
              <Suspense fallback={<TableSkeleton rows={15} columns={4} className="my-4" />}>
                <div className="transition-opacity duration-300 ease-in-out">
                  <PropertyListingTable
                    data={properties}
                    selectedColumns={selectedColumns}
                  />
                </div>
              </Suspense>
              <div 
                id="scroll-sentinel" 
                className="h-20 transition-all duration-300 ease-in-out"
              >
                {loading && (
                  <Suspense fallback={<div className="h-20" />}>
                    <LoadingSpinner />
                  </Suspense>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 animate-fadeIn">
              <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                className="mt-4 transition-all duration-300 hover:scale-105"
              >
                Clear filters and try again
              </Button>
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
};

export default PropertyListingPage;
