'use client';

import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule, ValueFormatterParams } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

interface GridData {
  [key: string]: string | number | boolean | null | undefined;
}

interface DynamicGridProps {
  data: GridData[];
}

const PropertyListingTable: React.FC<DynamicGridProps> = ({ data }) => {
  const generateColDefs = (data: GridData[]): ColDef[] => {
    if (data.length === 0) return [];

    const headers = Array.from(
      new Set(data.flatMap(item => Object.keys(item)))
    ).filter(header => header !== '_id');

    return headers.map(header => ({
      field: header,
      headerName: header,
      flex: 1,
      minWidth: header === 'ADDRESS_FROM_INPUT' || header === 'ASSESSED_IMPROVEMENT_VALUE' ? 350 : 200,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value === null || params.value === undefined) return '-';
        if (typeof params.value === 'boolean') {
          return params.value.toString();
        }
        return params.value.toString();
      }
    }));
  };

  const defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    minWidth: 220
  };

  if (!data?.length) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full  h-[76vh] bg-white rounded-xl border">
      <AgGridReact
        rowData={data}
        columnDefs={generateColDefs(data)}
        defaultColDef={defaultColDef}
       
        className="w-full rounded-xl ag-theme-alpine"
      />
    </div>
  );
};

export default PropertyListingTable;