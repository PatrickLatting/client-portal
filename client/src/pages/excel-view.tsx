// // src/pages/excel-view.tsx

// import React, { useContext, useEffect, useState } from "react";
// import ExcelViewer from "../components/ExcelViewer/ExcelViewer";
// import { loadForeclosureData } from "../lib/excel/excelReader";
// import { PropertiesContext } from "../App";

// const ExcelViewPage: React.FC = ({ properties, setProperties }) => {
//   const { data, setData } = useContext(PropertiesContext);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string>();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         setError(undefined);
//         console.log("Starting data fetch...");

//         const foreclosureData = await loadForeclosureData();
//         console.log(
//           "Data fetched successfully:",
//           foreclosureData.length,
//           "records"
//         );
//         setData(foreclosureData);
//         setProperties(foreclosureData);
//       } catch (err) {
//         console.error("Error in fetchData:", err);
//         setError(err instanceof Error ? err.message : "Failed to load data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Foreclosure Data Viewer</h1>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
//           Error: {error}
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow">
//         <ExcelViewer data={properties} isLoading={isLoading} error={error} />
//       </div>

//       <div className="mt-4 text-sm text-gray-600">
//         {data.length > 0 && `Total entries: ${data.length}`}
//       </div>
//     </div>
//   );
// };

// export default ExcelViewPage;
