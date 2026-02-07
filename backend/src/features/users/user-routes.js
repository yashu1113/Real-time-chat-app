import express from "express";
import { authMiddleware } from "../auth/auth-middleware.js";
import { getUsers } from "./user-controller.js";

const router = express.Router();


router.get("/", authMiddleware, getUsers);

export default router;
