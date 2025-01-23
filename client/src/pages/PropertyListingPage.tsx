import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import MultiSelector from "../components/propertyListing/MultiSelect";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import PropertyListingTable from "../components/propertyListing/PropertyLisitingTable";
import { useUser } from "../hooks/useUser";
import axios from "axios";
import PaginationControls from "../components/propertyListing/PaginationControls";
import { TableSkeleton } from "../components/ui/skeleton";


const PropertyListingPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [allCounties, setAllCounties] = useState<
    { label: string; value: string }[]
  >([]);
  const [allOwnerTypes, setAllOwnnerTypes] = useState<
    { label: string; value: string }[]
  >([]);
  const [allPropertyTypes, setAllPropertyTypes] = useState<
    { label: string; value: string }[]
  >([]);
  const [allStates, setAllStates] = useState<
    { label: string; value: string }[]
  >([]);

  const [selectedCounty, setSelectedCounty] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string[]>([]);
  const [selectedOwnerType, setSelectedOwnerType] = useState<string[]>([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string[]>(
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  interface Property {
    ADDRESS_FROM_INPUT: string;
    ID: number;
    ASSESSED_VALUE: number;
    County: string;
    Address: string;
    [key: string]: any;
  }

  const fetchProperties = async (
    search: string,
    counties: string[],
    states: string[],
    ownerTypes: string[],
    propertyTypes: string[],
    page: number = 1
  ) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        page: page.toString(),
        ...(counties.length && { county: counties.join(",") }),
        ...(states.length && { state: states.join(",") }),
        ...(ownerTypes.length && { ownerType: ownerTypes.join(",") }),
        ...(propertyTypes.length && { propertyType: propertyTypes.join(",") }),
      });

      const res = await axios.get(
        `http://localhost:8080/get-properties?${queryParams}`
      );

      setProperties(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      setCurrentPage(page);

      // Update filter options
      setAllCounties(
        res.data.allCounties
          .filter((county: string) => county !== null)
          .map((county: string) => ({
            label: county,
            value: county,
          }))
      );
      setAllOwnnerTypes(
        res.data.allOwnerTypes
          .filter((ownerType: string) => ownerType !== null)
          .map((ownerType: string) => ({
            label: ownerType,
            value: ownerType,
          }))
      );
      setAllPropertyTypes(
        res.data.allPropertyTypes
          .filter((propertyType: string) => propertyType !== null)
          .map((propertyType: string) => ({
            label: propertyType,
            value: propertyType,
          }))
      );
      setAllStates(
        res.data.allStates
          .filter((state: string) => state !== null)
          .map((state: string) => ({
            label: state,
            value: state,
          }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const { user } = useUser();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    fetchProperties(
      debouncedSearch,
      selectedCounty,
      selectedState,
      selectedOwnerType,
      selectedPropertyType
    );
  }, [
    debouncedSearch,
    selectedCounty,
    selectedState,
    selectedOwnerType,
    selectedPropertyType,
  ]);

  const handleSearch = (e: { target: { value: string } }) => {
    setSearchInput(e.target.value);
  };

  const handleCountyChange = (selectedValues: string[]) => {
    setSelectedCounty(selectedValues);
  };

  const handleStateChange = (selectedValues: string[]) => {
    setSelectedState(selectedValues);
  };

  const handleOwnerTypeChange = (selectedValues: string[]) => {
    setSelectedOwnerType(selectedValues);
  };

  const handlePropertyTypeChange = (selectedValues: string[]) => {
    setSelectedPropertyType(selectedValues);
  };

  const downloadCSV = () => {
    if (properties.length === 0) {
      alert("No data available to download.");
      return;
    }

    const header = Object.keys(properties[0]);
    const csv = Papa.unparse({
      fields: header,
      data: properties,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "filtered_properties.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadXLS = () => {
    if (properties.length === 0) {
      alert("No data available to download.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(properties);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered_Properties");
    XLSX.writeFile(workbook, "filtered_properties.xlsx");
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
      <div className="mx-4   md:mx-20">
        <div className="flex items-center space-x-2 mx-auto">
          <Input
            type="text"
            className="h-12 placeholder:text-gray-500 font-medium"
            placeholder="Search by county or address"
            value={searchInput}
            onChange={(e) => handleSearch(e)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div>
                <Button className="h-12">Download</Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={downloadCSV}>.CSV</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={downloadXLS}>.XLS</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="my-10 flex flex-wrap lg:flex-nowrap justify-between gap-6">
          <div className="w-full lg:w-1/5 space-y-6">
            <MultiSelector
              options={allCounties}
              placeholder="Select County"
              onChange={handleCountyChange}
              buttonWidth="w-full"
            />
            <MultiSelector
              options={allStates}
              placeholder="Select State"
              onChange={handleStateChange}
              buttonWidth="w-full"
            />
            <MultiSelector
              options={allPropertyTypes}
              placeholder="Select Property Type"
              onChange={handlePropertyTypeChange}
              buttonWidth="w-full"
            />
            <MultiSelector
              options={allOwnerTypes}
              placeholder="Select Owner Type"
              onChange={handleOwnerTypeChange}
              buttonWidth="w-full"
            />
          </div>
          <div className="w-full lg:w-3/4">
            {loading ? (
              <div>
              <TableSkeleton rows={15} columns={4} className="my-4" />
              </div>
            ) : properties.length > 0 ? (
              <>
                <PropertyListingTable data={properties} />
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(newPage: number) =>
                    fetchProperties(
                      debouncedSearch,
                      selectedCounty,
                      selectedState,
                      selectedOwnerType,
                      selectedPropertyType,
                      newPage
                    )
                  }
                />
              </>
            ) : (
              <p className="text-center text-gray-500">No properties found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyListingPage;
