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
import { downloadFile } from "../utils/downloadFiles";
import { useToast } from "../hooks/use-toast";
import { PropertyDetails } from "../types/propertyTypes";
import { useUser } from "../hooks/useUser";
import PropertyTable from "../components/propertyListing/PropertyTable";


const SavedPropertiesPage = () => {
  const [savedProperties, setSavedProperties] = useState<PropertyDetails[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [loadingPropertyId, setLoadingPropertyId] = useState<string | null>(null);
  const { toast } = useToast();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const fetchSavedProps = async () => {
    setIsLoading(true);
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
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProps();
  }, []);

  const filteredProperties = savedProperties.filter((property) => {
    const searchTerm = searchInput.toLowerCase();
    return (
      property?.Address?.toLowerCase().includes(searchTerm) ||
      property["Parcel Number"]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm)
    );
  });

  const unsaveProperty = async (propertyId: string) => {
    setLoadingPropertyId(propertyId);
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
              (id) => id !== propertyId
            ),
          };
        }
        return prevUser;
      });
    } catch (err) {
      console.error("Error unsaving property:", err);
    } finally {
      setLoadingPropertyId(null);
    }
  };

  return (
    <div className="my-10">
      <div className="mx-4 md:mx-20">
        <div className="flex items-center space-x-2 mx-auto mb-8">
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

        <PropertyTable
          data={filteredProperties}
          onUnsave={unsaveProperty}
          loadingPropertyId={loadingPropertyId}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default SavedPropertiesPage;