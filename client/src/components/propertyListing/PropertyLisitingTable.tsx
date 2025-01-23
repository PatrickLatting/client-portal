import React from "react";
import "tailwindcss/tailwind.css";

interface PropertyData {
  [key: string]: string | number | boolean | null | undefined;
}

const PropertyListingTable: React.FC<{ data: PropertyData[] }> = ({ data }) => {
  if (data.length === 0) {
    return <p className="text-gray-500 text-center">No data available</p>;
  }

  const headers = Array.from(
    new Set(data.flatMap((item) => Object.keys(item)))
  ).filter((header) => header !== "_id");

  const getColumnClass = (header: string) => {
    if (header === "Notice Identification") {
      return "px-6 border text-left text-sm font-medium text-gray-500 uppercase tracking-wider max-w-48";
    }
    return "px-6 border text-left text-sm font-medium text-gray-500 uppercase tracking-wider";
  };

  return (
    <div className="w-full max-w-full overflow-x-auto">
      <div className="overflow-y-auto rounded-xl border">
        <table className="min-w-full bg-white rounded-3xl">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header) => (
                <th key={header} className={getColumnClass(header)}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border border-gray-200">
                  {headers.map((header) => (
                    <td
                      key={header}
                      className={`px-4 py-2 border text-gray-600 truncate ${
                        header === "Notice Identification" ||
                        header === "Notice Content" ||
                        header === "Parcel Number"
                          ? "max-w-md "
                          : ""
                      }`}
                    >
                      {row[header] !== undefined && row[header] !== null
                        ? row[header].toString()
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <h2>No Data Available</h2>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyListingTable;
