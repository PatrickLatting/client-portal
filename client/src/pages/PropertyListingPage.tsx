import { useContext } from "react";
import { UserContext } from "../App";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import PropertyListingTable from "../components/propertyListing/PropertyLisitingTable";

const PropertyListingPage = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      <div className="text-center w-full bg-gray-800 text-white py-10">
        <h1 className="md:text-5xl text-3xl">Welcome {user.name}</h1>
      </div>
      <div className="text-center py-10">
        <h2 className="text-3xl font-semibold">
          Search for Georgie, Tennese, and Virginia forclosures
        </h2>
        <p className="text-xl my-4">
          We offer most comprehensive forclosure database in the world. <br />
          Find, research, get images, and bid remotely.
        </p>
      </div>
      <div className="mx-20 md:w-10/12 ">
        <div className="flex   items-center space-x-2 mx-auto">
          <Input type="text" placeholder="Search" />
          <Button>Search</Button>
        </div>
        <div className="my-10">
          <PropertyListingTable />
        </div>
      </div>
    </>
  );
};

export default PropertyListingPage;
