// src/lib/excel/excelReader.ts

import * as XLSX from 'xlsx';
import { ForeclosureData } from '../../components/ExcelViewer/types';
import { initFileSystem } from '../../utils/fs';

export async function readExcelFile(file: ArrayBuffer): Promise<ForeclosureData[]> {
    try {
        const workbook = XLSX.read(file, {
            type: 'array',
            cellDates: true,
            cellNF: true,
            cellText: true
        });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            dateNF: 'yyyy-mm-dd'
        });

        return jsonData.map((row: any, index) => ({
            id: index.toString(),
            ...row
        }));
    } catch (error) {
        console.error('Error reading Excel file:', error);
        throw new Error('Failed to process Excel file');
    }
}

export async function loadForeclosureData(): Promise<ForeclosureData[]> {
    try {
        // Initialize the file system
        initFileSystem();

        if (!window.fs) {
            throw new Error('File system initialization failed');
        }

        // Read the file
        const response = await window.fs.readFile('PropstreamGPNMergeDecemberForeclosuresv1.xlsx');
        
        if (!(response instanceof ArrayBuffer)) {
            throw new Error('Expected ArrayBuffer response');
        }

        return await readExcelFile(response);
    } catch (error) {
        console.error('Error loading foreclosure data:', error);
        throw error;
    }
}