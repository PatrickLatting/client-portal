# Application Documentation

## Overview

This application is a React-based web app that manages user authentication, property listings, and related functionalities. The app uses React Router for navigation, provides context for user state management, and implements a toast notification system.

## Components

### Context

- **UserContext**
  - Provides global state management for:
    - `loggedIn`: Boolean indicating whether a user is logged in.
    - `setLoggedIn`: Function to update the `loggedIn` state.
    - `user`: Object of type `IUser` or `null` representing the current user.
    - `setUser`: Function to update the `user` state.

### Toast

- **ToastProvider**
  - Wraps the app to provide toast notification functionality.
- **Toaster**
  - Displays toasts for user feedback.

## Pages

### 1. **AppTemplate**

- Acts as a layout component for pages rendered within the app.

### 2. **LoginPage**

- Handles user login functionality.

### 3. **HomePage**

- Default page for unauthenticated users.
- Redirects to `PropertyListingPage` if the user is logged in.

### 4. **PropertyListingPage**

- Displays a list of properties.

### 5. **SignupPage**

- Allows users to register for an account.

### 6. **AboutPage**

- Provides information about the app.

### 7. **ForgotPassword**

- Allows users to initiate the password recovery process.

### 8. **ResetPassword**

- Allows users to reset their password using a `resetToken` passed as a URL parameter.

### 9. **PropertyDetailsPage**

- Displays details of a specific property identified by `propId` in the URL.

### 10. **SavedPropertiesPage**

- Displays a list of properties saved by the user.

### 11. **OrderHistory**

- Displays the user's order history.

### 12. **StateLawPage**

- Displays state-specific property laws.

## Routes

The app uses `react-router-dom` to define routes.

### Route Configuration

| Path                          | Component           | Description                                                |
| ----------------------------- | ------------------- | ---------------------------------------------------------- |
| `/`                           | AppTemplate         | Base template wrapping all routes.                         |
| `/login`                      | LoginPage           | User login page.                                           |
| `/sign-up`                    | SignupPage          | User registration page.                                    |
| `/about`                      | AboutPage           | Page with information about the app.                       |
| `/forgot-password`            | ForgotPassword      | Page to initiate password recovery.                        |
| `/reset-password/:resetToken` | ResetPassword       | Page to reset the password using a token.                  |
| `/property-details/:propId`   | PropertyDetailsPage | Page to view details of a specific property.               |
| `/my-properties`              | SavedPropertiesPage | Page displaying properties saved by the user.              |
| `/order-history`              | OrderHistory        | Page displaying the user's order history.                  |
| `/state-laws`                 | StateLawPage        | Page displaying state-specific laws related to properties. |

## State Management

State is managed using:

1. **React Context (**``**)**
   - Provides global access to `loggedIn` and `user` states.
2. **useState Hooks**
   - Local state for logged-in status and user details.

## Key Features

1. **Authentication**

   - Login and signup pages allow users to authenticate.
   - State management ensures logged-in users can access specific pages.

2. **Property Management**

   - Property listing and details view.
   - Ability to save properties.

3. **Notifications**

   - Toast notifications for user actions (e.g., successful login, errors).

## Dependencies

### Key Libraries

- `react-router-dom`: For client-side routing.
- `react`: For building user interfaces.
- `react-toast`: For toast notifications.

### Types

- **IUser**: Interface representing the user object.

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```

## Notes

- Ensure environment variables are configured correctly for API calls.
- Use the `UserContext` to manage user authentication and property-related actions.

For additional details, refer to the individual component or page documentation.
