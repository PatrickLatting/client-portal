import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

interface Props {
  propertyId: unknown;
}

const ActionHistoryTable = ({ propertyId }: Props) => {
  const { user } = useUser();
  const [rowsToShow, setRowsToShow] = useState(5);

  if (!user) {
    return <div>Data not found</div>;
  }

  const filteredActions = user.propertiesActions.filter(
    (action) => action?.propertyId === propertyId
  );

  const handleSeeMore = () => {
    setRowsToShow(rowsToShow + rowsToShow);
  };

  return (
    <div className="p-4 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Action History for this Property
      </h2>

      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <Table>
          <TableHeader className="font-semibold bg-[#fafafa]">
            <TableRow>
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
          <TableBody>
            {filteredActions.length > 0 ? (
              filteredActions.slice(0, rowsToShow).map((action) => (
                <TableRow key={action?._id as string}>
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
                <TableCell colSpan={4} className="text-center">
                  No actions for this property
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {filteredActions.length > rowsToShow && (
        <div className="mt-4 text-center">
          <Button onClick={handleSeeMore} variant={"outline"}>
            See More
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActionHistoryTable;
