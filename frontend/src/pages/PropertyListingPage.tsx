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
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

const MultiSelector = lazy(
  () => import("../components/propertyListing/MultiSelect")
);
const PropertyListingTable = lazy(
  () => import("../components/propertyListing/PropertyLisitingTable")
);
const DateRangePicker = lazy(
  () => import("../components/propertyListing/DateRangePicker")
);
// Pagination is now integrated within the PropertyListingTable component

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
  ];

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [properties, setProperties] = useState<PropertyDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(25); // Set to match the table's paginationPageSize

  const [allCounties, setAllCounties] = useState<
    { label: string; value: string }[]
  >([]);
  const [allOwnerTypes, setAllOwnerTypes] = useState<
    { label: string; value: string }[]
  >([]);
  const [allPropertyTypes, setAllPropertyTypes] = useState<
    { label: string; value: string }[]
  >([]);
  const [allStates, setAllStates] = useState<
    { label: string; value: string }[]
  >([]);
  const [allOwnerOccupancy, setAllOwnerOccupancy] = useState<
    { label: string; value: string }[]
  >([]);

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

  const [selectedPropertyType, setSelectedPropertyType] = useState<string[]>(
    () => {
      try {
        const saved = localStorage.getItem("selectedPropertyTypes");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
  );

  const [selectedOwnerOccupancy, setSelectedOwnerOccupancy] = useState<
    string[]
  >(() => {
    try {
      const saved = localStorage.getItem("selectedOwnerOccupancy");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedDataRange, setSelectedDataRange] = useState<
    DateRange | undefined
  >(() => {
    try {
      const saved = localStorage.getItem("selectedDataRange");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return {
            from: parsed.from ? new Date(parsed.from) : undefined,
            to: parsed.to ? new Date(parsed.to) : undefined,
          };
        }
      }
      return undefined;
    } catch {
      return undefined;
    }
  });

  const [selectedYearBuilt, setSelectedYearBuilt] = useState<{
    from?: string;
    to?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem("selectedYearBuilt");
      return saved
        ? JSON.parse(saved)
        : {
            from: undefined,
            to: undefined,
          };
    } catch {
      return {};
    }
  });

  const [selectedEstimatedValue, setSelectedEstimatedValue] = useState<{
    from?: string;
    to?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem("selectedEstimatedValue");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure we return actual values, not empty strings
        return {
          from: parsed.from || undefined,
          to: parsed.to || undefined,
        };
      }
      return {
        from: undefined,
        to: undefined,
      };
    } catch {
      return {
        from: undefined,
        to: undefined,
      };
    }
  });

  const { user } = useUser();

  // Fetch properties based on current page and filters
  const fetchProperties = useCallback(
    async () => {
      setLoading(true);
      try {
        const fromDate = selectedDataRange?.from
          ? format(selectedDataRange.from, "M/d/yyyy")
          : undefined;
        const toDate = selectedDataRange?.to
          ? format(selectedDataRange.to, "M/d/yyyy")
          : undefined;

        const queryParams = new URLSearchParams({
          search: debouncedSearch,
          page: currentPage.toString(),
          limit: itemsPerPage.toString(), // Add items per page
          ...(selectedCounty.length && { county: selectedCounty.join(",") }),
          ...(selectedState.length && { state: selectedState.join(",") }),
          ...(selectedOwnerType.length && {
            ownerType: selectedOwnerType.join(","),
          }),
          ...(selectedPropertyType.length && {
            propertyType: selectedPropertyType.join(","),
          }),
          ...(selectedOwnerOccupancy.length && {
            ownerOccupancy: selectedOwnerOccupancy.join(","),
          }),
          ...(fromDate && { fromDate }),
          ...(toDate && { toDate }),
          ...(selectedYearBuilt.from && {
            yearBuiltFrom: selectedYearBuilt.from,
          }),
          ...(selectedYearBuilt.to && { yearBuiltTo: selectedYearBuilt.to }),
          ...(selectedEstimatedValue.from && {
            estimatedFrom: selectedEstimatedValue.from,
          }),
          ...(selectedEstimatedValue.to && {
            estimatedTo: selectedEstimatedValue.to,
          }),
        });
        
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/get-properties?${queryParams}`
        );

        setProperties(res.data.data);
        setTotalPages(res.data.meta.totalPages);

        // Update filter options only on initial load
        if (initialLoad) {
          setAllCounties(
            res.data.allCounties.filter(Boolean).map((county: any) => ({
              label: county,
              value: county,
            }))
          );
          setAllOwnerTypes(
            res.data.allOwnerTypes.filter(Boolean).map((ownerType: any) => ({
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
            res.data.allStates.filter(Boolean).map((state: any) => ({
              label: state,
              value: state,
            }))
          );

          setAllOwnerOccupancy(
            res.data.allOwnerOccupancy.map((occupancy: string) => ({
              label: occupancy,
              value: occupancy,
            }))
          );

          setInitialLoad(false);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    },
    [
      currentPage,
      itemsPerPage,
      debouncedSearch,
      selectedCounty,
      selectedState,
      selectedOwnerType,
      selectedPropertyType,
      selectedOwnerOccupancy,
      selectedDataRange,
      selectedYearBuilt,
      selectedEstimatedValue,
      initialLoad,
    ]
  );


  console.log("properties", properties);
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Optimized debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== debouncedSearch) {
        setDebouncedSearch(searchInput);
        setCurrentPage(1); // Reset to first page on new search
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Effect for filter or page changes
  useEffect(() => {
    fetchProperties();
  }, [
    currentPage,
    debouncedSearch,
    selectedCounty,
    selectedState,
    selectedOwnerType,
    selectedPropertyType,
    selectedOwnerOccupancy,
    selectedDataRange,
    selectedYearBuilt,
    selectedEstimatedValue,
    fetchProperties
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    if (!initialLoad) {
      setCurrentPage(1);
    }
  }, [
    debouncedSearch,
    selectedCounty,
    selectedState,
    selectedOwnerType,
    selectedPropertyType,
    selectedOwnerOccupancy,
    selectedDataRange,
    selectedYearBuilt,
    selectedEstimatedValue,
    initialLoad
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setLoading(true);
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
    localStorage.setItem(
      "selectedPropertyTypes",
      JSON.stringify(selectedValues)
    );
  };

  const handleOwnerOccupancyChange = (selectedValues: string[]) => {
    setSelectedOwnerOccupancy(selectedValues);
    localStorage.setItem(
      "selectedOwnerOccupancy",
      JSON.stringify(selectedValues)
    );
  };

  const handleYearBuiltChange = (from: string, to: string) => {
    setSelectedYearBuilt({ from, to });
    localStorage.setItem(
      "selectedYearBuilt",
      JSON.stringify({
        from: from ?? "",
        to: to ?? "",
      })
    );
  };

  const handleEstimatedValueChange = (from: string, to: string) => {
    setSelectedEstimatedValue({ from, to });
    localStorage.setItem(
      "selectedEstimatedValue",
      JSON.stringify({
        from: from ?? "",
        to: to ?? "",
      })
    );
  };

  const clearAllFilters = () => {
    setSelectedCounty([]);
    setSelectedState([]);
    setSelectedOwnerType([]);
    setSelectedPropertyType([]);
    setSelectedOwnerOccupancy([]);
    setSelectedDataRange(undefined);
    setSelectedYearBuilt({ from: undefined, to: undefined });
    setSelectedEstimatedValue({ from: undefined, to: undefined });
    setSearchInput("");
    setCurrentPage(1);
    localStorage.removeItem("selectedCounties");
    localStorage.removeItem("selectedStates");
    localStorage.removeItem("selectedOwnerTypes");
    localStorage.removeItem("selectedPropertyTypes");
    localStorage.removeItem("selectedOwnerOccupancy");
    localStorage.removeItem("selectedDataRange");
    localStorage.removeItem("selectedYearBuilt");
    localStorage.removeItem("selectedEstimatedValue");
  };

  return (
    <>
      <div className="flex w-full md:justify-start justify-center bg-gray-800 text-white py-10">
        <h1 className="md:text-5xl md:pl-20 text-center text-3xl">
          Welcome {user?.name}
        </h1>
      </div>

      <div className="text-center py-10 p-2">
        <h2 className="text-5xl font-semibold">
          Search Foreclosures
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
              <DropdownMenuTrigger disabled={properties.length === 0}>
                <div className="h-12 bg-black text-white py-3 px-2 rounded-md">
                  Download
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => downloadFile(properties, "CSV")}
                >
                  .CSV
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => downloadFile(properties, "XLS")}
                >
                  .XLS
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="my-10 flex flex-wrap lg:flex-nowrap justify-between gap-6">
          <div className="w-full lg:w-1/5 space-y-6">
          {(selectedCounty.length > 0 ||
            selectedState.length > 0 ||
            selectedOwnerType.length > 0 ||
            selectedPropertyType.length > 0 ||
            selectedOwnerOccupancy.length > 0 ||
            selectedDataRange?.from !== undefined ||
            selectedYearBuilt?.from !== undefined ||
            selectedYearBuilt?.to !== undefined ||
            selectedEstimatedValue?.from !== undefined ||
            selectedEstimatedValue?.to !== undefined ||
            selectedYearBuilt?.from === "" ||
            selectedYearBuilt?.to === "" ||
            selectedEstimatedValue?.from === "" ||
            selectedEstimatedValue?.to === "") && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="ml-4 text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Clear all filters
            </Button>
          )}
            <Suspense fallback={<Skeleton className="h-12" />}>
              <MultiSelector
                key={selectedCounty.join(",")}
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
                key={selectedState.join(",")}
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
                key={selectedPropertyType.join(",")}
                options={allPropertyTypes}
                placeholder="Select Property Type"
                onChange={handlePropertyTypeChange}
                selectedValues={selectedPropertyType}
                buttonWidth="w-full"
                storageKey="selectedPropertyTypes"
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-12" />}>
              <DateRangePicker
                date={selectedDataRange}
                title="Sale Date Range"
                setDate={(newDateRange) => {
                  if (typeof newDateRange === "function") {
                    setSelectedDataRange((prev) => {
                      const value = newDateRange(prev);
                      localStorage.setItem(
                        "selectedDataRange",
                        JSON.stringify({
                          from: value?.from
                            ? value.from.toISOString()
                            : undefined,
                          to: value?.to ? value.to.toISOString() : undefined,
                        })
                      );
                      return value;
                    });
                  } else {
                    setSelectedDataRange(newDateRange);
                    localStorage.setItem(
                      "selectedDataRange",
                      JSON.stringify({
                        from: newDateRange?.from
                          ? newDateRange.from.toISOString()
                          : undefined,
                        to: newDateRange?.to
                          ? newDateRange.to.toISOString()
                          : undefined,
                      })
                    );
                  }
                }}
              />
            </Suspense>

            <div className="p-3 border-gray-200 border rounded-md">
              <div>Year Built</div>
              <div className="flex flex-row">
              <Input
                  onChange={(e) => {
                    setSelectedYearBuilt((prevState) => ({
                      ...prevState,
                      from: e.target.value || "",
                    }));
                    localStorage.setItem(
                      "selectedYearBuilt",
                      JSON.stringify({
                        ...selectedYearBuilt,
                        from: e.target.value || "",
                      })
                    );
                  }}
                  value={selectedYearBuilt.from}
                  type="number"
                  placeholder="E.g 1996"
                  max={2100}
                  min={1900}
                />
                <div className="p-1 font-bold">-</div>
                <Input
                 onChange={(e) => {
                  setSelectedYearBuilt((prevState) => ({
                    ...prevState,
                    to: e.target.value || "",
                  }));
                  localStorage.setItem(
                    "selectedYearBuilt",
                    JSON.stringify({
                      ...selectedYearBuilt,
                      to: e.target.value || "",
                    })
                  );
                }}
                  value={selectedYearBuilt.to}
                  type="number"
                  placeholder="E.g 2015"
                  max={2100}
                  min={1900}
                />
              </div>
            </div>
            <div className="p-3 border-gray-200 border rounded-md">
              <div>Estimated Value</div>
              <div className="flex flex-row">
                <Input
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setSelectedEstimatedValue((prevState) => {
                      const newState = {
                        ...prevState,
                        from: newValue || undefined,
                      };
                      localStorage.setItem(
                        "selectedEstimatedValue",
                        JSON.stringify(newState)
                      );
                      return newState;
                    });
                  }}
                  value={selectedEstimatedValue.from || ""}
                  type="number"
                  placeholder="XXXX"
                />
                <div className="p-1 font-bold">-</div>
                <Input
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setSelectedEstimatedValue((prevState) => {
                      const newState = {
                        ...prevState,
                        to: newValue || undefined,
                      };
                      localStorage.setItem(
                        "selectedEstimatedValue",
                        JSON.stringify(newState)
                      );
                      return newState;
                    });
                  }}
                  value={selectedEstimatedValue.to || ""}
                  type="number"
                  placeholder="XXXX"
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-3/4 transition-all duration-300 ease-in-out">
            {loading ? (
              <TableSkeleton rows={15} columns={4} className="my-4" />
            ) : properties.length > 0 ? (
              <>
                <Suspense
                  fallback={
                    <TableSkeleton rows={15} columns={4} className="my-4" />
                  }
                >
                  <div className="transition-opacity duration-300 ease-in-out">
                    <PropertyListingTable
                      data={properties}
                      selectedColumns={selectedColumns}
                      paginationData={{
                        currentPage,
                        totalPages,
                        onPageChange: handlePageChange
                      }}
                    />
                  </div>
                </Suspense>
                
                {/* Pagination component */}
                {/* Pagination is now handled by the PropertyListingTable component */}
              </>
            ) : (
              <div className="text-center py-8 animate-fadeIn">
                <p className="text-gray-500 text-lg">
                  No properties found matching your criteria.
                </p>
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