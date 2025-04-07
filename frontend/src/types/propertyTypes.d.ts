export type PropertyDetails = {

  //Property-level
  totalCount: number;
  _id?: unknown;
  "State": string;
  "County": string;
  "Address": string;
  "Parcel Number": string;
  "Publication Name": string;
  "Date Published": string;
  "Publication Details": string;
  "Notice Authentication Number": string;
  "Notice Content": string;
  "Principal Amount Owed": number;
  "Date of Debt": string;
  "Lender Name": string;
  "Lender Phone Number": string;
  "Borrower Name(s)": string;
  "Law Firm Name": string;
  "Attorney Phone Number": string;
  "Foreclosure Sale Date": string;
  "Foreclosure Sale Location": string;
  "Property Tax Rate": number;
  "Longitude": number;
  "County FIPS": number;
  "City ID": number;
  "Property URL": string;
  "Zestimate": number;
  "Image Source": string;
  "Zillow Property ID": number;
  "Zip Code": number;
  "Living Area (sq ft)": number;
  "Zestimate Low Percent": number;
  "Property Type": string;
  "Property Type.1": string;
  "Year Built": number;
  "Lot Size": string;
  "City Region": string;
  "Living Area": string;
  "Home Warranty": number;
  "Bedrooms": number;
  "Construction Materials": string;
  "Annual Tax Amount": number;
  "Bathrooms": number;
  "Home Type": string;
  "Parcel Number.1": string;
  "Annual Homeowners Insurance": number;
  "Rent Zestimate": number;
  "Description": string;
  "Latitude": number;
  "Zestimate High Percent": number;

  //Tax
  TAX_HISTORY_TIME_1: number;
  TAX_HISTORY_VALUE_1: number;
  TAX_HISTORY_TAX_PAID_1: number;

  TAX_HISTORY_TIME_2: number;
  TAX_HISTORY_VALUE_2: number;
  TAX_HISTORY_TAX_PAID_2: number;

  TAX_HISTORY_TIME_3: number;
  TAX_HISTORY_VALUE_3: number;
  TAX_HISTORY_TAX_PAID_3: number;

  TAX_HISTORY_TIME_4: number;
  TAX_HISTORY_VALUE_4: number;
  TAX_HISTORY_TAX_PAID_4: number;

  TAX_HISTORY_TIME_5: number;
  TAX_HISTORY_VALUE_5: number;
  TAX_HISTORY_TAX_PAID_5: number;

  TAX_HISTORY_TIME_6: number;
  TAX_HISTORY_VALUE_6: number;
  TAX_HISTORY_TAX_PAID_6: number;

  TAX_HISTORY_TIME_7: number;
  TAX_HISTORY_VALUE_7: number;
  TAX_HISTORY_TAX_PAID_7: number;

  TAX_HISTORY_TIME_8: number;
  TAX_HISTORY_VALUE_8: number;
  TAX_HISTORY_TAX_PAID_8: number;

  //Sale history
  PRICE_HISTORY_DATE_1: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_1: number;
  PRICE_HISTORY_EVENT_1: string;
  PRICE_HISTORY_PRICE_1: number;

  PRICE_HISTORY_DATE_2: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_2: number;
  PRICE_HISTORY_EVENT_2: string;
  PRICE_HISTORY_PRICE_2: number;

  PRICE_HISTORY_DATE_3: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_3: number;
  PRICE_HISTORY_EVENT_3: string;
  PRICE_HISTORY_PRICE_3: number;

  PRICE_HISTORY_DATE_4: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_4: number;
  PRICE_HISTORY_EVENT_4: string;
  PRICE_HISTORY_PRICE_4: number;

  PRICE_HISTORY_DATE_5: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_5: number;
  PRICE_HISTORY_EVENT_5: string;
  PRICE_HISTORY_PRICE_5: number;

  PRICE_HISTORY_DATE_6: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_6: number;
  PRICE_HISTORY_EVENT_6: string;
  PRICE_HISTORY_PRICE_6: number;

  PRICE_HISTORY_DATE_7: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_7: number;
  PRICE_HISTORY_EVENT_7: string;
  PRICE_HISTORY_PRICE_7: number;

  PRICE_HISTORY_DATE_8: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_8: number;
  PRICE_HISTORY_EVENT_8: string;
  PRICE_HISTORY_PRICE_8: number;

  PRICE_HISTORY_DATE_9: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_9: number;
  PRICE_HISTORY_EVENT_9: string;
  PRICE_HISTORY_PRICE_9: number;

  PRICE_HISTORY_DATE_10: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_10: number;
  PRICE_HISTORY_EVENT_10: string;
  PRICE_HISTORY_PRICE_10: number;

  PRICE_HISTORY_DATE_11: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_11: number;
  PRICE_HISTORY_EVENT_11: string;
  PRICE_HISTORY_PRICE_11: number;

  PRICE_HISTORY_DATE_12: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_12: number;
  PRICE_HISTORY_EVENT_12: string;
  PRICE_HISTORY_PRICE_12: number;

  PRICE_HISTORY_DATE_13: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_13: number;
  PRICE_HISTORY_EVENT_13: string;
  PRICE_HISTORY_PRICE_13: number;

  PRICE_HISTORY_DATE_14: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_14: number;
  PRICE_HISTORY_EVENT_14: string;
  PRICE_HISTORY_PRICE_14: number;

  PRICE_HISTORY_DATE_15: string;
  PRICE_HISTORY_PRICEPERSQUAREFOOT_15: number;
  PRICE_HISTORY_EVENT_15: string;
  PRICE_HISTORY_PRICE_15: number;


  // Sale Comps
  
  SALE_COMP_ADDRESS_1: string;
  SALE_COMP_DATESOLD_1: string;
  SALE_COMP_PRICE_1: number;
  SALE_COMP_BEDROOMS_1: number;
  SALE_COMP_BATHROOMS_1: number;
  SALE_COMP_LIVINGAREA_1: number;
  SALE_COMP_LOTSIZE_1: number;
  SALE_COMP_LATITUDE_1: number;
  SALE_COMP_LONGITUDE_1: number;
  SALE_COMP_HDPURL_1: string;
  SALE_COMP_ZPID_1: number;
  SALE_COMP_HOMETYPE_1: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_1: number;
  
  SALE_COMP_ADDRESS_2: string;
  SALE_COMP_DATESOLD_2: string;
  SALE_COMP_PRICE_2: number;
  SALE_COMP_BEDROOMS_2: number;
  SALE_COMP_BATHROOMS_2: number;
  SALE_COMP_LIVINGAREA_2: number;
  SALE_COMP_LOTSIZE_2: number;
  SALE_COMP_LATITUDE_2: number;
  SALE_COMP_LONGITUDE_2: number;
  SALE_COMP_HDPURL_2: string;
  SALE_COMP_ZPID_2: number;
  SALE_COMP_HOMETYPE_2: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_2: number;
  
  SALE_COMP_ADDRESS_3: string;
  SALE_COMP_DATESOLD_3: string;
  SALE_COMP_PRICE_3: number;
  SALE_COMP_BEDROOMS_3: number;
  SALE_COMP_BATHROOMS_3: number;
  SALE_COMP_LIVINGAREA_3: number;
  SALE_COMP_LOTSIZE_3: number;
  SALE_COMP_LATITUDE_3: number;
  SALE_COMP_LONGITUDE_3: number;
  SALE_COMP_HDPURL_3: string;
  SALE_COMP_ZPID_3: number;
  SALE_COMP_HOMETYPE_3: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_3: number;
  
  SALE_COMP_ADDRESS_4: string;
  SALE_COMP_DATESOLD_4: string;
  SALE_COMP_PRICE_4: number;
  SALE_COMP_BEDROOMS_4: number;
  SALE_COMP_BATHROOMS_4: number;
  SALE_COMP_LIVINGAREA_4: number;
  SALE_COMP_LOTSIZE_4: number;
  SALE_COMP_LATITUDE_4: number;
  SALE_COMP_LONGITUDE_4: number;
  SALE_COMP_HDPURL_4: string;
  SALE_COMP_ZPID_4: number;
  SALE_COMP_HOMETYPE_4: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_4: number;
  
  SALE_COMP_ADDRESS_5: string;
  SALE_COMP_DATESOLD_5: string;
  SALE_COMP_PRICE_5: number;
  SALE_COMP_BEDROOMS_5: number;
  SALE_COMP_BATHROOMS_5: number;
  SALE_COMP_LIVINGAREA_5: number;
  SALE_COMP_LOTSIZE_5: number;
  SALE_COMP_LATITUDE_5: number;
  SALE_COMP_LONGITUDE_5: number;
  SALE_COMP_HDPURL_5: string;
  SALE_COMP_ZPID_5: number;
  SALE_COMP_HOMETYPE_5: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_5: number;
  
  SALE_COMP_ADDRESS_6: string;
  SALE_COMP_DATESOLD_6: string;
  SALE_COMP_PRICE_6: number;
  SALE_COMP_BEDROOMS_6: number;
  SALE_COMP_BATHROOMS_6: number;
  SALE_COMP_LIVINGAREA_6: number;
  SALE_COMP_LOTSIZE_6: number;
  SALE_COMP_LATITUDE_6: number;
  SALE_COMP_LONGITUDE_6: number;
  SALE_COMP_HDPURL_6: string;
  SALE_COMP_ZPID_6: number;
  SALE_COMP_HOMETYPE_6: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_6: number;
  
  SALE_COMP_ADDRESS_7: string;
  SALE_COMP_DATESOLD_7: string;
  SALE_COMP_PRICE_7: number;
  SALE_COMP_BEDROOMS_7: number;
  SALE_COMP_BATHROOMS_7: number;
  SALE_COMP_LIVINGAREA_7: number;
  SALE_COMP_LOTSIZE_7: number;
  SALE_COMP_LATITUDE_7: number;
  SALE_COMP_LONGITUDE_7: number;
  SALE_COMP_HDPURL_7: string;
  SALE_COMP_ZPID_7: number;
  SALE_COMP_HOMETYPE_7: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_7: number;
  
  SALE_COMP_ADDRESS_8: string;
  SALE_COMP_DATESOLD_8: string;
  SALE_COMP_PRICE_8: number;
  SALE_COMP_BEDROOMS_8: number;
  SALE_COMP_BATHROOMS_8: number;
  SALE_COMP_LIVINGAREA_8: number;
  SALE_COMP_LOTSIZE_8: number;
  SALE_COMP_LATITUDE_8: number;
  SALE_COMP_LONGITUDE_8: number;
  SALE_COMP_HDPURL_8: string;
  SALE_COMP_ZPID_8: number;
  SALE_COMP_HOMETYPE_8: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_8: number;
  
  SALE_COMP_ADDRESS_9: string;
  SALE_COMP_DATESOLD_9: string;
  SALE_COMP_PRICE_9: number;
  SALE_COMP_BEDROOMS_9: number;
  SALE_COMP_BATHROOMS_9: number;
  SALE_COMP_LIVINGAREA_9: number;
  SALE_COMP_LOTSIZE_9: number;
  SALE_COMP_LATITUDE_9: number;
  SALE_COMP_LONGITUDE_9: number;
  SALE_COMP_HDPURL_9: string;
  SALE_COMP_ZPID_9: number;
  SALE_COMP_HOMETYPE_9: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_9: number;
  
  SALE_COMP_ADDRESS_10: string;
  SALE_COMP_DATESOLD_10: string;
  SALE_COMP_PRICE_10: number;
  SALE_COMP_BEDROOMS_10: number;
  SALE_COMP_BATHROOMS_10: number;
  SALE_COMP_LIVINGAREA_10: number;
  SALE_COMP_LOTSIZE_10: number;
  SALE_COMP_LATITUDE_10: number;
  SALE_COMP_LONGITUDE_10: number;
  SALE_COMP_HDPURL_10: string;
  SALE_COMP_ZPID_10: number;
  SALE_COMP_HOMETYPE_10: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_10: number;
  
  SALE_COMP_ADDRESS_11: string;
  SALE_COMP_DATESOLD_11: string;
  SALE_COMP_PRICE_11: number;
  SALE_COMP_BEDROOMS_11: number;
  SALE_COMP_BATHROOMS_11: number;
  SALE_COMP_LIVINGAREA_11: number;
  SALE_COMP_LOTSIZE_11: number;
  SALE_COMP_LATITUDE_11: number;
  SALE_COMP_LONGITUDE_11: number;
  SALE_COMP_HDPURL_11: string;
  SALE_COMP_ZPID_11: number;
  SALE_COMP_HOMETYPE_11: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_11: number;
  
  SALE_COMP_ADDRESS_12: string;
  SALE_COMP_DATESOLD_12: string;
  SALE_COMP_PRICE_12: number;
  SALE_COMP_BEDROOMS_12: number;
  SALE_COMP_BATHROOMS_12: number;
  SALE_COMP_LIVINGAREA_12: number;
  SALE_COMP_LOTSIZE_12: number;
  SALE_COMP_LATITUDE_12: number;
  SALE_COMP_LONGITUDE_12: number;
  SALE_COMP_HDPURL_12: string;
  SALE_COMP_ZPID_12: number;
  SALE_COMP_HOMETYPE_12: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_12: number;
  
  SALE_COMP_ADDRESS_13: string;
  SALE_COMP_DATESOLD_13: string;
  SALE_COMP_PRICE_13: number;
  SALE_COMP_BEDROOMS_13: number;
  SALE_COMP_BATHROOMS_13: number;
  SALE_COMP_LIVINGAREA_13: number;
  SALE_COMP_LOTSIZE_13: number;
  SALE_COMP_LATITUDE_13: number;
  SALE_COMP_LONGITUDE_13: number;
  SALE_COMP_HDPURL_13: string;
  SALE_COMP_ZPID_13: number;
  SALE_COMP_HOMETYPE_13: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_13: number;
  
  SALE_COMP_ADDRESS_14: string;
  SALE_COMP_DATESOLD_14: string;
  SALE_COMP_PRICE_14: number;
  SALE_COMP_BEDROOMS_14: number;
  SALE_COMP_BATHROOMS_14: number;
  SALE_COMP_LIVINGAREA_14: number;
  SALE_COMP_LOTSIZE_14: number;
  SALE_COMP_LATITUDE_14: number;
  SALE_COMP_LONGITUDE_14: number;
  SALE_COMP_HDPURL_14: string;
  SALE_COMP_ZPID_14: number;
  SALE_COMP_HOMETYPE_14: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_14: number;
  
  SALE_COMP_ADDRESS_15: string;
  SALE_COMP_DATESOLD_15: string;
  SALE_COMP_PRICE_15: number;
  SALE_COMP_BEDROOMS_15: number;
  SALE_COMP_BATHROOMS_15: number;
  SALE_COMP_LIVINGAREA_15: number;
  SALE_COMP_LOTSIZE_15: number;
  SALE_COMP_LATITUDE_15: number;
  SALE_COMP_LONGITUDE_15: number;
  SALE_COMP_HDPURL_15: string;
  SALE_COMP_ZPID_15: number;
  SALE_COMP_HOMETYPE_15: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_15: number;
  
  SALE_COMP_ADDRESS_16: string;
  SALE_COMP_DATESOLD_16: string;
  SALE_COMP_PRICE_16: number;
  SALE_COMP_BEDROOMS_16: number;
  SALE_COMP_BATHROOMS_16: number;
  SALE_COMP_LIVINGAREA_16: number;
  SALE_COMP_LOTSIZE_16: number;
  SALE_COMP_LATITUDE_16: number;
  SALE_COMP_LONGITUDE_16: number;
  SALE_COMP_HDPURL_16: string;
  SALE_COMP_ZPID_16: number;
  SALE_COMP_HOMETYPE_16: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_16: number;
  
  SALE_COMP_ADDRESS_17: string;
  SALE_COMP_DATESOLD_17: string;
  SALE_COMP_PRICE_17: number;
  SALE_COMP_BEDROOMS_17: number;
  SALE_COMP_BATHROOMS_17: number;
  SALE_COMP_LIVINGAREA_17: number;
  SALE_COMP_LOTSIZE_17: number;
  SALE_COMP_LATITUDE_17: number;
  SALE_COMP_LONGITUDE_17: number;
  SALE_COMP_HDPURL_17: string;
  SALE_COMP_ZPID_17: number;
  SALE_COMP_HOMETYPE_17: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_17: number;
  
  SALE_COMP_ADDRESS_18: string;
  SALE_COMP_DATESOLD_18: string;
  SALE_COMP_PRICE_18: number;
  SALE_COMP_BEDROOMS_18: number;
  SALE_COMP_BATHROOMS_18: number;
  SALE_COMP_LIVINGAREA_18: number;
  SALE_COMP_LOTSIZE_18: number;
  SALE_COMP_LATITUDE_18: number;
  SALE_COMP_LONGITUDE_18: number;
  SALE_COMP_HDPURL_18: string;
  SALE_COMP_ZPID_18: number;
  SALE_COMP_HOMETYPE_18: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_18: number;
  
  SALE_COMP_ADDRESS_19: string;
  SALE_COMP_DATESOLD_19: string;
  SALE_COMP_PRICE_19: number;
  SALE_COMP_BEDROOMS_19: number;
  SALE_COMP_BATHROOMS_19: number;
  SALE_COMP_LIVINGAREA_19: number;
  SALE_COMP_LOTSIZE_19: number;
  SALE_COMP_LATITUDE_19: number;
  SALE_COMP_LONGITUDE_19: number;
  SALE_COMP_HDPURL_19: string;
  SALE_COMP_ZPID_19: number;
  SALE_COMP_HOMETYPE_19: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_19: number;
  
  SALE_COMP_ADDRESS_20: string;
  SALE_COMP_DATESOLD_20: string;
  SALE_COMP_PRICE_20: number;
  SALE_COMP_BEDROOMS_20: number;
  SALE_COMP_BATHROOMS_20: number;
  SALE_COMP_LIVINGAREA_20: number;
  SALE_COMP_LOTSIZE_20: number;
  SALE_COMP_LATITUDE_20: number;
  SALE_COMP_LONGITUDE_20: number;
  SALE_COMP_HDPURL_20: string;
  SALE_COMP_ZPID_20: number;
  SALE_COMP_HOMETYPE_20: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_20: number;
  
  SALE_COMP_ADDRESS_21: string;
  SALE_COMP_DATESOLD_21: string;
  SALE_COMP_PRICE_21: number;
  SALE_COMP_BEDROOMS_21: number;
  SALE_COMP_BATHROOMS_21: number;
  SALE_COMP_LIVINGAREA_21: number;
  SALE_COMP_LOTSIZE_21: number;
  SALE_COMP_LATITUDE_21: number;
  SALE_COMP_LONGITUDE_21: number;
  SALE_COMP_HDPURL_21: string;
  SALE_COMP_ZPID_21: number;
  SALE_COMP_HOMETYPE_21: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_21: number;
  
  SALE_COMP_ADDRESS_22: string;
  SALE_COMP_DATESOLD_22: string;
  SALE_COMP_PRICE_22: number;
  SALE_COMP_BEDROOMS_22: number;
  SALE_COMP_BATHROOMS_22: number;
  SALE_COMP_LIVINGAREA_22: number;
  SALE_COMP_LOTSIZE_22: number;
  SALE_COMP_LATITUDE_22: number;
  SALE_COMP_LONGITUDE_22: number;
  SALE_COMP_URL_22: string;
  SALE_COMP_ZPID_22: number;
  SALE_COMP_HOMETYPE_22: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_22: number;
  
  SALE_COMP_ADDRESS_23: string;
  SALE_COMP_DATESOLD_23: string;
  SALE_COMP_PRICE_23: number;
  SALE_COMP_BEDROOMS_23: number;
  SALE_COMP_BATHROOMS_23: number;
  SALE_COMP_LIVINGAREA_23: number;
  SALE_COMP_LOTSIZE_23: number;
  SALE_COMP_LATITUDE_23: number;
  SALE_COMP_LONGITUDE_23: number;
  SALE_COMP_HDPURL_23: string;
  SALE_COMP_ZPID_23: number;
  SALE_COMP_HOMETYPE_23: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_23: number;
  
  SALE_COMP_ADDRESS_24: string;
  SALE_COMP_DATESOLD_24: string;
  SALE_COMP_PRICE_24: number;
  SALE_COMP_BEDROOMS_24: number;
  SALE_COMP_BATHROOMS_24: number;
  SALE_COMP_LIVINGAREA_24: number;
  SALE_COMP_LOTSIZE_24: number;
  SALE_COMP_LATITUDE_24: number;
  SALE_COMP_LONGITUDE_24: number;
  SALE_COMP_HDPURL_24: string;
  SALE_COMP_ZPID_24: number;
  SALE_COMP_HOMETYPE_24: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_24: number;
  
  SALE_COMP_ADDRESS_25: string;
  SALE_COMP_DATESOLD_25: string;
  SALE_COMP_PRICE_25: number;
  SALE_COMP_BEDROOMS_25: number;
  SALE_COMP_BATHROOMS_25: number;
  SALE_COMP_LIVINGAREA_25: number;
  SALE_COMP_LOTSIZE_25: number;
  SALE_COMP_LATITUDE_25: number;
  SALE_COMP_LONGITUDE_25: number;
  SALE_COMP_HDPURL_25: string;
  SALE_COMP_ZPID_25: number;
  SALE_COMP_HOMETYPE_25: string;
  SALE_COMP_DISTANCE_FROM_PROPERTY_25: number;  

//Redfin Sale Comps

REDFIN_ADDRESS_1: string;
REDFIN_PRICE_1: number;
REDFIN_BEDROOMS_1: number;
REDFIN_BATHROOMS_1: number;
REDFIN_LIVINGAREA_1: number;
REDFIN_LOTSIZE_1: number;
REDFIN_LATITUDE_1: number;
REDFIN_LONGITUDE_1: number;
REDFIN_URL_1: string;
REDFIN_DATESOLD_1: number;
REDFIN_HOMETYPE_1: number;
REDFIN_DISTANCE_FROM_PROPERTY_1: number;

REDFIN_ADDRESS_2: string;
REDFIN_PRICE_2: number;
REDFIN_BEDROOMS_2: number;
REDFIN_BATHROOMS_2: number;
REDFIN_LIVINGAREA_2: number;
REDFIN_LOTSIZE_2: number;
REDFIN_LATITUDE_2: number;
REDFIN_LONGITUDE_2: number;
REDFIN_URL_2: string;
REDFIN_DATESOLD_2: number;
REDFIN_HOMETYPE_2: number;
REDFIN_DISTANCE_FROM_PROPERTY_2: number;

REDFIN_ADDRESS_3: string;
REDFIN_PRICE_3: number;
REDFIN_BEDROOMS_3: number;
REDFIN_BATHROOMS_3: number;
REDFIN_LIVINGAREA_3: number;
REDFIN_LOTSIZE_3: number;
REDFIN_LATITUDE_3: number;
REDFIN_LONGITUDE_3: number;
REDFIN_URL_3: string;
REDFIN_DATESOLD_3: number;
REDFIN_HOMETYPE_3: number;
REDFIN_DISTANCE_FROM_PROPERTY_3: number;

REDFIN_ADDRESS_4: string;
REDFIN_PRICE_4: number;
REDFIN_BEDROOMS_4: number;
REDFIN_BATHROOMS_4: number;
REDFIN_LIVINGAREA_4: number;
REDFIN_LOTSIZE_4: number;
REDFIN_LATITUDE_4: number;
REDFIN_LONGITUDE_4: number;
REDFIN_URL_4: string;
REDFIN_DATESOLD_4: number;
REDFIN_HOMETYPE_4: number;
REDFIN_DISTANCE_FROM_PROPERTY_4: number;

REDFIN_ADDRESS_5: string;
REDFIN_PRICE_5: number;
REDFIN_BEDROOMS_5: number;
REDFIN_BATHROOMS_5: number;
REDFIN_LIVINGAREA_5: number;
REDFIN_LOTSIZE_5: number;
REDFIN_LATITUDE_5: number;
REDFIN_LONGITUDE_5: number;
REDFIN_URL_5: string;
REDFIN_DATESOLD_5: number;
REDFIN_HOMETYPE_5: number;
REDFIN_DISTANCE_FROM_PROPERTY_5: number;

REDFIN_ADDRESS_6: string;
REDFIN_PRICE_6: number;
REDFIN_BEDROOMS_6: number;
REDFIN_BATHROOMS_6: number;
REDFIN_LIVINGAREA_6: number;
REDFIN_LOTSIZE_6: number;
REDFIN_LATITUDE_6: number;
REDFIN_LONGITUDE_6: number;
REDFIN_URL_6: string;
REDFIN_DATESOLD_6: number;
REDFIN_HOMETYPE_6: number;
REDFIN_DISTANCE_FROM_PROPERTY_6: number;

REDFIN_ADDRESS_7: string;
REDFIN_PRICE_7: number;
REDFIN_BEDROOMS_7: number;
REDFIN_BATHROOMS_7: number;
REDFIN_LIVINGAREA_7: number;
REDFIN_LOTSIZE_7: number;
REDFIN_LATITUDE_7: number;
REDFIN_LONGITUDE_7: number;
REDFIN_URL_7: string;
REDFIN_DATESOLD_7: number;
REDFIN_HOMETYPE_7: number;
REDFIN_DISTANCE_FROM_PROPERTY_7: number;

REDFIN_ADDRESS_8: string;
REDFIN_PRICE_8: number;
REDFIN_BEDROOMS_8: number;
REDFIN_BATHROOMS_8: number;
REDFIN_LIVINGAREA_8: number;
REDFIN_LOTSIZE_8: number;
REDFIN_LATITUDE_8: number;
REDFIN_LONGITUDE_8: number;
REDFIN_URL_8: string;
REDFIN_DATESOLD_8: number;
REDFIN_HOMETYPE_8: number;
REDFIN_DISTANCE_FROM_PROPERTY_8: number;

REDFIN_ADDRESS_9: string;
REDFIN_PRICE_9: number;
REDFIN_BEDROOMS_9: number;
REDFIN_BATHROOMS_9: number;
REDFIN_LIVINGAREA_9: number;
REDFIN_LOTSIZE_9: number;
REDFIN_LATITUDE_9: number;
REDFIN_LONGITUDE_9: number;
REDFIN_URL_9: string;
REDFIN_DATESOLD_9: number;
REDFIN_HOMETYPE_9: number;
REDFIN_DISTANCE_FROM_PROPERTY_9: number;

REDFIN_ADDRESS_10: string;
REDFIN_PRICE_10: number;
REDFIN_BEDROOMS_10: number;
REDFIN_BATHROOMS_10: number;
REDFIN_LIVINGAREA_10: number;
REDFIN_LOTSIZE_10: number;
REDFIN_LATITUDE_10: number;
REDFIN_LONGITUDE_10: number;
REDFIN_URL_10: string;
REDFIN_DATESOLD_10: number;
REDFIN_HOMETYPE_10: number;
REDFIN_DISTANCE_FROM_PROPERTY_10: number;

REDFIN_ADDRESS_11: string;
REDFIN_PRICE_11: number;
REDFIN_BEDROOMS_11: number;
REDFIN_BATHROOMS_11: number;
REDFIN_LIVINGAREA_11: number;
REDFIN_LOTSIZE_11: number;
REDFIN_LATITUDE_11: number;
REDFIN_LONGITUDE_11: number;
REDFIN_URL_11: string;
REDFIN_DATESOLD_11: number;
REDFIN_HOMETYPE_11: number;
REDFIN_DISTANCE_FROM_PROPERTY_11: number;

REDFIN_ADDRESS_12: string;
REDFIN_PRICE_12: number;
REDFIN_BEDROOMS_12: number;
REDFIN_BATHROOMS_12: number;
REDFIN_LIVINGAREA_12: number;
REDFIN_LOTSIZE_12: number;
REDFIN_LATITUDE_12: number;
REDFIN_LONGITUDE_12: number;
REDFIN_URL_12: string;
REDFIN_DATESOLD_12: number;
REDFIN_HOMETYPE_12: number;
REDFIN_DISTANCE_FROM_PROPERTY_12: number;

REDFIN_ADDRESS_13: string;
REDFIN_PRICE_13: number;
REDFIN_BEDROOMS_13: number;
REDFIN_BATHROOMS_13: number;
REDFIN_LIVINGAREA_13: number;
REDFIN_LOTSIZE_13: number;
REDFIN_LATITUDE_13: number;
REDFIN_LONGITUDE_13: number;
REDFIN_URL_13: string;
REDFIN_DATESOLD_13: number;
REDFIN_HOMETYPE_13: number;
REDFIN_DISTANCE_FROM_PROPERTY_13: number;

REDFIN_ADDRESS_14: string;
REDFIN_PRICE_14: number;
REDFIN_BEDROOMS_14: number;
REDFIN_BATHROOMS_14: number;
REDFIN_LIVINGAREA_14: number;
REDFIN_LOTSIZE_14: number;
REDFIN_LATITUDE_14: number;
REDFIN_LONGITUDE_14: number;
REDFIN_URL_14: string;
REDFIN_DATESOLD_14: number;
REDFIN_HOMETYPE_14: number;
REDFIN_DISTANCE_FROM_PROPERTY_14: number;

REDFIN_ADDRESS_15: string;
REDFIN_PRICE_15: number;
REDFIN_BEDROOMS_15: number;
REDFIN_BATHROOMS_15: number;
REDFIN_LIVINGAREA_15: number;
REDFIN_LOTSIZE_15: number;
REDFIN_LATITUDE_15: number;
REDFIN_LONGITUDE_15: number;
REDFIN_URL_15: string;
REDFIN_DATESOLD_15: number;
REDFIN_HOMETYPE_15: number;
REDFIN_DISTANCE_FROM_PROPERTY_15: number;

REDFIN_ADDRESS_16: string;
REDFIN_PRICE_16: number;
REDFIN_BEDROOMS_16: number;
REDFIN_BATHROOMS_16: number;
REDFIN_LIVINGAREA_16: number;
REDFIN_LOTSIZE_16: number;
REDFIN_LATITUDE_16: number;
REDFIN_LONGITUDE_16: number;
REDFIN_URL_16: string;
REDFIN_DATESOLD_16: number;
REDFIN_HOMETYPE_16: number;
REDFIN_DISTANCE_FROM_PROPERTY_16: number;

REDFIN_ADDRESS_17: string;
REDFIN_PRICE_17: number;
REDFIN_BEDROOMS_17: number;
REDFIN_BATHROOMS_17: number;
REDFIN_LIVINGAREA_17: number;
REDFIN_LOTSIZE_17: number;
REDFIN_LATITUDE_17: number;
REDFIN_LONGITUDE_17: number;
REDFIN_URL_17: string;
REDFIN_DATESOLD_17: number;
REDFIN_HOMETYPE_17: number;
REDFIN_DISTANCE_FROM_PROPERTY_17: number;

REDFIN_ADDRESS_18: string;
REDFIN_PRICE_18: number;
REDFIN_BEDROOMS_18: number;
REDFIN_BATHROOMS_18: number;
REDFIN_LIVINGAREA_18: number;
REDFIN_LOTSIZE_18: number;
REDFIN_LATITUDE_18: number;
REDFIN_LONGITUDE_18: number;
REDFIN_URL_18: string;
REDFIN_DATESOLD_18: number;
REDFIN_HOMETYPE_18: number;
REDFIN_DISTANCE_FROM_PROPERTY_18: number;

REDFIN_ADDRESS_19: string;
REDFIN_PRICE_19: number;
REDFIN_BEDROOMS_19: number;
REDFIN_BATHROOMS_19: number;
REDFIN_LIVINGAREA_19: number;
REDFIN_LOTSIZE_19: number;
REDFIN_LATITUDE_19: number;
REDFIN_LONGITUDE_19: number;
REDFIN_URL_19: string;
REDFIN_DATESOLD_19: number;
REDFIN_HOMETYPE_19: number;
REDFIN_DISTANCE_FROM_PROPERTY_19: number;

REDFIN_ADDRESS_20: string;
REDFIN_PRICE_20: number;
REDFIN_BEDROOMS_20: number;
REDFIN_BATHROOMS_20: number;
REDFIN_LIVINGAREA_20: number;
REDFIN_LOTSIZE_20: number;
REDFIN_LATITUDE_20: number;
REDFIN_LONGITUDE_20: number;
REDFIN_URL_20: string;
REDFIN_DATESOLD_20: number;
REDFIN_HOMETYPE_20: number;
REDFIN_DISTANCE_FROM_PROPERTY_20: number;

//Good/bad comps
COMP_SCORE_SALE_COMP_1: string | number;
COMP_SCORE_SALE_COMP_2: string | number;
COMP_SCORE_SALE_COMP_3: string | number;
COMP_SCORE_SALE_COMP_4: string | number;
COMP_SCORE_SALE_COMP_5: string | number;
COMP_SCORE_SALE_COMP_6: string | number;
COMP_SCORE_SALE_COMP_7: string | number;
COMP_SCORE_SALE_COMP_8: string | number;
COMP_SCORE_SALE_COMP_9: string | number;
COMP_SCORE_SALE_COMP_10: string | number;
COMP_SCORE_SALE_COMP_11: string | number;
COMP_SCORE_SALE_COMP_12: string | number;
COMP_SCORE_SALE_COMP_13: string | number;
COMP_SCORE_SALE_COMP_14: string | number;
COMP_SCORE_SALE_COMP_15: string | number;
COMP_SCORE_SALE_COMP_16: string | number;
COMP_SCORE_SALE_COMP_17: string | number;
COMP_SCORE_SALE_COMP_18: string | number;
COMP_SCORE_SALE_COMP_19: string | number;
COMP_SCORE_SALE_COMP_20: string | number;
COMP_SCORE_SALE_COMP_21: string | number;
COMP_SCORE_SALE_COMP_22: string | number;
COMP_SCORE_SALE_COMP_23: string | number;
COMP_SCORE_SALE_COMP_24: string | number;
COMP_SCORE_SALE_COMP_25: string | number;

COMP_SCORE_REDFIN_1: string | number;
COMP_SCORE_REDFIN_2: string | number;
COMP_SCORE_REDFIN_3: string | number;
COMP_SCORE_REDFIN_4: string | number;
COMP_SCORE_REDFIN_5: string | number;
COMP_SCORE_REDFIN_6: string | number;
COMP_SCORE_REDFIN_7: string | number;
COMP_SCORE_REDFIN_8: string | number;
COMP_SCORE_REDFIN_9: string | number;
COMP_SCORE_REDFIN_10: string | number;
COMP_SCORE_REDFIN_11: string | number;
COMP_SCORE_REDFIN_12: string | number;
COMP_SCORE_REDFIN_13: string | number;
COMP_SCORE_REDFIN_14: string | number;
COMP_SCORE_REDFIN_15: string | number;
COMP_SCORE_REDFIN_16: string | number;
COMP_SCORE_REDFIN_17: string | number;
COMP_SCORE_REDFIN_18: string | number;
COMP_SCORE_REDFIN_19: string | number;
COMP_SCORE_REDFIN_20: string | number;

// Rent Comps
RENTAL_COMP_BATHROOMS_1: number;
RENTAL_COMP_BEDROOMS_1: number;
RENTAL_COMP_RENTZESTIMATE_1: number;
RENTAL_COMP_ADDRESS_1: string;
RENTAL_COMP_DISTANCE_1: number;
RENTAL_COMP_HOMESTATUS_1: string;
RENTAL_COMP_HOMETYPE_1: string;
RENTAL_COMP_ZESTIMATE_1: number;
RENTAL_COMP_LIVINGAREA_1: number;

RENTAL_COMP_BATHROOMS_2: number;
RENTAL_COMP_BEDROOMS_2: number;
RENTAL_COMP_RENTZESTIMATE_2: number;
RENTAL_COMP_ADDRESS_2: string;
RENTAL_COMP_DISTANCE_2: number;
RENTAL_COMP_HOMESTATUS_2: string;
RENTAL_COMP_HOMETYPE_2: string;
RENTAL_COMP_ZESTIMATE_2: number;
RENTAL_COMP_LIVINGAREA_2: number;

RENTAL_COMP_BATHROOMS_3: number;
RENTAL_COMP_BEDROOMS_3: number;
RENTAL_COMP_RENTZESTIMATE_3: number;
RENTAL_COMP_ADDRESS_3: string;
RENTAL_COMP_DISTANCE_3: number;
RENTAL_COMP_HOMESTATUS_3: string;
RENTAL_COMP_HOMETYPE_3: string;
RENTAL_COMP_ZESTIMATE_3: number;
RENTAL_COMP_LIVINGAREA_3: number;

RENTAL_COMP_BATHROOMS_4: number;
RENTAL_COMP_BEDROOMS_4: number;
RENTAL_COMP_RENTZESTIMATE_4: number;
RENTAL_COMP_ADDRESS_4: string;
RENTAL_COMP_DISTANCE_4: number;
RENTAL_COMP_HOMESTATUS_4: string;
RENTAL_COMP_HOMETYPE_4: string;
RENTAL_COMP_ZESTIMATE_4: number;
RENTAL_COMP_LIVINGAREA_4: number;

RENTAL_COMP_BATHROOMS_5: number;
RENTAL_COMP_BEDROOMS_5: number;
RENTAL_COMP_RENTZESTIMATE_5: number;
RENTAL_COMP_ADDRESS_5: string;
RENTAL_COMP_DISTANCE_5: number;
RENTAL_COMP_HOMESTATUS_5: string;
RENTAL_COMP_HOMETYPE_5: string;
RENTAL_COMP_ZESTIMATE_5: number;
RENTAL_COMP_LIVINGAREA_5: number;

RENTAL_COMP_BATHROOMS_6: number;
RENTAL_COMP_BEDROOMS_6: number;
RENTAL_COMP_RENTZESTIMATE_6: number;
RENTAL_COMP_ADDRESS_6: string;
RENTAL_COMP_DISTANCE_6: number;
RENTAL_COMP_HOMESTATUS_6: string;
RENTAL_COMP_HOMETYPE_6: string;
RENTAL_COMP_ZESTIMATE_6: number;
RENTAL_COMP_LIVINGAREA_6: number;

RENTAL_COMP_BATHROOMS_7: number;
RENTAL_COMP_BEDROOMS_7: number;
RENTAL_COMP_RENTZESTIMATE_7: number;
RENTAL_COMP_ADDRESS_7: string;
RENTAL_COMP_DISTANCE_7: number;
RENTAL_COMP_HOMESTATUS_7: string;
RENTAL_COMP_HOMETYPE_7: string;
RENTAL_COMP_ZESTIMATE_7: number;
RENTAL_COMP_LIVINGAREA_7: number;

RENTAL_COMP_BATHROOMS_8: number;
RENTAL_COMP_BEDROOMS_8: number;
RENTAL_COMP_RENTZESTIMATE_8: number;
RENTAL_COMP_ADDRESS_8: string;
RENTAL_COMP_DISTANCE_8: number;
RENTAL_COMP_HOMESTATUS_8: string;
RENTAL_COMP_HOMETYPE_8: string;
RENTAL_COMP_ZESTIMATE_8: number;
RENTAL_COMP_LIVINGAREA_8: number;

RENTAL_COMP_BATHROOMS_9: number;
RENTAL_COMP_BEDROOMS_9: number;
RENTAL_COMP_RENTZESTIMATE_9: number;
RENTAL_COMP_ADDRESS_9: string;
RENTAL_COMP_DISTANCE_9: number;
RENTAL_COMP_HOMESTATUS_9: string;
RENTAL_COMP_HOMETYPE_9: string;
RENTAL_COMP_ZESTIMATE_9: number;
RENTAL_COMP_LIVINGAREA_9: number;

RENTAL_COMP_BATHROOMS_10: number;
RENTAL_COMP_BEDROOMS_10: number;
RENTAL_COMP_RENTZESTIMATE_10: number;
RENTAL_COMP_ADDRESS_10: string;
RENTAL_COMP_DISTANCE_10: number;
RENTAL_COMP_HOMESTATUS_10: string;
RENTAL_COMP_HOMETYPE_10: string;
RENTAL_COMP_ZESTIMATE_10: number;
RENTAL_COMP_LIVINGAREA_10: number;

RENTAL_COMP_BATHROOMS_11: number;
RENTAL_COMP_BEDROOMS_11: number;
RENTAL_COMP_RENTZESTIMATE_11: number;
RENTAL_COMP_ADDRESS_11: string;
RENTAL_COMP_DISTANCE_11: number;
RENTAL_COMP_HOMESTATUS_11: string;
RENTAL_COMP_HOMETYPE_11: string;
RENTAL_COMP_ZESTIMATE_11: number;
RENTAL_COMP_LIVINGAREA_11: number;

RENTAL_COMP_BATHROOMS_12: number;
RENTAL_COMP_BEDROOMS_12: number;
RENTAL_COMP_RENTZESTIMATE_12: number;
RENTAL_COMP_ADDRESS_12: string;
RENTAL_COMP_DISTANCE_12: number;
RENTAL_COMP_HOMESTATUS_12: string;
RENTAL_COMP_HOMETYPE_12: string;
RENTAL_COMP_ZESTIMATE_12: number;
RENTAL_COMP_LIVINGAREA_12: number;

RENTAL_COMP_BATHROOMS_13: number;
RENTAL_COMP_BEDROOMS_13: number;
RENTAL_COMP_RENTZESTIMATE_13: number;
RENTAL_COMP_ADDRESS_13: string;
RENTAL_COMP_DISTANCE_13: number;
RENTAL_COMP_HOMESTATUS_13: string;
RENTAL_COMP_HOMETYPE_13: string;
RENTAL_COMP_ZESTIMATE_13: number;
RENTAL_COMP_LIVINGAREA_13: number;

RENTAL_COMP_BATHROOMS_14: number;
RENTAL_COMP_BEDROOMS_14: number;
RENTAL_COMP_RENTZESTIMATE_14: number;
RENTAL_COMP_ADDRESS_14: string;
RENTAL_COMP_DISTANCE_14: number;
RENTAL_COMP_HOMESTATUS_14: string;
RENTAL_COMP_HOMETYPE_14: string;
RENTAL_COMP_ZESTIMATE_14: number;
RENTAL_COMP_LIVINGAREA_14: number;

RENTAL_COMP_BATHROOMS_15: number;
RENTAL_COMP_BEDROOMS_15: number;
RENTAL_COMP_RENTZESTIMATE_15: number;
RENTAL_COMP_ADDRESS_15: string;
RENTAL_COMP_DISTANCE_15: number;
RENTAL_COMP_HOMESTATUS_15: string;
RENTAL_COMP_HOMETYPE_15: string;
RENTAL_COMP_ZESTIMATE_15: number;
RENTAL_COMP_LIVINGAREA_15: number;

RENTAL_COMP_BATHROOMS_16: number;
RENTAL_COMP_BEDROOMS_16: number;
RENTAL_COMP_RENTZESTIMATE_16: number;
RENTAL_COMP_ADDRESS_16: string;
RENTAL_COMP_DISTANCE_16: number;
RENTAL_COMP_HOMESTATUS_16: string;
RENTAL_COMP_HOMETYPE_16: string;
RENTAL_COMP_ZESTIMATE_16: number;
RENTAL_COMP_LIVINGAREA_16: number;

RENTAL_COMP_BATHROOMS_17: number;
RENTAL_COMP_BEDROOMS_17: number;
RENTAL_COMP_RENTZESTIMATE_17: number;
RENTAL_COMP_ADDRESS_17: string;
RENTAL_COMP_DISTANCE_17: number;
RENTAL_COMP_HOMESTATUS_17: string;
RENTAL_COMP_HOMETYPE_17: string;
RENTAL_COMP_ZESTIMATE_17: number;
RENTAL_COMP_LIVINGAREA_17: number;

RENTAL_COMP_BATHROOMS_18: number;
RENTAL_COMP_BEDROOMS_18: number;
RENTAL_COMP_RENTZESTIMATE_18: number;
RENTAL_COMP_ADDRESS_18: string;
RENTAL_COMP_DISTANCE_18: number;
RENTAL_COMP_HOMESTATUS_18: string;
RENTAL_COMP_HOMETYPE_18: string;
RENTAL_COMP_ZESTIMATE_18: number;
RENTAL_COMP_LIVINGAREA_18: number;

RENTAL_COMP_BATHROOMS_19: number;
RENTAL_COMP_BEDROOMS_19: number;
RENTAL_COMP_RENTZESTIMATE_19: number;
RENTAL_COMP_ADDRESS_19: string;
RENTAL_COMP_DISTANCE_19: number;
RENTAL_COMP_HOMESTATUS_19: string;
RENTAL_COMP_HOMETYPE_19: string;
RENTAL_COMP_ZESTIMATE_19: number;
RENTAL_COMP_LIVINGAREA_19: number;

RENTAL_COMP_BATHROOMS_20: number;
RENTAL_COMP_BEDROOMS_20: number;
RENTAL_COMP_RENTZESTIMATE_20: number;
RENTAL_COMP_ADDRESS_20: string;
RENTAL_COMP_DISTANCE_20: number;
RENTAL_COMP_HOMESTATUS_20: string;
RENTAL_COMP_HOMETYPE_20: string;
RENTAL_COMP_ZESTIMATE_20: number;
RENTAL_COMP_LIVINGAREA_20: number;

//Rent output
RENT_COMP_RENT_PER_SQFT_Mean: number;
RENT_COMP_RENT_PER_SQFT_Median: number;
RENT_COMP_RENT_PER_BED_1: number;
RENT_COMP_RENT_PER_BED_2: number;
RENT_COMP_RENT_PER_BED_3: number;
RENT_COMP_RENT_PER_BED_4: number;
RENT_COMP_RENT_PER_BED_Mean: number;
RENT_COMP_RENT_PER_BED_Median: number;
"Rent Comp Rent by sq ft (mean)": number;
"Rent Comp Rent by sq ft (median)": number;
"Rent Comp Rent by bed (mean)": number;
"Rent Comp Rent by bed (median)": number;
"Rent Comp Valuation by sq ft (median)": number;
"Rent Comp Valuation by sq ft (mean)": number;
"Rent Comp Valuation by bed (median)": number;
"Rent Comp Valuation by bed (mean)": number;

//Sale output
"Sale Comp Valuation by sq ft (median)": number;
"Sale Comp Valuation by sq ft (mean)": number;
"Sale Comp Valuation by bed (median)": number;
"Sale Comp Valuation by bed (mean)": number;



//Third-party
"Zillow rent valuation": number;
"Zillow low estimate": number;
"Zillow high estimate": number;

// images
"Google Maps Image URL": string;
"Google Earth Image URL": string;
zillow_image_1: string;
zillow_image_2: string;
zillow_image_3: string;
zillow_image_4: string;
zillow_image_5: string;
zillow_image_6: string;
zillow_image_7: string;
zillow_image_8: string;
zillow_image_9: string;
zillow_image_10: string;
zillow_image_11: string;
zillow_image_12: string;
zillow_image_13: string;
zillow_image_14: string;
zillow_image_15: string;
zillow_image_16: string;
zillow_image_17: string;
zillow_image_18: string;
zillow_image_19: string;
zillow_image_20: string;

//Local Market
postal_code: number;
month_date_yyyymm: string;
median_listing_price: number;
average_listing_price: number;
active_listing_count: number;
total_listing_count: number;
new_listing_count: number;
price_increased_count: number;
active_listing_count_M_o_M_Increase: number;
total_listing_count_M_o_M_Increase: number;
new_listing_count_M_o_M_Increase: number;
price_increased_count_M_o_M_Increase: number;
median_days_on_market: number;
median_days_on_market_M_o_M_Increase: number;
median_listing_price_M_o_M_Increase: number;
average_listing_price_M_o_M_Increase: number;
Overall_Niche_Grade: number;
Public_Schools: number;
Housing: number;
Nightlife: number;
Good_for_Families: number;
Diversity: number;
Jobs: number;
Weather: number;
Cost_of_Living: number;
Health_And_Fitness: number;
Outdoor_Activities: number;
Commute: number;
Median_Home_Value: number;
National_Median_Home_Value: number;
Median_Rent: number;
National_Median_Rent: number;
Area_Feel: string;
Rent_vs_Own_Own: number;
Rent_vs_Own_Rent: number;
Education_Bachelors_Degree: number;
Education_High_School_Diploma: number;
Education_Less_Than_High_School: number;
Education_Masters_Or_Higher: number;
Education_Some_College: number;
Education_Bachelors_National: number;
Education_High_School_Diploma_National: number;
Education_Less_Than_High_School_National: number;
Education_Masters_Or_Higher_National: number;
Education_Some_College_National: number;

School_Name_1: string;
Location_1: string;
Grade_1: number;
Review_Average_1: number;
Review_Count_1: number;

School_Name_2: string;
Location_2: string;
Grade_2: number;
Review_Average_2: number;
Review_Count_2: number;

School_Name_3: string;
Location_3: string;
Grade_3: number;
Review_Average_3: number;
Review_Count_3: number;

School_Name_4: string;
Location_4: string;
Grade_4: number;
Review_Average_4: number;
Review_Count_4: number;

School_Name_5: string;
Location_5: string;
Grade_5: number;
Review_Average_5: number;
Review_Count_5: number;

School_Name_6: string;
Location_6: string;
Grade_6: number;
Review_Average_6: number;
Review_Count_6: number;

School_Name_7: string;
Location_7: string;
Grade_7: number;
Review_Average_7: number;
Review_Count_7: number;

School_Name_8: string;
Location_8: string;
Grade_8: number;
Review_Average_8: number;
Review_Count_8: number;

School_Name_9: string;
Location_9: string;
Grade_9: number;
Review_Average_9: number;
Review_Count_9: number;

School_Name_10: string;
Location_10: string;
Grade_10: number;
Review_Average_10: number;
Review_Count_10: number;

};
