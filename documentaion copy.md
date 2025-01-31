# Properties Portal Backend Documentation

## Introduction

The `propertiesRouter` is a set of routes that manage properties-related actions, including searching, saving, unsaving, bidding, and viewing property details. These routes are designed to work with the Express.js framework and integrate with MongoDB through Mongoose models.

## Database Schema

### **Properties Schema**

The `Properties` schema is designed to handle a variety of property-related data. Key fields include:

- **ID**: Unique identifier for the property.
- **ADDRESS_FROM_INPUT**: Address of the property.
- **County**: County in which the property is located.
- **PROPERTY_CLASS**: Type of the property (e.g., residential, commercial).
- **OWNERSHIP_TYPE**: Ownership type (e.g., individual, institutional).
- **MAIL_ADDRESS_STATE**: State in which the property is located.

Additional fields in the schema can store financial data, transaction history, mortgage details, tax records, foreclosure status, etc.

### **User Schema**

The `User` schema handles user authentication and profile-related data. Key fields include:

- **name**: Full name of the user.
- **emailId**: Unique email address of the user.
- **password**: Encrypted password for authentication.
- **organization**: Organization the user belongs to (optional).
- **occupation**: The user’s occupation, such as broker, investor, or flipper.
- **savedProperties**: Array of property IDs saved by the user.
- **propertiesActions**: Logs actions taken on properties (e.g., bids or image requests).

### **Instance Methods for User Schema**:

1. **getJwt()**: Generates a JWT token for the user.
2. **validatePassword(inputPassword)**: Validates the provided password against the stored hash.

## Routes Overview

### 1. **GET /get-properties**

- **Purpose**: Fetch a list of properties with pagination and filtering capabilities.
- **Query Parameters**:
  - `page`: Page number for pagination (defaults to 1).
  - `search`, `county`, `propertyType`, `ownerType`, `state`: Filters for searching properties.
- **Response**: Returns a list of properties matching the filters, along with metadata like total number of properties and total pages for pagination.

### 2. **GET /property-details/:propId**

- **Purpose**: Fetch details of a specific property by its `propId`.
- **Response**: Returns the property details or a 404 error if the property is not found.

### 3. **POST /property/save**

- **Purpose**: Allows authenticated users to save a property to their saved list.
- **Authentication**: Uses `userAuth` middleware to ensure the user is logged in.
- **Request Body**: `propertyId` — ID of the property to save.
- **Response**: Returns the updated list of saved properties for the user.

### 4. **POST /property/unsave**

- **Purpose**: Allows authenticated users to remove a property from their saved list.
- **Authentication**: Uses `userAuth` middleware to ensure the user is logged in.
- **Request Body**: `propertyId` — ID of the property to unsave.
- **Response**: Returns the updated list of saved properties for the user.

### 5. **POST /property/action**

- **Purpose**: Handles actions on a property, such as placing a bid or requesting an image.
- **Request Body**:
  - `propertyId`: The ID of the property.
  - `actionType`: Either "bid" or "imageRequest".
  - `bidAmount`: The bid amount (required if action is a "bid").
  - `address`: The address of the property.
  - `emailId`: The email to send notifications to.
- **Response**: Returns the updated list of actions taken on properties by the user.

### 6. **GET /saved-properties**

- **Purpose**: Retrieve the list of properties saved by the authenticated user.
- **Authentication**: Uses `userAuth` middleware to ensure the user is logged in.
- **Response**: Returns the saved properties or a 404 error if no properties are saved.

## Detailed Functionality

### **GET /get-properties**

- Fetches properties based on pagination, search queries, and filters.
- Allows searching by address, county, property type, owner type, and state.
- Supports pagination with a default limit of 15 items per page.

### **GET /property-details/:propId**

- Retrieves detailed information of a single property based on its ID (`propId`).
- If the property is not found, a 404 status is returned.

### **POST /property/save**

- Adds a property to the user's list of saved properties.
- The route requires user authentication to ensure the request is made by a valid user.
- The user's saved properties list is updated and returned in the response.

### **POST /property/unsave**

- Removes a property from the user's list of saved properties.
- Similar to the save route, authentication is required, and the list of saved properties is returned after the update.

### **POST /property/action**

- Supports two types of actions: "bid" and "imageRequest".
  - **Bid**: If the action is a bid, the bid amount is validated and the bid is placed.
  - **Image Request**: Sends an email to notify the property owner about the image request. Additionally, the system prevents multiple image requests within a minute.
- After an action is taken, it is logged to the user's `propertiesActions` list.
- Both types of actions result in an updated list of actions taken by the user, which is returned in the response.

### **GET /saved-properties**

- Fetches all properties saved by the authenticated user.
- Returns an array of property details based on the saved property IDs.
- If no saved properties are found, a 404 error is returned.

## Key Features

### **User Authentication**

- Many routes, such as saving, unsaving, and taking actions on properties, require the user to be authenticated via the `userAuth` middleware. This middleware ensures that only authenticated users can perform actions on properties.

### **Email Notifications**

- For "imageRequest" and "bid" actions, email notifications are sent to the specified email (`emailId`) to alert the property owner about the action.

### **Property Search and Filters**

- The `/get-properties` route supports multiple filters, including address, county, property type, owner type, and state. It allows users to search for properties efficiently based on these filters.

### **Bid Management**

- The `/property/action` route supports placing bids on properties, ensuring valid bid amounts and providing feedback on successful bids.

### **Action History**

- The actions taken by users (such as bidding or image requests) are stored in the user's `propertiesActions` array. This enables tracking of all actions performed on properties by each user.

## Error Handling

- **404 Errors**: If a property or user is not found, the route returns a 404 error with a descriptive message.
- **400 Errors**: Invalid data or missing required fields (such as property ID or bid amount) results in a 400 error with an appropriate message.
- **500 Errors**: Any internal server errors are handled and logged, with a 500 status code and error message returned to the user.
