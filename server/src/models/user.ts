import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  getJwt(): Promise<string>;
  validatePassword(inputPassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: { type: String, required: true, minlength: 8 },
    organization: { type: String, default: "" },
    occupation: {
      type: String,
      enum: {
        values: [
          "broker",
          "institutional investor",
          "professional flipper",
          "other",
        ],
        message: `{VALUE} is not a valid occupation.`,
      },
      required: true,
    },
    other: { type: String, default: "" },
    howDidYouHearAboutUs: { type: String, maxlength: 50 },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpire: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.methods.getJwt = async function (): Promise<string> {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "clientPortal@secret", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (
  inputPassword: string
): Promise<boolean> {
  const user = this;
  const isPasswordValid = await bcrypt.compare(inputPassword, user.password);
  return isPasswordValid;
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
