import validator from "validator";
import { Request } from "express";

export const validateSignUpData = (req: Request) => {
  const { name, emailId, password, occupation } = req.body;

  if (!name) {
    throw new Error("Name is not valid.");
  }
  if (!occupation) {
    throw new Error("Please enter valid occupation");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password should be minimum 8 character long and should contain atleast 1 lowercase, 1 uppercase, l number, and 1 symbol."
    );
  }
};
