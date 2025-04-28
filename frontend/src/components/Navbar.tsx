import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { SVGProps, useState } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useUser } from "../hooks/useUser";
import logo from "../assets/1914Logo.png";

export default function Component() {
  const { loggedIn, setUser, setLoggedIn, user } = useUser();
  const navigation = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUser(null);
      setLoggedIn(false);
      setIsSheetOpen(false); // Close the sheet after logout
      navigation("/"); // Redirect to home page
    } catch (err) {
      console.error(err);
    }
  };

  const LogoutButton = () => (
    <Button onClick={() => setIsAlertOpen(true)}>Log out</Button>
  );

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-10 justify-between">
      {/* Confirmation Alert Dialog for Logout */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header Content */}
      <div className="flex flex-row-reverse justify-between w-full lg:block">
        {/* Mobile Menu */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden ml-auto">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div>
              <Link
                to="/"
                className="mr-6"
                onClick={() => setIsSheetOpen(false)}
              >
                <img src={logo} alt="logo" className="w-[160px]" />
              </Link>
            </div>
            {/* Mobile menu items */}
            <div className="grid gap-2 py-6">
              {/* <Link
                to="/about"
                className="flex w-full items-center py-2 text-lg font-semibold"
                onClick={() => setIsSheetOpen(false)} // Close the sheet on click
              >
                About
              </Link> */}
              {loggedIn ? (
                <>
                  <Link
                    onClick={() => setIsSheetOpen(false)}
                    to="/"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                  >
                    Home
                  </Link>
                  <Link
                    onClick={() => setIsSheetOpen(false)}
                    to="/my-properties"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                  >
                    My Properties
                  </Link>
                  {/* <Link
                    onClick={() => setIsSheetOpen(false)}
                    to="/order-history"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                  >
                    Order History
                  </Link> */}
                   <Link
                    onClick={() => setIsSheetOpen(false)}
                    to="/state-laws"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                  >
                    State Law
                  </Link> 
                  <LogoutButton />
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex w-full items-center py-2 text-lg font-semibold"
                  onClick={() => setIsSheetOpen(false)} // Close the sheet on click
                >
                  Log In
                </Link>
              )}
              {!loggedIn && (
                <Link
                  to="/sign-up"
                  className="flex w-full items-center py-2 text-lg font-semibold"
                  onClick={() => setIsSheetOpen(false)} // Close the sheet on click
                >
                  Sign Up
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Logo */}
        <Link to="/" className="mr-6 lg:flex w-40">
          <img src={logo} alt="logo" />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="ml-auto hidden lg:flex gap-6">
        {/* <Link
          to="/about"
          className="group inline-flex h-9 w-max items-center justify-center"
        >
          About
        </Link> */}
        {loggedIn ? (
          <>
            <Link
              to="/"
              className="group inline-flex h-9 w-max items-center justify-center"
            >
             Home
            </Link>
            <Link
              to="/my-properties"
              className="group inline-flex h-9 w-max items-center justify-center"
            >
              My Properties
            </Link>
            {/*<Link
              to="/order-history"
              className="group inline-flex h-9 w-max items-center justify-center"
            >
              Order History
            </Link> */}
            <Link
              to="/state-laws"
              className="group inline-flex h-9 w-max items-center justify-center"
            >
              State Law
            </Link> 
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>{user?.name.match(/\w/)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsAlertOpen(true)}>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link
            to="/login"
            className="group inline-flex h-9 w-max items-center justify-center"
          >
            Log In
          </Link>
        )}
        {!loggedIn && (
          <Link
            to="/sign-up"
            className="group inline-flex h-9 w-max items-center justify-center"
          >
            Sign Up
          </Link>
        )}
      </nav>
    </header>
  );
}

// Mobile Menu Icon Component
function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
