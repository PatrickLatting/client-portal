import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  ValueFormatterParams,
  RowClickedEvent,
  GridReadyEvent,
  ColumnState,
  FilterModel,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import { PropertyDetails } from '../../types/propertyTypes';
import axios from 'axios';
import { useUser } from '../../hooks/useUser';
import { IUser } from '../../types/user';

ModuleRegistry.registerModules([AllCommunityModule]);

interface DynamicGridProps {
  data: PropertyDetails[];
  selectedColumns: string[];
  onSelectionChanged?: (selectedRows: PropertyDetails[]) => void;
}

const GRID_STATE_KEY = 'propertyGridState';

interface SavedGridState {
  columnState: ColumnState[];
  filterModel: FilterModel;
  sortColumns: { colId: string; sort: 'asc' | 'desc' | null }[];
}

const PropertyListingTable: React.FC<DynamicGridProps> = ({
  data,
  selectedColumns,
  onSelectionChanged,
}) => {
  const navigate = useNavigate();
  const gridRef = React.useRef<AgGridReact>(null);
  const [selectedRows, setSelectedRows] = useState<PropertyDetails[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);


  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const valueFormatter = (params: ValueFormatterParams, columnName: string) => {
    if (params.value === null || params.value === undefined) return '-';

    if (typeof params.value === 'number') {
      if (
        columnName.includes('VALUE') ||
        columnName.includes('AMOUNT') ||
        columnName.includes('Principal') ||
        columnName.includes('EQUITY') ||
        columnName.includes('MORTGAGE')
      ) {
        return formatCurrency(params.value);
      }
      return formatNumber(params.value);
    }

    if (typeof params.value === 'boolean') {
      return params.value ? 'Yes' : 'No';
    }

    return params.value.toString();
  };

  const getValueType = (colName: string, sampleValue: any): string => {
    if (typeof sampleValue === 'number') {
      if (
        colName.includes('VALUE') ||
        colName.includes('AMOUNT') ||
        colName.includes('Principal') ||
        colName.includes('EQUITY') ||
        colName.includes('MORTGAGE')
      ) {
        return 'numericColumn';
      }
      return 'numericColumn';
    }
    if (typeof sampleValue === 'boolean') return 'booleanColumn';
    return 'textColumn';
  };

  const generateColDefs = useCallback((): ColDef[] => {
    if (!data.length || !selectedColumns.length) return [];

    return selectedColumns.map((colName) => {
      const sampleValue = data[0][colName as keyof PropertyDetails];
      const valueType = getValueType(colName, sampleValue);

      return {
        field: colName,
        headerName: colName
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' '),
        flex: 1,
        minWidth: 190,
        valueFormatter: (params: ValueFormatterParams) =>
          valueFormatter(params, colName),
        sortable: true,
        filter: false,
        resizable: true,
        type: valueType,
        checkboxSelection: colName === selectedColumns[0], // Add checkbox to first column
        headerCheckboxSelection: colName === selectedColumns[0], // Add header checkbox to first column
        comparator: (valueA, valueB) => {
          if (valueA === null || valueA === undefined) return -1;
          if (valueB === null || valueB === undefined) return 1;
          
          if (typeof valueA === 'number' && typeof valueB === 'number') {
            return valueA - valueB;
          }
          return valueA.toString().localeCompare(valueB.toString());
        },
      };
    });
  }, [data, selectedColumns]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: false,
    resizable: true,
    floatingFilter: false,
  }), []);
