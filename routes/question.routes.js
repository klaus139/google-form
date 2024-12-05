import express from "express"
import { createForm } from "../controllers/question.controller.js";
import { authorizeAdmin, ensureAuthenticated } from "../middleware/authenticated.js";

const router = express.Router()

router.post("/create-form", ensureAuthenticated, authorizeAdmin, createForm)

export default router;