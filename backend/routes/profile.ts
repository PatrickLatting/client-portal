import express, { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import userAuth from "../middlewares/auth";

const profileRouter = express.Router();

profileRouter.get(
  "/profile/view",
  userAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        res.status(404).send("User not found");
        return;
      }
      res.send(user);
    } catch (err) {
      console.error("Error in profile router:", err);
      res.status(500).send("Internal server error");
    }
  }
);

export default profileRouter;
