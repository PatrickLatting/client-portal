import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the IUser interface
export interface IUser extends Document {
  name: string;
  emailId: string;
  password: string;
  organization?: string;
  occupation?: string;
  other?: string;
  howDidYouHearAboutUs: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: number;
  savedProperties: string[];
  propertiesActions: {
    actionType: "bid" | "imageRequest" | "titleRequest"; // Enum for action type
    propertyId: string;
    bidAmount: number | string; // `bidAmount` can now be a number or "N/A"
    address: string;
    date: Date;
    time: Date;
    updated: boolean;
  }[];
  getJwt(): Promise<string>;
  validatePassword(inputPassword: string): Promise<boolean>;
}

// Define the schema
const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: { type: String, required: true },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Invalid email address",
      },
    },
    password: { type: String, required: true, minlength: 8 },
    organization: { type: String, default: "" },
    occupation: {
      type: String,
      enum: [
        "broker",
        "institutional investor",
        "professional flipper",
        "other",
      ],
      required: true,
    },
    other: { type: String, default: "" },
    howDidYouHearAboutUs: { type: String, maxlength: 50 },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpire: { type: Number, default: 0 },
    savedProperties: { type: [String], default: [] },
    propertiesActions: [
      {
        actionType: {
          type: String,
          enum: ["bid", "imageRequest", "titleRequest"],
          required: true,
        },
        propertyId: { type: String, required: true },
        bidAmount: {
          type: Schema.Types.Mixed,
          default: "N/A", // Default value is "N/A"
          validate: {
            validator: function (value: any) {
              return value === "N/A" || typeof value === "number";
            },
            message: "bidAmount should be a number or 'N/A'",
          },
        },
        address: String,
        date: { type: Date, default: Date.now },
        time: { type: Date, default: Date.now },
        updated: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// Define instance methods
userSchema.methods.getJwt = async function (): Promise<string> {
  const user = this;
  const token = jwt.sign({ _id: user._id }, `${process.env.JWT_SECRET_KEY}`, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (
  inputPassword: string
): Promise<boolean> {
  const user = this;
  return await bcrypt.compare(inputPassword, user.password);
};

// Create and export the model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
