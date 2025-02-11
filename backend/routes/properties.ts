import express, { Request, Response } from "express";
import Properties from "../models/properties";
import userAuth, { AuthenticatedRequest } from "../middlewares/auth";
import User, { IUser } from "../models/user";
import { sendMail } from "../utils/sendMail"; // Import the sendMail function
import mongoose from "mongoose";

const propertiesRouter = express.Router();

propertiesRouter.get("/get-properties", async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const limit = 15;
    const skip = (page - 1) * limit;

    const search = (req.query.search as string) || "";
    const county = (req.query.county as string) || "";
    const propertyType = (req.query.propertyType as string) || "";
    const ownerType = (req.query.ownerType as string) || "";
    const state = (req.query.state as string) || "";
    const ownerOccupancy = (req.query.ownerOccupancy as string) || "";

    // Get date parameters directly as strings
    const fromDate = (req.query.fromDate as string) || undefined;
    const toDate = (req.query.toDate as string) || undefined;

    // Log incoming date parameters
    // console.log("Incoming date parameters:", { fromDate, toDate });

    const yearBuiltFrom = parseInt(req.query.yearBuiltFrom as string, 10);
    const yearBuiltTo = parseInt(req.query.yearBuiltTo as string, 10);
    const estimatedFrom = parseFloat(req.query.estimatedFrom as string);
    const estimatedTo = parseFloat(req.query.estimatedTo as string);

    const filter: any = {};

    // Handle date range filter (SALE_DATE_1) - using string comparison
    if (fromDate || toDate) {
      filter.SALE_DATE_1 = {};
      if (fromDate) {
        filter.SALE_DATE_1.$gte = fromDate;
      }
      if (toDate) {
        filter.SALE_DATE_1.$lte = toDate;
      }
    }

    // Handle search query
    if (search && search !== "") {
      filter.$or = [
        { Address: { $regex: search, $options: "i" } },
        { County: { $regex: search, $options: "i" } },
      ];
    }

    // Handle county query
    if (county && county !== "") {
      const counties = county.split(",").map((item) => item.trim());
      filter.County = {
        $in: counties.map((county) => new RegExp(county, "i")),
      };
    }

    // Handle property type query
    if (propertyType && propertyType !== "") {
      const propertyTypes = propertyType.split(",").map((item) => item.trim());
      filter.LAND_USE = {
        $in: propertyTypes.map((type) => new RegExp(type, "i")),
      };
    }

    // Handle owner type query
    if (ownerType && ownerType !== "") {
      const ownerTypes = ownerType.split(",").map((item) => item.trim());
      filter.OWNERSHIP_TYPE = {
        $in: ownerTypes.map((type) => new RegExp(type, "i")),
      };
    }

    // Handle state query
    if (state && state !== "") {
      const states = state.split(",").map((item) => item.trim());
      filter.State = {
        $in: states.map((stateItem) => new RegExp(stateItem, "i")),
      };
    }

    // Handle owner occupancy query
    if (ownerOccupancy && ownerOccupancy !== "") {
      const ownerOccupancies = ownerOccupancy
        .split(",")
        .map((item) => item.trim());
      filter.OWNER_OCCUPANCY = {
        $in: ownerOccupancies.map((occupancy) => new RegExp(occupancy, "i")),
      };
    }

    // Handle year built filter
    if (!isNaN(yearBuiltFrom) || !isNaN(yearBuiltTo)) {
      filter.YEAR_BUILT = {};
      if (!isNaN(yearBuiltFrom)) {
        filter.YEAR_BUILT.$gte = yearBuiltFrom;
      }
      if (!isNaN(yearBuiltTo)) {
        filter.YEAR_BUILT.$lte = yearBuiltTo;
      }
    }

    // Handle estimated value filter
    if (!isNaN(estimatedFrom) || !isNaN(estimatedTo)) {
      filter.ESTIMATED_VALUE = {};
      if (!isNaN(estimatedFrom)) {
        filter.ESTIMATED_VALUE.$gte = estimatedFrom;
      }
      if (!isNaN(estimatedTo)) {
        filter.ESTIMATED_VALUE.$lte = estimatedTo;
      }
    }

    // Log the final filter for debugging
    // console.log("Final filter:", JSON.stringify(filter, null, 2));

    // Execute queries
    const [
      properties,
      total,
      allCounties,
      allPropertyTypes,
      allOwnerTypes,
      allStates,
      allOwnerOccupancy,
    ] = await Promise.all([
      Properties.find(filter).skip(skip).limit(limit),
      Properties.countDocuments(filter),
      Properties.distinct("County"),
      Properties.distinct("LAND_USE"),
      Properties.distinct("OWNERSHIP_TYPE"),
      Properties.distinct("State"),
      Properties.distinct("OWNER_OCCUPANCY"),
    ]);

    // Return response
    res.json({
      data: properties,
      meta: {
        page,
        totalPages: Math.ceil(total / limit),
        totalCount: total,
      },
      allCounties,
      allOwnerTypes,
      allPropertyTypes,
      allStates,
      allOwnerOccupancy,
    });
  } catch (err: any) {
    console.error("Error in get-properties:", err);
    res.status(500).json({
      message: "An error occurred while fetching properties.",
      error: err.message,
    });
  }
});
propertiesRouter.get(
  "/property-details/:propId",
  async (req: Request, res: Response) => {
    try {
      const { propId } = req.params;

      const property = await Properties.findOne({ ID: propId });

      if (!property) {
        res.status(404).json({ message: "Property not found" });
        return;
      }

      res.status(200).json({ data: property });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
);

propertiesRouter.post(
  "/property/save",
  userAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        res.status(404).send("User not found");
        return;
      }

      const userId = req.user?._id;
      const { propertyId, propertyIds } = req.body;

      // Check if either single propertyId or array of propertyIds is provided
      if (!propertyId && !propertyIds) {
        res.status(400).json({ error: "Property ID(s) are required" });
        return;
      }

      // Convert single propertyId to array if provided
      const propertiesToSave = propertyId 
        ? [propertyId] 
        : Array.isArray(propertyIds) 
          ? propertyIds 
          : [];

      // Validate if propertyIds is an array when provided
      if (propertyIds && !Array.isArray(propertyIds)) {
        res.status(400).json({ error: "PropertyIds must be an array" });
        return;
      }

      // Update user's saved properties
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { savedProperties: { $each: propertiesToSave } } },
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json({
        message: `${propertiesToSave.length} ${
          propertiesToSave.length === 1 ? "property" : "properties"
        } saved successfully`,
        savedProperties: updatedUser.savedProperties,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
);


propertiesRouter.post(
  "/property/save-multiple",
  userAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        res.status(404).send("User not found");
        return;
      }

      const userId = req.user?._id;
      const { propertyIds } = req.body;

      // Validate propertyIds array
      if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
        res.status(400).json({ error: "Valid property IDs array is required" });
        return;
      }

      // Update user with multiple properties
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { savedProperties: { $each: propertyIds } } },
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json({
        message: `${propertyIds.length} properties saved successfully`,
        savedProperties: updatedUser.savedProperties,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
);
propertiesRouter.post(
  "/property/unsave",
  userAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        res.status(404).send("User not found");
        return;
      }

      const userId = req.user?._id;
      const { propertyId } = req.body;

      if (!propertyId) {
        res.status(400).json({ error: "Property ID is required" });
        return;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { savedProperties: propertyId } },
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json({
        message: "Property unsaved successfully",
        savedProperties: updatedUser.savedProperties,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
);

propertiesRouter.post(
  "/property/action",
  userAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { propertyId, bidAmount, actionType, address, emailId } = req.body;

      // Ensure actionType and propertyId are provided
      if (!propertyId || !actionType) {
        res
          .status(400)
          .json({ message: "propertyId and actionType are required" });
        return;
      }

      // Default bidAmount to "N/A" unless it's a bid
      let formattedBidAmount: number | string = "N/A"; // Default to "N/A"
      if (actionType === "bid") {
        if (bidAmount) {
          const parsedBidAmount = parseFloat(bidAmount);
          if (isNaN(parsedBidAmount)) {
            res.status(400).json({ message: "Invalid bid amount" });
            return;
          }
          formattedBidAmount = parsedBidAmount; // Valid number
        } else {
          res.status(400).json({ message: "Bid amount is required to bid" });
          return;
        }
      }

      const user: IUser = req.user as IUser;
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Handle the "imageRequest" action type
      if (actionType === "imageRequest") {
        // Check if an image request already exists within the last 1 minute
        const existingImageRequest = user.propertiesActions.find(
          (action) =>
            action.propertyId === propertyId &&
            action.actionType === "imageRequest" &&
            new Date().getTime() - new Date(action.date).getTime() < 60 * 1000 // 1 minute in milliseconds
        );

        if (existingImageRequest) {
          res.status(400).json({
            message:
              "You have already sent an image order request for this property. Please wait 1 minute before trying again.",
          });
          return;
        }

        // Send email notification for image order
        const emailSubject = "New Image Request Received";
        const emailText = `A user (${user.emailId}) has requested images for property located at ${address}.`;
        const emailHtml = `<p>New image request details:</p>
            <ul>
              <li>User: ${user.emailId}</li>
              <li>Property Address: ${address}</li>
              <li>Request Time: ${new Date().toLocaleString()}</li>
            </ul>`;

        const emailSuccess = await sendMail({
          to: `${process.env.EMAIL_USER}`,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
        });

        if (!emailSuccess) {
          console.error("Error sending email notification for image request.");
        }
      }

      // Handle the "titleRequest" action type

      if (actionType === "titleRequest") {
        const existingTitleRequest = user.propertiesActions.find(
          (action) =>
            action.propertyId === propertyId &&
            action.actionType === "titleRequest" &&
            new Date().getTime() - new Date(action.date).getTime() < 60 * 1000 // 1 minute in milliseconds
        );

        if (existingTitleRequest) {
          res.status(400).json({
            message:
              "You have already sent an title order request for this property. Please wait 1 minute before trying again.",
          });
          return;
        }

        // Send email notification for title order
        const emailSubject = "New Title Request Received";
        const emailText = `A user (${user.emailId}) has requested title for property located at ${address}.`;
        const emailHtml = `<p>New title request details:</p>
            <ul>
              <li>User: ${user.emailId}</li>
              <li>Property Address: ${address}</li>
              <li>Request Time: ${new Date().toLocaleString()}</li>
            </ul>`;

        const emailSuccess = await sendMail({
          to: `${process.env.EMAIL_USER}`,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
        });

        if (!emailSuccess) {
          console.error("Error sending email notification for title request.");
        }
      }

      // Handle the "bid" action type
      if (actionType === "bid") {
        // Send email notification for bid
        const ownerEmailSuccess = await sendMail({
          to: emailId,
          subject: "New Bid Received",
          text: `You have received a bid of $${formattedBidAmount} for property located at ${address}.`,
          html: `
            <p>You have received a new bid:</p>
            <ul>
              <li>Bid Amount: <strong>$${formattedBidAmount}</strong></li>
              <li>Property Address: <strong>${address}</strong></li>
              <li>Bid Time: ${new Date().toLocaleString()}</li>
            </ul>
          `,
        });

        // Send bid notification to admin
        const adminEmailSuccess = await sendMail({
          to: `${process.env.EMAIL_USER}`,
          subject: "New Bid Placed",
          text: `A new bid of $${formattedBidAmount} has been placed for property at ${address} by ${user.emailId}.`,
          html: `
            <p>New bid details:</p>
            <ul>
              <li>Bid Amount: <strong>$${formattedBidAmount}</strong></li>
              <li>Property Address: <strong>${address}</strong></li>
              <li>Bidder Email: ${user.emailId}</li>
              <li>Bid Time: ${new Date().toLocaleString()}</li>
            </ul>
          `,
        });

        if (!ownerEmailSuccess || !adminEmailSuccess) {
          console.error("Error sending one or more bid notifications.");
        }
      }

      // Create a new action, regardless of whether an action with the same propertyId and actionType exists
      user.propertiesActions.push({
        actionType,
        propertyId,
        bidAmount: formattedBidAmount, // Use formatted bidAmount (either number or "N/A")
        address,
        date: new Date(),
        time: new Date(),
        updated: false, // Mark the action as not updated
      });

      // Sort actions by date in descending order (latest first)
      user.propertiesActions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      await user.save();

      res.status(200).json({
        message: `${
          actionType.charAt(0).toUpperCase() + actionType.slice(1)
        } placed successfully`,
        propertiesActions: user.propertiesActions,
      });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
);

propertiesRouter.get(
  "/saved-properties",
  userAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;

      // Ensure the user exists
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Filter out invalid ObjectIDs and convert valid ones
      const savedPropertyIds = user.savedProperties
        .filter((id: string) => {
          try {
            // Test if the ID is valid before using it
            return mongoose.Types.ObjectId.isValid(id);
          } catch {
            return false;
          }
        })
        .map((id: string) => new mongoose.Types.ObjectId(id));

      if (!savedPropertyIds || savedPropertyIds.length === 0) {
        res.status(200).json({ properties: [] });
        return;
      }

      // Fetch properties whose _id is in the savedPropertyIds array
      const properties = await Properties.find({
        _id: { $in: savedPropertyIds },
      });

      res.status(200).json({ properties });
      return;
    } catch (err) {
      console.error("Error fetching saved properties:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
);

export default propertiesRouter;