const { user, setUser } = useUser();
  const handleSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
    if (onSelectionChanged) {
      onSelectionChanged(selectedData);
    }
  }, [onSelectionChanged]);
  const saveProperties = async () => {
    if (selectedRows.length === 0) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/property/save-multiple`,
        { propertyIds: selectedRows.map(property => property._id) },
        { withCredentials: true }
      );
      
      setUser((prevUser: any) => {
        if (prevUser) {
          // Use Array.from() to convert Set to array instead of spread operator
          const uniqueProperties = Array.from(
            new Set([
              ...(prevUser.savedProperties || []),
              ...selectedRows.map(property => property._id)
            ])
          );
          
          return {
            ...prevUser,
            savedProperties: uniqueProperties
          };
        }
        return prevUser;
      });
      
      setSaveMessage({ type: 'success', text: `Successfully saved ${selectedRows.length} properties` });
    } catch (err) {
      console.error("Error saving properties:", err);
      setSaveMessage({ 
        type: 'error', 
        text: 'Failed to save properties. Please try again.' 
      });
    } finally {
      setIsSaving(false);
    }
  };
  const saveGridState = useCallback(() => {
    const gridApi = gridRef.current?.api;
    if (!gridApi) return;

    const columnStates = gridApi.getColumnState();
    const filterModel = gridApi.getFilterModel();
    const sortColumns = columnStates
      .filter(state => state.sort)
      .map(state => ({
        colId: state.colId,
        sort: state.sort as 'asc' | 'desc' | null
      }));

    const gridState: SavedGridState = {
      columnState: columnStates,
      filterModel,
      sortColumns
    };

    localStorage.setItem(GRID_STATE_KEY, JSON.stringify(gridState));
  }, []);

  const restoreGridState = useCallback(() => {
    const gridApi = gridRef.current?.api;
    if (!gridApi) return;

    const savedState = localStorage.getItem(GRID_STATE_KEY);
    if (!savedState) return;

    try {
      const gridState: SavedGridState = JSON.parse(savedState);
      
      // Restore column state
      gridApi.applyColumnState({
        state: gridState.columnState,
        applyOrder: true
      });
      
      // Restore filters
      gridApi.setFilterModel(gridState.filterModel);
      
      // Restore sort
      const sortModel = gridState.sortColumns
        .filter(col => col.sort)
        .map(({ colId, sort }) => ({
          colId,
          sort
        }));
      
      if (sortModel.length > 0) {
        gridApi.applyColumnState({
          state: sortModel,
          defaultState: { sort: null }
        });
      }
    } catch (error) {
      console.error('Error restoring grid state:', error);
      localStorage.removeItem(GRID_STATE_KEY);
    }
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    restoreGridState();
  }, [restoreGridState]);

  useEffect(() => {
    return () => {
      saveGridState();
    };
  }, [saveGridState]);

  const handleRowClick = (event: RowClickedEvent) => {
    const rowData = event.data?._id;
    console.log("Row clicked:", rowData);
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
    <div className="flex flex-col w-full h-screen">
      {selectedRows.length > 0 && (
         <div className="flex justify-between items-center p-4 bg-white border-b">
         <div className="flex items-center gap-4">
           <div className="text-sm text-gray-600">
             {selectedRows.length} properties selected
           </div>
           {saveMessage && (
             <div className={`text-sm px-4 py-2 rounded-md ${
               saveMessage.type === 'success' 
                 ? 'bg-green-100 text-green-700' 
                 : 'bg-red-100 text-red-700'
             }`}>
               {saveMessage.text}
             </div>
           )}
         </div>
         <button
           onClick={saveProperties}
           disabled={isSaving || selectedRows.length === 0}
           className={`px-4 py-2 rounded-md text-white ${
             selectedRows.length === 0
               ? 'bg-gray-400 cursor-not-allowed'
               : 'bg-blue-600 hover:bg-blue-700'
           } transition-colors duration-200 flex items-center gap-2`}
         >
           {isSaving ? (
             <>
               <span className="animate-spin">⌛</span>
               Saving...
             </>
           ) : (
             <>
               <span>💾</span>
               Save Selected Properties
             </>
           )}
         </button>
       </div>
       
      )}
   
    <div className="flex-1 bg-white rounded-xl border">
      <AgGridReact
        ref={gridRef}
        rowData={data}
        columnDefs={generateColDefs()}
        defaultColDef={defaultColDef}
        className="w-full h-full rounded-xl ag-theme-alpine"
        onGridReady={onGridReady}
        onRowClicked={handleRowClick}
        onFilterChanged={saveGridState}
        onSortChanged={saveGridState}
        pagination={false}
        paginationPageSize={25}
        enableRangeSelection={true}
        animateRows={true}
        rowSelection="multiple"
        suppressRowClickSelection={true}
        onSelectionChanged={handleSelectionChanged}
      />
    </div>
  </div>
  );
};

export default PropertyListingTable;