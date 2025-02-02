import React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  ValueFormatterParams,
  RowClickedEvent,
} from "ag-grid-community";
import { useNavigate } from "react-router-dom";
import { PropertyDetails } from "../../types/propertyTypes";
import { themeQuartz } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

interface DynamicGridProps {
  data: PropertyDetails[];
  selectedColumns: string[];
}
// const myTheme = themeQuartz.withParams({
//   /* Low spacing = very compact */
//   spacing: 2,
//   /* Changes the color of the grid text */
//   foregroundColor: 'rgb(14, 68, 145)',
//   /* Changes the color of the grid background */
//   backgroundColor: 'rgb(241, 247, 255)',
//   /* Changes the header color of the top row */
//   headerBackgroundColor: 'rgb(228, 237, 250)',
//   /* Changes the hover color of the row*/
//   rowHoverColor: 'rgb(216, 226, 255)',
//   rowBorder : '1px solid rgb(14, 68, 145)',
// });
const PropertyListingTable: React.FC<DynamicGridProps> = ({
  data,
  selectedColumns,
}) => {
  const navigate = useNavigate();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const valueFormatter = (params: ValueFormatterParams, columnName: string) => {
    if (params.value === null || params.value === undefined) return "-";

    if (typeof params.value === "number") {
      // Currency formatting for specific columns
      if (
        columnName.includes("VALUE") ||
        columnName.includes("AMOUNT") ||
        columnName.includes("EQUITY") ||
        columnName.includes("MORTGAGE")
      ) {
        return formatCurrency(params.value);
      }
      // Regular number formatting for other numeric columns
      return formatNumber(params.value);
    }

    if (typeof params.value === "boolean") {
      return params.value ? "Yes" : "No";
    }

    return params.value.toString();
  };

  const generateColDefs = (): ColDef[] => {
    if (!data.length || !selectedColumns.length) return [];

    return selectedColumns.map((colName) => ({
      field: colName,
      headerName: colName
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" "),
      flex: 1,
      minWidth: 190,
      valueFormatter: (params: ValueFormatterParams) =>
        valueFormatter(params, colName),
      sortable: true,
      filter: false,
      resizable: true,
    }));
  };

  const handleRowClick = (event: RowClickedEvent) => {
    const rowData = event.data?.ID;
    if (rowData) {
      navigate(`/property-details/${rowData}`);
    }
  };

  if (!data?.length) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white rounded-xl border">
      <AgGridReact
        rowData={data}
        columnDefs={generateColDefs()}
        className="w-full h-full rounded-xl ag-theme-alpine"
        onRowClicked={handleRowClick}
        // pagination={true}
        // theme={myTheme}
        paginationPageSize={25}
      />
    </div>
  );
};

export default PropertyListingTable;
