"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  ValueFormatterParams,
  RowClickedEvent
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

interface GridData {
  [key: string]: string | number | boolean | null | undefined;
}

interface DynamicGridProps {
  data: GridData[];
}

const PropertyListingTable: React.FC<DynamicGridProps> = ({ data }) => {
  const navigate = useNavigate();

  const generateColDefs = (data: GridData[]): ColDef[] => {
    if (data.length === 0) return [];

    const headers = Array.from(
      new Set(data.flatMap((item) => Object.keys(item)))
    ).filter((header) => header !== "_id");

    return headers.map((header) => ({
      field: header,
      headerName: header,
      flex: 1,
      minWidth:
        header === "ADDRESS_FROM_INPUT" ||
        header === "ASSESSED_IMPROVEMENT_VALUE"
          ? 350
          : 200,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value === null || params.value === undefined) return "-";
        if (typeof params.value === "boolean") {
          return params.value.toString();
        }
        return params.value.toString();
      },
    }));
  };

  const defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    minWidth: 220,
  };

  const handleRowClick = (event: RowClickedEvent<GridData>) => {
    const rowData = event.data?.ID;
    console.log("Row clicked:", rowData);
    if (rowData) {
     
      navigate(`/property-detail/${rowData}`);
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
    <div className="w-full h-[76vh] bg-white rounded-xl border">
      <AgGridReact
        rowData={data}
        columnDefs={generateColDefs(data)}
        defaultColDef={defaultColDef}
        className="w-full rounded-xl ag-theme-alpine"
        onRowClicked={handleRowClick}
      />
    </div>
  );
};

export default PropertyListingTable;