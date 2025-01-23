import express, { Request, Response } from "express";
import Properties from "../models/properties";

const propertiesRouter = express.Router();

propertiesRouter.get("/get-properties", async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const limit = 15;
    const skip = (page - 1) * limit;

    const search = (req.query.search as string) || ""; // Search query
    const county = (req.query.county as string) || "";
    const propertyType = (req.query.propertyType as string) || "";
    const ownerType = (req.query.ownerType as string) || "";
    const state = (req.query.state as string) || "";

    const filter: any = {};

    // Handle `search` query: searches in both `ADDRESS_FROM_INPUT` and `County`
    if (search && search !== "") {
      filter.$or = [
        { ADDRESS_FROM_INPUT: { $regex: search, $options: "i" } },
        { County: { $regex: search, $options: "i" } },
      ];
    }

    // Handle `county` query: filters only by `County`
    if (county && county !== "") {
      const counties = county.split(",").map((item) => item.trim());
      filter.County = {
        $in: counties.map((county) => new RegExp(county, "i")),
      };
    }

    // Handle `propertyType` query: filters by `PROPERTY_CLASS`
    if (propertyType && propertyType !== "") {
      const propertyTypes = propertyType.split(",").map((item) => item.trim());
      filter.PROPERTY_CLASS = {
        $in: propertyTypes.map((type) => new RegExp(type, "i")),
      };
    }

    // Handle `ownerType` query: filters by `OWNERSHIP_TYPE`
    if (ownerType && ownerType !== "") {
      const ownerTypes = ownerType.split(",").map((item) => item.trim());
      filter.OWNERSHIP_TYPE = {
        $in: ownerTypes.map((type) => new RegExp(type, "i")),
      };
    }

    // Handle `state` query: filters by `MAIL_ADDRESS_STATE`
    if (state && state !== "") {
      const states = state.split(",").map((item) => item.trim());
      filter.MAIL_ADDRESS_STATE = {
        $in: states.map((stateItem) => new RegExp(stateItem, "i")),
      };
    }

    // Execute queries
    const [
      properties,
      total,
      allCounties,
      allPropertyTypes,
      allOwnerTypes,
      allStates,
    ] = await Promise.all([
      Properties.find(filter).skip(skip).limit(limit),
      Properties.countDocuments(filter),
      Properties.distinct("County"),
      Properties.distinct("PROPERTY_CLASS"),
      Properties.distinct("OWNERSHIP_TYPE"),
      Properties.distinct("MAIL_ADDRESS_STATE"),
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
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while fetching properties.",
      error: err.message,
    });
  }
});

export default propertiesRouter;
