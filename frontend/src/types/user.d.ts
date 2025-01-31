export interface IUser {
  _id: unknown;
  name: string;
  emailId: string;
  password: string;
  organization?: string;
  occupation?: string;
  other?: string;
  howDidYouHearAboutUs: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: number;
  savedProperties: string[]; // An array of property IDs (strings)
  propertiesActions: IPropertyAction[]; // Use a separate interface for the actions
}

export interface IPropertyAction {
  _id: unknown;
  actionType: "bid" | "imageRequest"; // Enum for action type
  propertyId: string; // ID of the property involved
  bidAmount: number | string; // `bidAmount` can be a number or "N/A"
  address: string; // Address of the property
  date: string; // Date as a string, typically in ISO format
  time: string; // Time as a string, typically in ISO format
  updated: boolean; // Indicates whether the action was updated
}
