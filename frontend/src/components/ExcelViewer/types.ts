// src/components/ExcelViewer/types.ts

export interface ForeclosureData {
    id: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    propertyType?: string;
    listPrice?: number;
    status?: string;
    [key: string]: any; // For any additional columns
}

export interface ExcelViewerProps {
    data: ForeclosureData[];
    isLoading: boolean;
    error?: string;
}