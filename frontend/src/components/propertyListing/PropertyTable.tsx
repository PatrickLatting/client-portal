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
import { Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { PropertyDetails } from "../../types/propertyTypes";

ModuleRegistry.registerModules([AllCommunityModule]);

interface PropertyTableProps {
  data: PropertyDetails[] | undefined;
  onUnsave?: (propertyId: string) => void;
  loadingPropertyId?: string | null;
  isLoading?: boolean;
}

const PropertyTable: React.FC<PropertyTableProps> = ({
  data,
  onUnsave,
  loadingPropertyId,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  // Loading skeleton component
  const TableSkeleton = () => {
    return (
      <div className="w-full h-[600px] bg-white rounded-xl border p-4">
        <div className="space-y-4">
          {/* Header skeleton */}
          <div className="grid grid-cols-6 gap-4 py-3 border-b-2 border-gray-100">
            {[...Array(6)].map((_, i) => (
              <div 
                key={`header-${i}`} 
                className="h-6 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
          
          {/* Rows skeleton */}
          {[...Array(8)].map((_, rowIndex) => (
            <div 
              key={`row-${rowIndex}`} 
              className="grid grid-cols-6 gap-4 py-4 border-b border-gray-100"
            >
              {[...Array(6)].map((_, colIndex) => (
                <div 
                  key={`cell-${rowIndex}-${colIndex}`} 
                  className="h-4 bg-gray-100 rounded animate-pulse"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const valueFormatter = (params: ValueFormatterParams) => {
    if (params.value === null || params.value === undefined) return "-";

    if (typeof params.value === "number") {
      if (
        params.column.getColId().includes("VALUE") ||
        params.column.getColId().includes("BALANCE")
      ) {
        return formatCurrency(params.value);
      }
      return params.value.toString();
    }

    return params.value.toString();
  };

  const actionsCellRenderer = (params: any) => {
    return (
      <div className="flex items-center justify-center py-3">
        <Button
          variant="outline"
          size="sm"
          className="min-w-[100px] bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onUnsave && onUnsave(params.data._id);
          }}
        >
          {loadingPropertyId === params.data._id ? (
            <div className="flex items-center gap-2">
              <span>Unsaving</span>
              <Loader2 className="animate-spin h-4 w-4" />
            </div>
          ) : (
            "Unsave"
          )}
        </Button>
      </div>
    );
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: actionsCellRenderer,
      width: 150,
      sortable: false,
      filter: false,
      cellStyle: { 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px'
      },
      suppressNavigable: true,
    },
    {
      headerName: "Address",
      field: "Address",
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "State",
      field: "State",
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "County",
      field: "County",
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Property Type",
      field: "LAND_USE",
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Principal Amount Owed",
      field: "Principal Amount Owed",
      valueFormatter,
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: "Estimated Value",
      field: "Zestimate",
      valueFormatter,
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: "Foreclosure Sale Date",
      field: "Foreclosure Sale Date",
      valueFormatter,
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: "Parcel Number",
      field: "Parcel Number",
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: "Year Built",
      field: "Year Built",
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: "Bedrooms",
      field: "Bedrooms",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Bathrooms",
      field: "Bathrooms",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Stories",
      field: "Stories",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Square Feet",
      field: "SQUARE_FEET",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Lot Acres",
      field: "LOT_ACRES",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Owner Occupancy",
      field: "OWNER_OCCUPANCY",
      flex: 1,
      minWidth: 150,
    },
  ];

  const handleRowClick = (event: RowClickedEvent) => {
    console.log("Row Clicked Event:", event); // Log the entire event

    const clickedColumn = event.api.getFocusedCell()?.column;
    console.log("Clicked Column:", clickedColumn?.getColId()); // Log the clicked column ID
    if (clickedColumn?.getColId() === 'actions') {
      console.log("Click was inside the 'Actions' column. Ignoring row click.");
      return;
    }
    
    console.log("Row Data:", event.data); // Log the row data object
    const rowData = event.data?._id;

    if (rowData) {
      console.log(`Navigating to /property-details/${rowData}`);
      navigate(`/property-details/${rowData}`);
    } else {
      console.warn("No valid row ID found. Navigation not triggered.");
  }
  };

  // Show loading skeleton
  if (isLoading) {
    return <TableSkeleton />;
  }

  // Show no data message
  if (!data?.length) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-white rounded-xl border">
      <style>
        {`
          .ag-theme-alpine {
            --ag-grid-size: 4px;
            --ag-line-height: 1.5;
            --ag-cell-horizontal-padding: 16px;
            --ag-borders-row: 1px solid #f3f4f6;
            --ag-header-height: 48px;
            --ag-row-height: 56px;
          }
          .ag-header-cell {
            padding: 12px 16px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: #374151 !important;
            background: #f9fafb !important;
            border-bottom: 2px solid #e5e7eb !important;
          }
          .ag-cell {
            padding: 8px 16px !important;
            font-size: 14px !important;
            color: #111827 !important;
            line-height: 1.5 !important;
          }
          .ag-cell-focus {
            border: 1px solid #3b82f6 !important;
          }
          .ag-row {
            border-bottom: 2px solid #e5e7eb !important;
          }
          .ag-row-hover {
            background-color: #f9fafb !important;
          }
          .ag-header-row {
            background-color: #f9fafb !important;
          }
        `}
      </style>
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        className="w-full h-full rounded-xl ag-theme-alpine"
        onRowClicked={handleRowClick}
        pagination={false}
        paginationPageSize={10}
        suppressCellFocus={true}
      />
    </div>
  );
};

export default PropertyTable;