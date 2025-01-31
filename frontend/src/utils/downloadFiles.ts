import * as XLSX from "xlsx";
import Papa from "papaparse";
import { PropertyDetails } from "../types/propertyTypes";

export const downloadFile = (
  data: PropertyDetails[],
  fileType: "CSV" | "XLS"
) => {
  if (data.length === 0) {
    alert("No data available to download.");
    return;
  }

  if (fileType === "CSV") {
    // Convert data to CSV format
    const header = Object.keys(data[0]);
    const csv = Papa.unparse({
      fields: header,
      data: data,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "filtered_properties.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (fileType === "XLS") {
    // Convert data to XLS format
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered_Properties");
    XLSX.writeFile(workbook, "filtered_properties.xlsx");
  }
};
