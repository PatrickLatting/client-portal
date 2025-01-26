import axios from "axios";
import { PropertyDetails } from "../types/propertyTypes";

export const fetchProperty = async (
  propId: string
): Promise<PropertyDetails | null> => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/property-details/${propId}`
    );
    return res.data.data as PropertyDetails;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error fetching property:", err.message);
    } else {
      console.error("An unknown error occurred while fetching property");
    }
    return null;
  }
};
