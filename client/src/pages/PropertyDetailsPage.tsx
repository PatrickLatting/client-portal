import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const PropertyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useParams();
  const [propertyData, setPropertyData] = React.useState<any>(null);

  React.useEffect(() => {
    if (data) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(data));
        setPropertyData(decodedData);
      } catch (error) {
        console.error("Error parsing property data:", error);
      }
    }
  }, [data]);

  if (!propertyData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6">Property Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(propertyData).map(([key, value]) => (
            <div key={key} className="border-b pb-4">
              <p className="text-gray-600 text-sm">{key}</p>
              <p className="text-gray-900">
                {value !== null && value !== undefined ? String(value) : "-"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;