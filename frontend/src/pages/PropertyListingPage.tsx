// PropertyListingPage.tsx
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import React from "react";
import { MapIcon } from "lucide-react"; // Add this import
const PropertyListingMap = lazy(
  () => import("../components/propertyListing/PropertyListingMap")
);
const MultiSelector = lazy(
  () => import("../components/propertyListing/MultiSelect")
);
const PropertyListingTable = lazy(
  () => import("../components/propertyListing/PropertyLisitingTable")
);
// Pagination is now integrated within the PropertyListingTable component

const PropertyListingPage = () => {
  const selectedColumns = [
    "Address",
    "State",
    "County",
    "Property Type",
    "Foreclosure Sale Date",
    "Principal Amount Owed",
    "Zestimate",
    "Rent Zestimate",
    "Year Built",
    "Bedrooms",
    "Bathrooms",
    "Living Area (sq ft)",
  ];
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [properties, setProperties] = useState<PropertyDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapTotalCount, setMapTotalCount] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [allMapProperties, setAllMapProperties] = useState<PropertyDetails[]>(
    []
  );
  const [mapLoading, setMapLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Updated itemsPerPage to support user selection
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("itemsPerPage");
      return saved ? JSON.parse(saved) : 100; // Changed from 25 to 100
    } catch {
      return 100; // Changed from 25 to 100
    }
  });

  const [showMap, setShowMap] = useState(false);
  const [allSaleDates, setAllSaleDates] = useState<string[]>([]);
  const [allCounties, setAllCounties] = useState<string[]>([]);
  const [allPropertyTypes, setAllPropertyTypes] = useState<string[]>([]);
  const [allStates, setAllStates] = useState<string[]>([]);
  const [allOwnerOccupancy, setAllOwnerOccupancy] = useState<
    { label: string; value: string }[]
  >([]);
  const [sortParams, setSortParams] = useState<{
    colId: string;
    sort: "asc" | "desc" | null;
  } | null>(null);
  const [selectedSaleDates, setSelectedSaleDates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("selectedSaleDates");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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

  const [selectedOwnerOccupancy, setSelectedOwnerOccupancy] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("selectedOwnerOccupancy");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    console.log("Changing items per page to:", value); // Add this log
    setItemsPerPage(value);
    localStorage.setItem("itemsPerPage", JSON.stringify(value));
    setCurrentPage(1);
  };

  // Fetch properties based on current page and filters
  const fetchProperties = useMemo(() => {
    return async () => {
      setLoading(true);
      try {
        console.log('Filter values before API call:', {
          estimatedFrom: selectedEstimatedValue.from,
          estimatedTo: selectedEstimatedValue.to,
          parsedFrom: selectedEstimatedValue.from ? parseFloat(selectedEstimatedValue.from) : undefined,
          parsedTo: selectedEstimatedValue.to ? parseFloat(selectedEstimatedValue.to) : undefined
        });

        const queryParams = new URLSearchParams({
          search: debouncedSearch,
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(selectedCounty.length && { county: selectedCounty.join(",") }),
          ...(selectedState.length && { state: selectedState.join(",") }),
          ...(selectedOwnerType.length && { ownerType: selectedOwnerType.join(",") }),
          ...(selectedPropertyType.length && { propertyType: selectedPropertyType.join(",") }),
          ...(selectedOwnerOccupancy.length && { ownerOccupancy: selectedOwnerOccupancy.join(",") }),
          ...(selectedSaleDates.length && { saleDates: selectedSaleDates.join(",") }),
          ...(selectedYearBuilt.from && { yearBuiltFrom: selectedYearBuilt.from }),
          ...(selectedYearBuilt.to && { yearBuiltTo: selectedYearBuilt.to }),
          ...(selectedEstimatedValue.from && { estimatedFrom: selectedEstimatedValue.from }),
          ...(selectedEstimatedValue.to && { estimatedTo: selectedEstimatedValue.to }),
          ...(sortParams && sortParams.colId && sortParams.sort && { sortColumn: sortParams.colId, sortDirection: sortParams.sort }),
        });

        console.log('Full API Request URL:', `${process.env.REACT_APP_API_BASE_URL}/get-properties?${queryParams}`);

        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-properties?${queryParams}`);

        console.log('API Response:', {
          totalProperties: res.data.data.length,
          totalPages: res.data.meta.totalPages,
          sampleProperty: res.data.data[0]
        });

        setProperties(res.data.data);
        setTotalPages(res.data.meta.totalPages);

        if (initialLoad) {
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
    };
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearch,
    selectedCounty,
    selectedState,
    selectedOwnerType,
    selectedPropertyType,
    selectedOwnerOccupancy,
    selectedSaleDates,
    selectedYearBuilt,
    selectedEstimatedValue,
    initialLoad,
    sortParams,
  ]);

  // Fetch all filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-properties`);
        setAllSaleDates(res.data.allSaleDates || []);
        setAllCounties(res.data.allCounties || []);
        setAllPropertyTypes(res.data.allPropertyTypes || []);
        setAllStates(res.data.allStates || []);
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchFilterOptions();
  }, []);

  // 2. Add a reference to track initial sort restoration
  const initialSortRestored = React.useRef(false);
  console.log("properties", properties);
  // Handle page change
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleSortChanged = (sortModel: {
    colId: string;
    sort: "asc" | "desc" | null;
  }) => {
    // Only update if the sort has actually changed
    if (
      !sortParams ||
      sortParams.colId !== sortModel.colId ||
      sortParams.sort !== sortModel.sort
    ) {
      setSortParams(sortModel);

      // Just mark that initial sort has been restored
      if (!initialSortRestored.current) {
        initialSortRestored.current = true;
      }
      // Remove the setCurrentPage(1) entirely
    }
  };

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
    selectedSaleDates,
    selectedYearBuilt,
    selectedEstimatedValue,
    itemsPerPage,
    sortParams,
  ]);

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
    selectedSaleDates,
    selectedYearBuilt,
    selectedEstimatedValue,
    initialLoad,
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

  const fetchAllPropertiesForMap = useCallback(async () => {
    // Set loading state for map
    setMapLoading(true);
    try {
      // Create query params with all current filters
      const queryParams = new URLSearchParams({
        // Include all the same filters as the table view
        search: debouncedSearch,
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
        ...(selectedSaleDates.length && { saleDates: selectedSaleDates.join(",") }),
        // Year built filters
        ...(selectedYearBuilt.from && {
          yearBuiltFrom: selectedYearBuilt.from,
        }),
        ...(selectedYearBuilt.to && { yearBuiltTo: selectedYearBuilt.to }),
        // Estimated value filters
        ...(selectedEstimatedValue.from && {
          estimatedFrom: selectedEstimatedValue.from,
        }),
        ...(selectedEstimatedValue.to && {
          estimatedTo: selectedEstimatedValue.to,
        }),
      });

      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/get-all-map-properties?${queryParams}`
      );

      setAllMapProperties(res.data.properties);
      setMapTotalCount(res.data.totalMatchingProperties);
    } catch (err) {
      console.error("Error fetching filtered properties for map:", err);
    } finally {
      setMapLoading(false);
    }
  }, [
    debouncedSearch,
    selectedCounty,
    selectedState,
    selectedOwnerType,
    selectedPropertyType,
    selectedOwnerOccupancy,
    selectedSaleDates,
    selectedYearBuilt,
    selectedEstimatedValue,
  ]);

  // Update toggleMapView to fetch ALL properties when opening the map
  const toggleMapView = () => {
    if (!showMap) {
      // Fetch ALL properties for map when opening
      fetchAllPropertiesForMap();
    } else {
      // Reset map properties when closing to free memory
      setAllMapProperties([]);
      setMapTotalCount(0);
    }
    setShowMap(!showMap);
  };
  const hasActiveFilters = () => {
    return (
      selectedCounty.length > 0 ||
      selectedState.length > 0 ||
      selectedOwnerType.length > 0 ||
      selectedPropertyType.length > 0 ||
      selectedOwnerOccupancy.length > 0 ||
      selectedSaleDates.length > 0 ||
      selectedYearBuilt?.from !== undefined ||
      selectedYearBuilt?.to !== undefined ||
      selectedEstimatedValue?.from !== undefined ||
      selectedEstimatedValue?.to !== undefined ||
      debouncedSearch !== ""
    );
  };
  useEffect(() => {
    if (showMap) {
      fetchAllPropertiesForMap();
    }
  }, [
    showMap,
    debouncedSearch,
    selectedCounty,
    selectedState,
    selectedOwnerType,
    selectedPropertyType,
    selectedOwnerOccupancy,
    selectedSaleDates,
    selectedYearBuilt,
    selectedEstimatedValue,
    fetchAllPropertiesForMap,
  ]);
  const clearAllFilters = () => {
    setSelectedCounty([]);
    setSelectedState([]);
    setSelectedOwnerType([]);
    setSelectedPropertyType([]);
    setSelectedOwnerOccupancy([]);
    setSelectedSaleDates([]);
    setSelectedYearBuilt({ from: undefined, to: undefined });
    setSelectedEstimatedValue({ from: undefined, to: undefined });
    setSearchInput("");
    setCurrentPage(1);
    localStorage.removeItem("selectedCounties");
    localStorage.removeItem("selectedStates");
    localStorage.removeItem("selectedOwnerTypes");
    localStorage.removeItem("selectedPropertyTypes");
    localStorage.removeItem("selectedOwnerOccupancy");
    localStorage.removeItem("selectedSaleDates");
    localStorage.removeItem("selectedYearBuilt");
    localStorage.removeItem("selectedEstimatedValue");
  };
  console.log("properties:", properties);
  return (
    <>
      <div className="text-center py-5 p-0"></div>
    
      {showMap && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg">
                <LoadingSpinner />
                <p className="mt-4 text-center">Loading map view...</p>
              </div>
            </div>
          }
        >
          <PropertyListingMap
            properties={
              allMapProperties.length > 0 ? allMapProperties : properties
            }
            totalCount={mapTotalCount}
            loading={mapLoading}
            onClose={toggleMapView}
            onRefresh={fetchAllPropertiesForMap}
          />
        </Suspense>
      )}
      <div className="mx-4 md:mx-20">
        <div className="flex items-center space-x-2 my-3 flex-1">
          <Button
            onClick={toggleMapView}
            disabled={mapLoading}
            className="hidden md:flex h-12 w-full text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200"
          >
            {mapLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                <span>Loading Map...</span>
              </>
            ) : (
              <>
                <MapIcon size={18} className="mr-2" />
                <span>
                  {/* Dynamic text based on whether filters are applied */}
                  {hasActiveFilters()
                    ? "View Filtered Properties on Map"
                    : "Explore All Properties on Map"}
                </span>
              </>
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between mx-auto mb-4">
          <div className="flex items-center space-x-2 flex-1  gap-3 md:flex flex-col md:flex-row md:w-full">
            <Input
              type="text"
              className="h-12 placeholder:text-gray-500 font-medium"
              placeholder="Search by address"
              value={searchInput}
              onChange={handleSearch}
            />

            {/* Download dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={properties.length === 0}
                className=" md:w-fit w-full"
              >
                <div className="h-12 bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200">
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
            {/* Items per page dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={properties.length === 0}
                className="md:w-[200px] w-full"
              >
                <div className="h-12 bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200">
                  {itemsPerPage} per page
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleItemsPerPageChange(100)}
                  className={itemsPerPage === 15 ? "bg-gray-100" : ""}
                >
                  100 per page
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleItemsPerPageChange(15)}
                  className={itemsPerPage === 15 ? "bg-gray-100" : ""}
                >
                  15 per page
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleItemsPerPageChange(25)}
                  className={itemsPerPage === 25 ? "bg-gray-100" : ""}
                >
                  25 per page
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleItemsPerPageChange(35)}
                  className={itemsPerPage === 35 ? "bg-gray-100" : ""}
                >
                  35 per page
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
              selectedSaleDates.length > 0 ||
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
                options={allStates.map((state) => ({ label: state, value: state }))}
                placeholder="Select State"
                onChange={(states) => setSelectedState(states)}
                selectedValues={selectedState}
                buttonWidth="w-full"
              />
            </Suspense>

            <Suspense fallback={<Skeleton className="h-12" />}>
              <MultiSelector
                options={allCounties.map((county) => ({ label: county, value: county }))}
                placeholder="Select County"
                onChange={(counties) => setSelectedCounty(counties)}
                selectedValues={selectedCounty}
                buttonWidth="w-full"
              />
            </Suspense>
            
            {/* Temporarily disabled sale date filter
            <Suspense fallback={<Skeleton className="h-12" />}>
              <MultiSelector
                options={allSaleDates.map((date) => ({ label: date, value: date }))}
                placeholder="Select Sale Dates"
                onChange={(dates) => setSelectedSaleDates(dates)}
                selectedValues={selectedSaleDates}
                buttonWidth="w-full"
              />
            </Suspense>
            */}
            
            <Suspense fallback={<Skeleton className="h-12" />}>
              <MultiSelector
                options={allPropertyTypes.map((type) => ({ label: type, value: type }))}
                placeholder="Select Property Type"
                onChange={(types) => setSelectedPropertyType(types)}
                selectedValues={selectedPropertyType}
                buttonWidth="w-full"
              />
            </Suspense>
            

            <div className="p-3 border-gray-200 border rounded-md">
              <div>Year Built</div>
              <div className="flex flex-row">
                <Input
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = value ? parseInt(value) : undefined;
                    console.log('Year Built From change:', { value, numValue });
                    setSelectedYearBuilt((prevState) => {
                      const newState = {
                        ...prevState,
                        from: value || undefined
                      };
                      console.log('New Year Built state:', newState);
                      return newState;
                    });
                    localStorage.setItem(
                      "selectedYearBuilt",
                      JSON.stringify({
                        ...selectedYearBuilt,
                        from: value || undefined
                      })
                    );
                  }}
                  value={selectedYearBuilt.from || ""}
                  type="number"
                  placeholder="E.g 1996"
                  max={2100}
                  min={1900}
                />
                <div className="p-1 font-bold">-</div>
                <Input
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = value ? parseInt(value) : undefined;
                    console.log('Year Built To change:', { value, numValue });
                    setSelectedYearBuilt((prevState) => {
                      const newState = {
                        ...prevState,
                        to: value || undefined
                      };
                      console.log('New Year Built state:', newState);
                      return newState;
                    });
                    localStorage.setItem(
                      "selectedYearBuilt",
                      JSON.stringify({
                        ...selectedYearBuilt,
                        to: value || undefined
                      })
                    );
                  }}
                  value={selectedYearBuilt.to || ""}
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
                    const value = e.target.value;
                    console.log('Estimated Value From change:', { 
                      value, 
                      type: typeof value,
                      parsedValue: value ? parseFloat(value) : undefined 
                    });
                    setSelectedEstimatedValue((prevState) => {
                      const newState = {
                        ...prevState,
                        from: value || undefined,
                      };
                      console.log('New Estimated Value state:', newState);
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
                    const value = e.target.value;
                    console.log('Estimated Value To change:', { 
                      value, 
                      type: typeof value,
                      parsedValue: value ? parseFloat(value) : undefined 
                    });
                    setSelectedEstimatedValue((prevState) => {
                      const newState = {
                        ...prevState,
                        to: value || undefined,
                      };
                      console.log('New Estimated Value state:', newState);
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
                        onPageChange: handlePageChange,
                      }}
                      onSortChanged={handleSortChanged} // Add the sort handler
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
