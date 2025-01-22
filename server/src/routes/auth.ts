import express, { Request, Response } from "express";
const authRouter = express.Router();
import User from "../models/user";
import { validateSignUpData } from "../utils/validation";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Signup Route
authRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<void> => {
    try {
      validateSignUpData(req);
      const {
        name,
        organization,
        emailId,
        occupation,
        other,
        howDidYouHearAboutUs,
        password,
      } = req.body;

      const existingUser = await User.findOne({ emailId });
      if (existingUser) {
        res.status(400).send("This email is already in use.");
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        organization,
        emailId,
        occupation,
        other,
        howDidYouHearAboutUs,
        password: passwordHash,
      });
      await user.save();
      res.send("User added successfully.");
    } catch (err: any) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

// Login Route
authRouter.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { emailId, password } = req.body;
      if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email");
      }

      const user = await User.findOne({ emailId });
      if (!user) {
        throw new Error("Invalid credentials.");
      }

      const isPasswordValid = await user.validatePassword(password);

      if (isPasswordValid) {
        const token = await user.getJwt();

        res.cookie("token", token);
        res.json(user);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err: any) {
      res.status(400).send(`Error : ${err.message}`);
    }
  }
);

// Forgot Password Route
authRouter.post(
  "/forgot-password",
  async (req: Request, res: Response): Promise<void> => {
    const { emailId } = req.body;

    try {
      const user = await User.findOne({ emailId });
      if (!user) {
        res.status(404).send("User not found.");
        return;
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpire = Date.now() + 3600000;

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = resetTokenExpire;
      await user.save();

      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
      
      // HTML email template
      const htmlEmail = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                max-width: 600px;
                margin: 0 auto;
              }
              .container {
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 5px;
              }
              .header {
                background-color: #4A90E2;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
              }
              .content {
                background-color: white;
                padding: 20px;
                border-radius: 0 0 5px 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4A90E2;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 0.8em;
                color: #666666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div style="text-align: center;">
                  <a href="${resetURL}" class="button">Reset Password</a>
                </div>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                <div class="footer">
                  <p>This is an automated message, please do not reply directly to this email.</p>
                  <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      // Send the email with both HTML and plain text versions
      const info = await transporter.sendMail({
        from: '"Support Team" <support@example.com>',
        to: emailId,
        subject: "Password Reset Request",
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetURL}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.`,
        html: htmlEmail,
      });

      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      res.status(200).send("Password reset link sent to your email.");
    } catch (error: any) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

authRouter.post(
  "/reset-password/:resetToken",
  async (req: Request, res: Response): Promise<void> => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;
    if (!validator.isStrongPassword(newPassword)) {
      res.status(400).json({
        error:
          "Password should be at least 8 characters long, and include at least one lowercase letter, one uppercase letter, one number, and one symbol.",
      });
      return;
    }
    try {
      // Find the user with the given reset token and check expiration
      const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpire: { $gt: Date.now() }, // Token must not be expired
      });

      if (!user) {
        res.status(400).send("Invalid or expired token.");
        return;
      }

      // Hash the new password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Update the user's password and remove the token fields
      user.password = passwordHash;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(200).send("Password updated successfully.");
    } catch (error: any) {
      res.status(500).send("Error: " + error);
    }
  }
);

// Logout Route
authRouter.post(
  "/logout",
  async (req: Request, res: Response): Promise<void> => {
    res
      .cookie("token", null, { expires: new Date(Date.now()) })
      .send("Logout successful");
  }
);

export default authRouter;
