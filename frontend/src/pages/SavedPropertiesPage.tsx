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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useUser } from "../hooks/useUser";

const SavedPropertiesPage = () => {
  const [savedProperties, setSavedProperties] = useState<PropertyDetails[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [loadingPropertyId, setLoadingPropertyId] = useState<string | null>(
    null
  ); // Track the property being unsaved
  const [rowsToShow, setRowsToShow] = useState(10);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();

  const fetchSavedProps = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/saved-properties`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSavedProperties(res.data.properties);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSavedProps();
  }, []);

  console.log(savedProperties);

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
        `${process.env.REACT_APP_API_BASE_URL}/property/unsave`,
        { propertyId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
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
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            savedProperties: prevUser.savedProperties.filter(
              (id) => id !== propertyId // Remove from savedProperties list
            ),
          };
        }
        return prevUser;
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
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="border border-gray-300 min-w-[150px] max-w-[150px]">
                  Actions
                </TableHead>
                <TableHead className="border border-gray-300 min-w-[200px] max-w-[200px]">
                  Address
                </TableHead>
                <TableHead className="border border-gray-300 min-w-[180px] max-w-[180px]">
                  Mortgage Balance
                </TableHead>
                <TableHead className="border border-gray-300 min-w-[180px] max-w-[180px]">
                  Tax Assessed Value
                </TableHead>
                <TableHead className="border border-gray-300 min-w-[180px] max-w-[180px]">
                  Estimated Value
                </TableHead>
                <TableHead className="border border-gray-300 min-w-[180px] max-w-[180px]">
                  Parcel Number
                </TableHead>
                <TableHead className="border border-gray-300 min-w-[150px] max-w-[150px]">
                  Owner Occupancy
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredProperties.length > 0 ? (
                filteredProperties.slice(0, rowsToShow).map((property) => (
                  <TableRow
                    key={property._id as string}
                    className="cursor-pointer"
                  >
                    <TableCell className="border border-gray-300 min-w-[150px] max-w-[150px]">
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
                    </TableCell>
                    <TableCell
                      className="border border-gray-300 min-w-[200px] max-w-[200px] truncate"
                      onClick={() =>
                        navigate(`/property-details/${property?.ID}`)
                      }
                    >
                      {property?.MAIL_ADDRESS_STREET}
                    </TableCell>
                    <TableCell
                      className="border border-gray-300 min-w-[180px] max-w-[180px] truncate"
                      onClick={() =>
                        navigate(`/property-details/${property?.ID}`)
                      }
                    >
                      {property["Opening Bid/Mortgage Balance"] || "-"}
                    </TableCell>
                    <TableCell
                      className="border border-gray-300 min-w-[180px] max-w-[180px] truncate"
                      onClick={() =>
                        navigate(`/property-details/${property?.ID}`)
                      }
                    >
                      {property?.ASSESSED_VALUE}
                    </TableCell>
                    <TableCell
                      className="border border-gray-300 min-w-[180px] max-w-[180px] truncate"
                      onClick={() =>
                        navigate(`/property-details/${property?.ID}`)
                      }
                    >
                      {property?.ESTIMATED_VALUE}
                    </TableCell>
                    <TableCell
                      className="border border-gray-300 min-w-[180px] max-w-[180px] truncate"
                      onClick={() =>
                        navigate(`/property-details/${property?.ID}`)
                      }
                    >
                      {property["Parcel Number"]}
                    </TableCell>
                    <TableCell
                      className="border border-gray-300 min-w-[150px] max-w-[150px] truncate"
                      onClick={() =>
                        navigate(`/property-details/${property?.ID}`)
                      }
                    >
                      <Badge variant={"outline"}>
                        {property?.OWNER_OCCUPANCY}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No matching properties found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
