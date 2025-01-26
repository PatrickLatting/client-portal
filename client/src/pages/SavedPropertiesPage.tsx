import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { downloadFile } from "../utils/downloadFiles";
import { useToast } from "../hooks/use-toast";
import { PropertyDetails } from "../types/propertyTypes";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";

const SavedPropertiesPage = () => {
  const [savedProperties, setSavedProperties] = useState<PropertyDetails[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [loadingPropertyId, setLoadingPropertyId] = useState<string | null>(
    null
  ); // Track the property being unsaved
  const [rowsToShow, setRowsToShow] = useState(10);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchSavedProps = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/saved-properties`,
        { withCredentials: true }
      );
      setSavedProperties(res.data.properties);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSavedProps();
  }, []);

  const filteredProperties = savedProperties.filter((property) => {
    const searchTerm = searchInput.toLowerCase();
    return (
      property?.MAIL_ADDRESS_STREET?.toLowerCase().includes(searchTerm) ||
      property["Opening Bid/Mortgage Balance"]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm) ||
      property?.ASSESSED_VALUE?.toString().toLowerCase().includes(searchTerm) ||
      property?.ESTIMATED_VALUE?.toString()
        .toLowerCase()
        .includes(searchTerm) ||
      property["Parcel Number"]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm) ||
      property?.OWNER_OCCUPANCY?.toLowerCase().includes(searchTerm)
    );
  });

  const unsaveProperty = async (propertyId: string) => {
    setLoadingPropertyId(propertyId); // Set the current property ID as loading
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/property/unsave`,
        { propertyId },
        { withCredentials: true }
      );
      toast({
        title: "✅ Property unsaved successfully",
        variant: "default",
      });
      setSavedProperties((prevState) => {
        if (prevState) {
          return [...prevState.filter((prop) => prop?._id !== propertyId)];
        }
        return [];
      });
    } catch (err) {
      console.error("Error unsaving property:", err);
    } finally {
      setLoadingPropertyId(null); // Reset the loading state
    }
  };

  const handleSeeMore = () => {
    setRowsToShow(rowsToShow + rowsToShow);
  };

  return (
    <div className="my-10">
      <div className="mx-4 md:mx-20">
        <div className="flex items-center space-x-2 mx-auto">
          <Input
            type="text"
            className="h-12 placeholder:text-gray-500 font-medium"
            placeholder="Type here to search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div>
                <Button className="h-12">Download</Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => downloadFile(filteredProperties, "CSV")}
              >
                .CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => downloadFile(filteredProperties, "XLS")}
              >
                .XLS
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="my-8 overflow-x-auto rounded-lg border border-gray-300">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-[#fafafa]">
              <tr>
                <th className="border border-gray-300 p-2 w-[150px]">
                  Actions
                </th>
                <th className="border border-gray-300 p-2 w-[200px]">
                  Address
                </th>
                <th className="border border-gray-300 p-2 w-[180px]">
                  Mortgage Balance
                </th>
                <th className="border border-gray-300 p-2 w-[180px]">
                  Tax Assessed Value
                </th>
                <th className="border border-gray-300 p-2 w-[180px]">
                  Estimated Value
                </th>
                <th className="border border-gray-300 p-2 w-[180px]">
                  Parcel Number
                </th>
                <th className="border border-gray-300 p-2 w-[150px]">
                  Owner Occupancy
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length > 0 ? (
                filteredProperties.slice(0, rowsToShow).map((property) => (
                  <tr key={property._id as string} className="cursor-pointer">
                    <td className="border border-gray-300 p-2 w-[150px]">
                      <Button
                        variant={"outline"}
                        className="w-full truncate"
                        onClick={() => unsaveProperty(property?._id as string)}
                      >
                        {loadingPropertyId === property._id ? (
                          <>
                            Unsaving...{" "}
                            <Loader2 className="animate-spin ml-1" />
                          </>
                        ) : (
                          "Unsave"
                        )}
                      </Button>
                    </td>
                    <td
                      className="border border-gray-300 p-2 w-[200px] truncate"
                      title={property?.MAIL_ADDRESS_STREET} // Shows full content on hover
                      onClick={() =>
                        navigate(`/property-details/${property?.ID}`)
                      }
                    >
                      {property?.MAIL_ADDRESS_STREET}
                    </td>
                    <td
                      className="border border-gray-300 p-2 w-[180px] truncate"
                      title={
                        property["Opening Bid/Mortgage Balance"] !== undefined
                          ? property["Opening Bid/Mortgage Balance"].toString()
                          : ""
                      }
                      onClick={() =>
                        navigate(`/property-details/${property?.ID}`)
                      }
                    >
                      {property["Opening Bid/Mortgage Balance"] || "-"}
                    </td>
                    <td
                      className="border border-gray-300 p-2 w-[180px] truncate"
                      title={
                        property?.ASSESSED_VALUE.toString !== undefined
                          ? property?.ASSESSED_VALUE.toString()
                          : ""
                      }
                      onClick={() =>
                        navigate(`/property-details/${property?.ID}`)
                      }
                    >
                      {property?.ASSESSED_VALUE}
                    </td>
                    <td
                      className="border border-gray-300 p-2 w-[180px] truncate"
                      title={
                        property?.ESTIMATED_VALUE !== undefined
                          ? property.ESTIMATED_VALUE.toString()
                          : ""
                      }
                      onClick={() =>
                        navigate(`/property-details/${property?.ID}`)
                      }
                    >
                      {property?.ESTIMATED_VALUE}
                    </td>
                    <td
                      className="border border-gray-300 p-2 w-[180px] truncate"
                      title={property["Parcel Number"]}
                      onClick={() =>
                        navigate(`/property-details/${property?.ID}`)
                      }
                    >
                      {property["Parcel Number"]}
                    </td>
                    <td
                      className="border border-gray-300 p-2 w-[150px] truncate"
                      title={property?.OWNER_OCCUPANCY}
                      onClick={() =>
                        navigate(`/property-details/${property?.ID}`)
                      }
                    >
                      <Badge variant={"outline"}>
                        {property?.OWNER_OCCUPANCY}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="border border-gray-300 p-2 text-center"
                  >
                    No matching properties found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredProperties.length > rowsToShow && (
          <div className="mt-4 text-center">
            <Button onClick={handleSeeMore}>See More</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPropertiesPage;
