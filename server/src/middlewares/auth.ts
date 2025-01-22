import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

interface AuthenticatedRequest extends Request {
  user?: any; // Replace `any` with the appropriate type if you have a `User` type.
}

const userAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).send("Please Login!");
      return; // Ensure no value is returned
    }

    const decodeObj = jwt.verify(token, "clientPortal@secret") as {
      _id: string;
    };

    const user = await User.findById(decodeObj._id);
    if (!user) {
      res.status(404).send("User not found");
      return; // Ensure no value is returned
    }

    req.user = user;
    next(); // Pass control to the next middleware
  } catch (err) {
    console.error("Error in userAuth middleware:", err);
    res
      .status(400)
      .send("ERROR: " + (err instanceof Error ? err.message : err));
  }
};

export { AuthenticatedRequest };
export default userAuth;
