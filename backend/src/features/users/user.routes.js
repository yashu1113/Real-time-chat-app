import express from "express";
import protectRoute from "../../shared/middleware/protectRoute.js";
import { getUsersForSidebar } from "./user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);

export default router;
