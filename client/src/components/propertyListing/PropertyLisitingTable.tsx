const PropertyListingTable = () => {
  const data = [
    {
      ID: "1",
      ADDRESS_FROM_INPUT: "123 Main St",
      ASSESSED_VALUE: "$100,000",
      // Add all other fields here
    },
    {
      ID: "2",
      ADDRESS_FROM_INPUT: "123 Main St",
      ASSESSED_VALUE: "$100,000",
      // Add all other fields here
    },
    {
      ID: "3",
      ADDRESS_FROM_INPUT: "123 Main St",
      ASSESSED_VALUE: "$100,000",
      // Add all other fields here
    },
    {
      ID: "4",
      ADDRESS_FROM_INPUT: "123 Main St",
      ASSESSED_VALUE: "$100,000",
      // Add all other fields here
    },
    {
      ID: "5",
      ADDRESS_FROM_INPUT: "123 Main St",
      ASSESSED_VALUE: "$100,000",
      // Add all other fields here
    },
    {
      ID: "6",
      ADDRESS_FROM_INPUT: "123 Main St",
      ASSESSED_VALUE: "$100,000",
      // Add all other fields here
    },
    // Add more rows as necessary
  ];

  const fields = [
    "ADDRESS_FROM_INPUT",
    "ID",
    "ASSESSED_VALUE",
    "ASSESSED_LAND_VALUE",
    "ASSESSED_IMPROVEMENT_VALUE",
    "MARKET_VALUE",
    "MARKET_LAND_VALUE",
    "MARKET_IMPROVEMENT_VALUE",
    "TAX_AMOUNT",
    "ESTIMATED_VALUE",
    "ESTIMATED_EQUITY",
    "LOT_SQUARE_FEET",
    "ASSESSMENT_YEAR",
    "YEAR_BUILT",
    "PARKING_SPACES",
    "PROPERTIES_OWNED",
    "SQUARE_FEET",
    "BEDROOMS",
    "LATITUDE",
    "LONGITUDE",
    "BATHROOMS",
    "LOT_ACRES",
    "LTV_RATIO",
    "ITV_RATIO",
    "OWNER_1_CORPORATE",
    "MOBILE_HOME",
    "TIMESHARE",
    "CASH_BUYER",
    "HOA_PRESENT",
    "HOMESTEAD_EXEMPT",
    "APN",
    "APN_UNFORMATTED",
    "COUNTY_USE_CODE",
    "ZONING",
    "CENSUS_TRACT",
    "SCHOOL_DISCTRICT",
    "TAX_JURISDICTION_CODE",
    "JURISDICTION",
    "OWNER_1_FULL_NAME",
    "OWNER_OCCUPANCY",
    "PROPERTY_CLASS",
    "LAND_USE",
    "OWNERSHIP_TYPE",
    "MAIL_ADDRESS_NUMBER",
    "MAIL_ADDRESS_STREET",
    "MAIL_ADDRESS_STREET_SUFFIX",
    "MAIL_ADDRESS_ZIP",
    "MAIL_ADDRESS_CITY",
    "MAIL_ADDRESS_STATE",
    "MORTGAGE_AMOUNT",
    "MORTGAGE_INTEREST_RATE",
    "MORTGAGE_GRANTEE_NAME",
    "MORTGAGE_POSITION",
    "MORTGAGE_TYPE",
    "TAX_YEAR_1",
    "TAX_AMOUNT_1",
    "ASSESSED_VALUE_1",
    "TAX_AMOUNT_CHANGE_1",
    "ASSESSED_VALUE_CHANGE_1",
    "TAX_YEAR_2",
    "TAX_AMOUNT_2",
    "ASSESSED_VALUE_2",
    "TAX_AMOUNT_CHANGE_2",
    "ASSESSED_VALUE_CHANGE_2",
    "TAX_YEAR_3",
    "TAX_AMOUNT_3",
    "ASSESSED_VALUE_3",
    "TAX_AMOUNT_CHANGE_3",
    "ASSESSED_VALUE_CHANGE_3",
    "TAX_YEAR_4",
    "TAX_AMOUNT_4",
    "ASSESSED_VALUE_4",
    "TAX_AMOUNT_CHANGE_4",
    "ASSESSED_VALUE_CHANGE_4",
    "TAX_YEAR_5",
    "TAX_AMOUNT_5",
    "ASSESSED_VALUE_5",
    "TAX_AMOUNT_CHANGE_5",
    "ASSESSED_VALUE_CHANGE_5",
    "RECORDING_DATE_1",
    "SALE_DATE_1",
    "DOCUMENT_TYPE_1",
    "TRANSACTION_TYPE_1",
    "BUYER_1",
    "RECORDING_DATE_2",
    "SALE_DATE_2",
    "DOCUMENT_TYPE_2",
    "BUYER_2",
    "RECORDING_DATE_3",
    "SALE_DATE_3",
    "AMOUNT_3",
    "DOCUMENT_NUMBER_3",
    "DOCUMENT_TYPE_3",
    "TRANSACTION_TYPE_3",
    "BUYER_3",
    "SELLER_3",
    "PURCHASE_METHOD_3",
    "RECORDING_DATE_4",
    "SALE_DATE_4",
    "DOCUMENT_TYPE_4",
    "TRANSACTION_TYPE_4",
    "BUYER_4",
    "SELLER_4",
    "RECORDING_DATE_5",
    "SALE_DATE_5",
    "DOCUMENT_TYPE_5",
    "TRANSACTION_TYPE_5",
    "BUYER_5",
    "SELLER_5",
    "RECORDING_DATE_6",
    "SALE_DATE_6",
    "AMOUNT_6",
    "DOCUMENT_TYPE_6",
    "TRANSACTION_TYPE_6",
    "BUYER_6",
    "PURCHASE_METHOD_6",
    "Publication Name",
    "Date",
    "Notice Identification",
    "Notice Content",
    "County",
    "Address",
    "Parcel Number",
    "Principal Amount Owed",
    "Date of Debt",
    "Lender Name",
    "Borrower Name(s)",
    "Law Firm Name",
    "Attorney Phone Number",
    "Foreclosure Sale Date",
  ];

  return (
    <div className="overflow-auto max-w-full">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-200 sticky top-0">
          <tr>
            {fields.map((field) => (
              <th
                key={field}
                className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
              >
                {field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              {fields.map((field) => (
                <td
                  key={field}
                  className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
                >
                  {row[field] || "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyListingTable;
