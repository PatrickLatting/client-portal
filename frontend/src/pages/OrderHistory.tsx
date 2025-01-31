import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useUser } from "../hooks/useUser";
import { useState } from "react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const OrderHistory = () => {
  const { user } = useUser();
  const [searchInput, setSearchInput] = useState(""); // State for search input
  const [rowsToShow, setRowsToShow] = useState(10);

  if (!user) {
    return <div>Data not found</div>;
  }

  // Handle search functionality
  const filteredActions = user.propertiesActions.filter((action) => {
    const searchTerm = searchInput.toLowerCase();
    return (
      action.address.toLowerCase().includes(searchTerm) ||
      action.actionType.toLowerCase().includes(searchTerm) ||
      (action.bidAmount && action.bidAmount.toString().includes(searchTerm)) ||
      (action.updated && action.updated.toString().includes(searchTerm))
    );
  });

  const handleSeeMore = () => {
    setRowsToShow(rowsToShow + rowsToShow);
  };

  return (
    <div className="p-4 m-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Action History for this Property
      </h2>

      <div className="mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
          placeholder="Search by address"
        />
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <Table className="">
          <TableHeader className="font-semibold bg-[#fafafa]">
            <TableRow>
              <TableCell className="border border-gray-300">Address</TableCell>
              <TableCell className="border border-gray-300">
                Action Type
              </TableCell>
              <TableCell className="border border-gray-300">
                Bid Amount
              </TableCell>
              <TableCell className="border border-gray-300">
                Date & Time
              </TableCell>
              <TableCell className="border border-gray-300">Updated</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="min-w-56 overflow-y-auto">
            {filteredActions.length > 0 ? (
              filteredActions.slice(0, rowsToShow).map((action) => (
                <TableRow key={action._id as string}>
                  <TableCell className="border border-gray-300">
                    {action.address}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {action.actionType === "imageRequest"
                      ? "Image Request"
                      : "Bid"}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {action.bidAmount}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {formatDate(action.date)}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {action.updated ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No actions for this property
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {filteredActions.length > rowsToShow && (
          <div className="m-4 text-center">
            <Button onClick={handleSeeMore} variant={"outline"}>
              See More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;