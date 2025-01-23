// src/components/ExcelViewer/ExcelViewer.tsx

import React from "react";
import { ExcelViewerProps } from "./types";
import { Link } from "react-router-dom";

const ExcelViewer: React.FC<ExcelViewerProps> = ({
  data,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading data...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-4">No data available</div>;
  }

  // Get headers from the first data item
  const headers = Object.keys(data[0]).filter((key) => key !== "id");
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              {headers.map((header) => (
                <td
                  key={`${row.id}-${header}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  <Link to={`/property-details/${row.ID}`}>
                    {row[header]?.toString() || ""}
                  </Link>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelViewer;
